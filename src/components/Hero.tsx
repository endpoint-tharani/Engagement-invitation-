import { motion } from "framer-motion";
import { invitation } from "../data/invitation";
import { CornerSpray, OrnamentDivider, Sprig } from "./decorations/Botanicals";
import { useOpened } from "./OpenedContext";
import { EASE, fadeIn, fadeUp, stagger } from "./motion";

export function Hero() {
  const opened = useOpened();
  const { couple, event, hero } = invitation;

  return (
    <section id="home" className="hero" aria-labelledby="hero-names">
      <div className="hero__stage">
        <motion.div
          className="hero__decor hero__decor--tl"
          initial={{ opacity: 0, x: -24, y: -24 }}
          animate={opened ? { opacity: 1, x: 0, y: 0 } : undefined}
          transition={{ duration: 2.4, delay: 1.4, ease: EASE }}
        >
          <div className="sway">
            <CornerSpray />
          </div>
        </motion.div>
        <motion.div
          className="hero__decor hero__decor--br"
          initial={{ opacity: 0, x: 24, y: 24 }}
          animate={opened ? { opacity: 1, x: 0, y: 0 } : undefined}
          transition={{ duration: 2.4, delay: 1.6, ease: EASE }}
        >
          <div className="sway sway--slow">
            <CornerSpray />
          </div>
        </motion.div>

        <motion.article className="hero__card" variants={stagger(0.16, 1.1)} initial="hidden" animate={opened ? "show" : "hidden"}>
          <motion.div variants={fadeIn}>
            <Sprig className="hero__sprig" />
          </motion.div>
          <motion.p className="eyebrow" variants={fadeUp}>
            {hero.eyebrow}
          </motion.p>
          <motion.h1 className="hero__names" id="hero-names" variants={fadeUp}>
            <span className="hero__name">{couple.person1.name}</span>
            <span className="hero__amp">&amp;</span>
            <span className="hero__name">{couple.person2.name}</span>
          </motion.h1>
          <motion.p className="hero__line" variants={fadeUp}>
            {hero.line1}
          </motion.p>
          <motion.p className="hero__line hero__line--small" variants={fadeUp}>
            {hero.line2}
          </motion.p>
          <motion.p className="hero__event" variants={fadeUp}>
            {event.title}
          </motion.p>
          <motion.div className="hero__divider" variants={fadeIn}>
            <OrnamentDivider />
          </motion.div>
          <motion.p className="hero__date" variants={fadeUp}>
            {event.date}
          </motion.p>
          <motion.p className="hero__time" variants={fadeUp}>
            {event.time}
          </motion.p>
        </motion.article>
      </div>

      <motion.a
        href="#story"
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={opened ? { opacity: 1 } : undefined}
        transition={{ duration: 1.5, delay: 3.2 }}
      >
        <span>Scroll</span>
        <i aria-hidden="true" />
      </motion.a>
    </section>
  );
}
