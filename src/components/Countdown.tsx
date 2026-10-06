import { AnimatePresence, motion } from "framer-motion";
import { invitation } from "../data/invitation";
import { useCountdown } from "../hooks/useCountdown";
import { TrailingBranch } from "./decorations/Botanicals";
import { EASE, VIEWPORT, fadeUp, stagger } from "./motion";

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const { days, hours, minutes, seconds, done } = useCountdown(invitation.countdownDate);
  const { countdown, event } = invitation;
  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <section className="section section--tinted countdown" aria-labelledby="countdown-title">
      <TrailingBranch className="countdown__branch countdown__branch--left" seed={21} />
      <TrailingBranch className="countdown__branch countdown__branch--right" seed={27} />

      <motion.div className="countdown__inner" variants={stagger(0.14)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
        <motion.h2 className="countdown__title" id="countdown-title" variants={fadeUp}>
          <span className="countdown__caps">{countdown.eyebrow}</span>
          <span className="countdown__script">{countdown.heading}</span>
        </motion.h2>

        {done ? (
          <motion.p className="countdown__done" variants={fadeUp}>
            {countdown.done}
          </motion.p>
        ) : (
          <motion.ol className="countdown__grid" variants={stagger(0.1)} aria-label="Time remaining">
            {units.map(({ label, value }) => (
              <motion.li className="countdown__unit" key={label} variants={fadeUp}>
                <span className="countdown__value">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={value}
                      initial={{ opacity: 0, y: "-35%" }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: "35%" }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      {pad(value)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="countdown__label">{label}</span>
              </motion.li>
            ))}
          </motion.ol>
        )}

        <motion.p className="countdown__until" variants={fadeUp}>
          {event.date} · {event.time}
        </motion.p>
      </motion.div>
    </section>
  );
}
