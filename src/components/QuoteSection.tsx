import { motion, type Variants } from "framer-motion";
import { invitation } from "../data/invitation";
import { OrnamentDivider } from "./decorations/Botanicals";
import { EASE, VIEWPORT, fadeIn, fadeUp, stagger } from "./motion";

const word: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.2, ease: EASE } },
};

export function QuoteSection() {
  const { text, attribution } = invitation.quote;
  const words = text.split(/\s+/);

  return (
    <section className="section quote" aria-label="A few words">
      <motion.figure className="quote__inner" variants={stagger(0.09)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
        <motion.span className="quote__mark" aria-hidden="true" variants={fadeIn}>
          “
        </motion.span>
        <blockquote className="quote__text">
          <p>
            {words.map((w, i) => (
              <span key={i}>
                <motion.span className="quote__word" variants={word}>
                  {w}
                </motion.span>{" "}
              </span>
            ))}
          </p>
        </blockquote>
        {attribution && (
          <motion.figcaption className="quote__cite" variants={fadeUp}>
            {attribution}
          </motion.figcaption>
        )}
        <motion.div variants={fadeIn}>
          <OrnamentDivider className="quote__divider" />
        </motion.div>
      </motion.figure>
    </section>
  );
}
