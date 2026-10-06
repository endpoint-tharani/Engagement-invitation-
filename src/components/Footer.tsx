import { motion } from "framer-motion";
import { invitation, coupleNames } from "../data/invitation";
import { initialOf } from "../lib/text";
import { Wreath } from "./decorations/Botanicals";
import { VIEWPORT, fadeUp, softScale, stagger } from "./motion";

export function Footer() {
  const { couple, event, footer } = invitation;

  return (
    <footer className="footer">
      <motion.div className="footer__inner" variants={stagger(0.15)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
        <motion.div className="footer__seal" variants={softScale} aria-hidden="true">
          <Wreath />
          <span>
            {initialOf(couple.person1.name)}
            <i>&amp;</i>
            {initialOf(couple.person2.name)}
          </span>
        </motion.div>
        <motion.p className="footer__closing" variants={fadeUp}>
          {footer.closing}
        </motion.p>
        <motion.p className="footer__names" variants={fadeUp}>
          {coupleNames}
        </motion.p>
        <motion.p className="footer__date" variants={fadeUp}>
          {event.date}
        </motion.p>
        {footer.hashtag && (
          <motion.p className="footer__hashtag" variants={fadeUp}>
            {footer.hashtag}
          </motion.p>
        )}
      </motion.div>
    </footer>
  );
}
