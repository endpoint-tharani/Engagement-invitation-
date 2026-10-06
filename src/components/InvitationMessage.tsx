import { motion } from "framer-motion";
import { invitation } from "../data/invitation";
import { Sprig } from "./decorations/Botanicals";
import { VIEWPORT, fadeIn, fadeUp, stagger } from "./motion";

export function InvitationMessage() {
  const { heading, body } = invitation.message;

  return (
    <section className="section message" aria-labelledby="message-title">
      <motion.div className="message__inner" variants={stagger(0.2)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
        <motion.div variants={fadeIn}>
          <Sprig className="message__sprig" />
        </motion.div>
        <motion.h2 className="message__heading" id="message-title" variants={fadeUp}>
          {heading}
        </motion.h2>
        <motion.p className="message__body" variants={fadeUp}>
          “{body}”
        </motion.p>
        <motion.div variants={fadeIn}>
          <Sprig className="message__sprig message__sprig--flip" />
        </motion.div>
      </motion.div>
    </section>
  );
}
