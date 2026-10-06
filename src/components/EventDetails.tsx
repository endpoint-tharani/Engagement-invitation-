import { motion } from "framer-motion";
import { CalendarDays, CalendarPlus, Clock, MapPin, type LucideIcon } from "lucide-react";
import { invitation, coupleNames } from "../data/invitation";
import { downloadCalendarFile } from "../lib/calendar";
import { Sprig } from "./decorations/Botanicals";
import { SectionHeading } from "./SectionHeading";
import { EASE, VIEWPORT, fadeIn, fadeUp, stagger } from "./motion";

interface Detail {
  icon: LucideIcon;
  label: string;
  value: string;
  extra?: string;
}

export function EventDetails() {
  const { event } = invitation;
  const details: Detail[] = [
    { icon: CalendarDays, label: "Date", value: event.date },
    { icon: Clock, label: "Time", value: event.time },
    { icon: MapPin, label: "Venue", value: event.venue, extra: event.address },
  ];

  return (
    <section id="event" className="section event" aria-labelledby="event-title">
      <SectionHeading eyebrow="Save the date" title="The Celebration" id="event-title" />

      <motion.article
        className="event__card paper-card"
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <motion.div className="event__inner" variants={stagger(0.14, 0.3)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <motion.div variants={fadeIn}>
            <Sprig className="event__sprig" />
          </motion.div>
          <motion.h3 className="event__title" variants={fadeUp}>
            {event.title}
          </motion.h3>
          <motion.p className="event__couple" variants={fadeUp}>
            {coupleNames}
          </motion.p>

          <ul className="event__list">
            {details.map(({ icon: Icon, label, value, extra }) => (
              <motion.li className="event__item" key={label} variants={fadeUp}>
                <span className="event__icon">
                  <Icon size={22} strokeWidth={1.1} aria-hidden="true" />
                </span>
                <span className="event__label">{label}</span>
                <span className="event__value">{value}</span>
                {extra && <span className="event__extra">{extra}</span>}
              </motion.li>
            ))}
          </ul>

          <motion.div variants={fadeUp}>
            <button type="button" className="btn btn--ghost" onClick={downloadCalendarFile}>
              <CalendarPlus size={16} strokeWidth={1.25} aria-hidden="true" />
              Add to calendar
            </button>
          </motion.div>
        </motion.div>
      </motion.article>
    </section>
  );
}
