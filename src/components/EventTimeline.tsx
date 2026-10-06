import { useRef } from "react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { invitation } from "../data/invitation";
import { SectionHeading } from "./SectionHeading";
import { EASE, VIEWPORT, fadeUp, stagger } from "./motion";

const marker: Variants = {
  hidden: { scale: 0.3, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

export function EventTimeline() {
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, restDelta: 0.001 });

  return (
    <section className="section timeline" aria-labelledby="timeline-title">
      <SectionHeading eyebrow="Order of events" title="The Evening" id="timeline-title" />

      <div className="timeline__wrap" ref={listRef}>
        <span className="timeline__track" aria-hidden="true">
          <motion.span className="timeline__progress" style={{ scaleY: progress }} />
        </span>
        <ol className="timeline__list">
          {invitation.timeline.map((item) => (
            <motion.li
              className="timeline__item"
              key={`${item.time}-${item.title}`}
              variants={stagger(0.12)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <motion.span className="timeline__marker" variants={marker} aria-hidden="true" />
              <motion.p className="timeline__time" variants={fadeUp}>
                {item.time}
              </motion.p>
              <motion.div className="timeline__body" variants={fadeUp}>
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
              </motion.div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
