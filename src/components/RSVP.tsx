import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { invitation } from "../data/invitation";
import { CornerSpray, Wreath } from "./decorations/Botanicals";
import { SectionHeading } from "./SectionHeading";
import { EASE, VIEWPORT } from "./motion";

type Attending = "yes" | "no" | "";

interface Values {
  name: string;
  phone: string;
  attending: Attending;
  guests: number;
  message: string;
}

type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const MESSAGE_LIMIT = 400;
const FIELD_ORDER: Field[] = ["name", "phone", "attending", "guests", "message"];
const EMPTY: Values = { name: "", phone: "", attending: "", guests: 1, message: "" };

const CHOICES = [
  { value: "yes", title: "Attending", note: "Joyfully accepts" },
  { value: "no", title: "Not Attending", note: "Regretfully declines" },
] as const;

function validate(values: Values, maxGuests: number): Errors {
  const errors: Errors = {};
  const digits = values.phone.replace(/\D/g, "");

  if (values.name.trim().length < 2) errors.name = "Please tell us your name";
  if (!values.phone.trim()) errors.phone = "Please add a phone number";
  else if (!/^[+\d\s().-]+$/.test(values.phone) || digits.length < 7 || digits.length > 15)
    errors.phone = "Please enter a valid phone number";
  if (!values.attending) errors.attending = "Please let us know if you can join";
  if (values.attending !== "no" && (values.guests < 1 || values.guests > maxGuests))
    errors.guests = `Please choose between 1 and ${maxGuests} guests`;
  if (values.message.length > MESSAGE_LIMIT) errors.message = `Please keep your note under ${MESSAGE_LIMIT} characters`;
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          className="field__error"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function RSVP() {
  const { rsvp } = invitation;
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const errors = validate(values, rsvp.maxGuests);
  const errorFor = (field: Field) => (touched[field] || attempted ? errors[field] : undefined);
  const describe = (field: Field) => (errorFor(field) ? `rsvp-${field}-error` : undefined);

  const update = <K extends Field>(field: K, value: Values[K]) => setValues((v) => ({ ...v, [field]: value }));
  const touch = (field: Field) => setTouched((t) => ({ ...t, [field]: true }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setAttempted(true);

    const firstInvalid = FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      document.getElementById(firstInvalid === "attending" ? "rsvp-attending-yes" : `rsvp-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    const response = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      attending: values.attending === "yes",
      guests: values.attending === "yes" ? values.guests : 0,
      message: values.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      if (rsvp.endpoint) {
        const result = await fetch(rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(response),
        });
        if (!result.ok) throw new Error(`RSVP endpoint answered ${result.status}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 900));
      }
      setStatus("sent");
    } catch (error) {
      console.error(error);
      setStatus("failed");
    }
  };

  const reset = () => {
    setStatus("idle");
    setAttempted(false);
    setTouched({});
  };

  const firstName = values.name.trim().split(/\s+/)[0];

  return (
    <section id="rsvp" className="section rsvp" aria-labelledby="rsvp-title">
      <SectionHeading eyebrow="Kindly respond" title={rsvp.heading} id="rsvp-title" />
      <motion.p
        className="rsvp__note"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, delay: 0.3 }}
      >
        {rsvp.note}
      </motion.p>

      <motion.div
        className="rsvp__card paper-card"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <CornerSpray className="rsvp__spray rsvp__spray--tl" />
        <CornerSpray className="rsvp__spray rsvp__spray--br" />

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="thanks"
              className="rsvp__thanks"
              role="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 1, ease: EASE }}
            >
              <motion.div
                className="rsvp__thanks-wreath"
                initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
              >
                <Wreath />
                <span aria-hidden="true">♥</span>
              </motion.div>
              {firstName && <p className="rsvp__thanks-dear">Dear {firstName},</p>}
              <h3 className="rsvp__thanks-title">Thank you</h3>
              <p className="rsvp__thanks-text">{rsvp.success}</p>
              <button type="button" className="link-button" onClick={reset}>
                Edit your response
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              className="rsvp__form"
              noValidate
              onSubmit={submit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="rsvp__row">
                <div className="field">
                  <label className="field__label" htmlFor="rsvp-name">
                    Name
                  </label>
                  <input
                    id="rsvp-name"
                    className="field__input"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                    onBlur={() => touch("name")}
                    aria-invalid={Boolean(errorFor("name"))}
                    aria-describedby={describe("name")}
                  />
                  <FieldError id="rsvp-name-error" message={errorFor("name")} />
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="rsvp-phone">
                    Phone Number
                  </label>
                  <input
                    id="rsvp-phone"
                    className="field__input"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Your phone number"
                    value={values.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    onBlur={() => touch("phone")}
                    aria-invalid={Boolean(errorFor("phone"))}
                    aria-describedby={describe("phone")}
                  />
                  <FieldError id="rsvp-phone-error" message={errorFor("phone")} />
                </div>
              </div>

              <fieldset className="field field--choice" aria-describedby={describe("attending")}>
                <legend className="field__label">Will you attend?</legend>
                <div className="choice">
                  {CHOICES.map((choice) => (
                    <label key={choice.value} className={`choice__option${values.attending === choice.value ? " is-selected" : ""}`}>
                      <input
                        type="radio"
                        name="attending"
                        id={`rsvp-attending-${choice.value}`}
                        value={choice.value}
                        checked={values.attending === choice.value}
                        onChange={() => update("attending", choice.value)}
                        onBlur={() => touch("attending")}
                      />
                      <span className="choice__mark" aria-hidden="true" />
                      <span className="choice__title">{choice.title}</span>
                      <span className="choice__note">{choice.note}</span>
                    </label>
                  ))}
                </div>
                <FieldError id="rsvp-attending-error" message={errorFor("attending")} />
              </fieldset>

              <AnimatePresence initial={false}>
                {values.attending !== "no" && (
                  <motion.div
                    className="field field--guests"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <label className="field__label" htmlFor="rsvp-guests">
                      Number of Guests
                    </label>
                    <div className="stepper">
                      <button
                        type="button"
                        className="stepper__button"
                        onClick={() => update("guests", Math.max(1, values.guests - 1))}
                        disabled={values.guests <= 1}
                        aria-label="Fewer guests"
                      >
                        <Minus size={16} strokeWidth={1.25} />
                      </button>
                      <input
                        id="rsvp-guests"
                        className="stepper__input"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={rsvp.maxGuests}
                        value={values.guests || ""}
                        onChange={(e) => update("guests", Number.parseInt(e.target.value, 10) || 0)}
                        onBlur={() => touch("guests")}
                        aria-invalid={Boolean(errorFor("guests"))}
                        aria-describedby={describe("guests")}
                      />
                      <button
                        type="button"
                        className="stepper__button"
                        onClick={() => update("guests", Math.min(rsvp.maxGuests, values.guests + 1))}
                        disabled={values.guests >= rsvp.maxGuests}
                        aria-label="More guests"
                      >
                        <Plus size={16} strokeWidth={1.25} />
                      </button>
                    </div>
                    <FieldError id="rsvp-guests-error" message={errorFor("guests")} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="field">
                <label className="field__label" htmlFor="rsvp-message">
                  Message <span className="field__optional">(optional)</span>
                </label>
                <textarea
                  id="rsvp-message"
                  className="field__input field__input--area"
                  rows={3}
                  placeholder="A few words for the couple…"
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  onBlur={() => touch("message")}
                  aria-invalid={Boolean(errorFor("message"))}
                  aria-describedby={describe("message")}
                />
                <span className={`field__count${values.message.length > MESSAGE_LIMIT ? " is-over" : ""}`} aria-hidden="true">
                  {values.message.length} / {MESSAGE_LIMIT}
                </span>
                <FieldError id="rsvp-message-error" message={errorFor("message")} />
              </div>

              {status === "failed" && (
                <p className="rsvp__failed" role="alert">
                  We couldn’t send your response just now. Please try again in a moment.
                </p>
              )}

              <button type="submit" className="btn btn--solid btn--block" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  "Confirm Attendance"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
