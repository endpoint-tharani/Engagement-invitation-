import { motion } from "framer-motion";
import { OrnamentDivider } from "./decorations/Botanicals";
import { VIEWPORT, fadeIn, fadeUp, stagger } from "./motion";

interface Props {
  eyebrow?: string;
  /** Serif title */
  title?: string;
  /** Calligraphy title */
  script?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, script, id }: Props) {
  return (
    <motion.header className="heading" variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
      {eyebrow && (
        <motion.p className="eyebrow" variants={fadeUp}>
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 className="heading__title" id={id} variants={fadeUp}>
        {title && <span className="heading__serif">{title}</span>}
        {script && <span className="heading__script">{script}</span>}
      </motion.h2>
      <motion.div className="heading__ornament" variants={fadeIn}>
        <OrnamentDivider />
      </motion.div>
    </motion.header>
  );
}
