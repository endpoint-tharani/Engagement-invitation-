import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { invitation } from "../data/invitation";
import { initialOf } from "../lib/text";
import { useScrollLock } from "../hooks/useScrollLock";
import { CornerSpray, Wreath } from "./decorations/Botanicals";
import { EASE, fadeUp, softScale, stagger } from "./motion";

interface Props {
  /** Called on the guest's click (start music here). */
  onOpen: () => void;
  /** Called when the doors have finished opening. */
  onComplete: () => void;
}

const DOOR_EASE = [0.65, 0, 0.35, 1] as const;

export function InvitationOpening({ onOpen, onComplete }: Props) {
  const [fontsReady, setFontsReady] = useState(false);
  const [opening, setOpening] = useState(false);
  const reduceMotion = useReducedMotion();
  const { person1, person2 } = invitation.couple;
  useScrollLock(true);

  // Wait for the calligraphy font so the names don't flash in a fallback face.
  useEffect(() => {
    let alive = true;
    const timeout = new Promise((resolve) => setTimeout(resolve, 1600));
    Promise.race([document.fonts?.ready, timeout]).then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);

  const open = () => {
    if (opening) return;
    window.scrollTo(0, 0);
    setOpening(true);
    onOpen();
  };

  const door = (side: "left" | "right") => ({
    initial: false as const,
    animate: opening
      ? { rotateY: reduceMotion ? 0 : side === "left" ? -100 : 100, opacity: 0 }
      : { rotateY: 0, opacity: 1 },
    transition: {
      rotateY: { duration: 2, delay: 0.6, ease: DOOR_EASE },
      opacity: reduceMotion ? { duration: 0.8, delay: 0.3 } : { duration: 0.7, delay: 1.9 },
    },
  });

  return (
    <div className="opening" role="dialog" aria-modal="true" aria-labelledby="opening-names">
      <motion.div className="opening__door opening__door--left" {...door("left")} onAnimationComplete={() => opening && onComplete()}>
        <CornerSpray className="opening__spray opening__spray--tl" />
        <CornerSpray className="opening__spray opening__spray--bl" />
      </motion.div>
      <motion.div className="opening__door opening__door--right" {...door("right")}>
        <CornerSpray className="opening__spray opening__spray--tr" />
        <CornerSpray className="opening__spray opening__spray--br" />
      </motion.div>

      <motion.div
        className="opening__stage"
        animate={opening ? { opacity: 0, scale: 0.96, y: -12 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <motion.div className="opening__content" variants={stagger(0.22, 0.15)} initial="hidden" animate={fontsReady ? "show" : "hidden"}>
          <motion.p className="eyebrow" variants={fadeUp}>
            {invitation.opening.eyebrow}
          </motion.p>

          <motion.div className="opening__seal" variants={softScale}>
            <Wreath />
            <span className="opening__monogram" aria-hidden="true">
              {initialOf(person1.name)}
              <i>&amp;</i>
              {initialOf(person2.name)}
            </span>
          </motion.div>

          <motion.h2 className="opening__names" id="opening-names" variants={fadeUp}>
            <span>{person1.name}</span>
            <span className="opening__amp">&amp;</span>
            <span>{person2.name}</span>
          </motion.h2>

          <motion.p className="opening__event" variants={fadeUp}>
            {invitation.event.title}
          </motion.p>

          <motion.div variants={fadeUp}>
            <button type="button" className="btn btn--invite" onClick={open} disabled={opening}>
              {invitation.opening.button}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
