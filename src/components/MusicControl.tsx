import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VolumeX } from "lucide-react";
import type { MusicControls } from "../hooks/useMusic";

export function MusicControl({ music }: { music: MusicControls }) {
  const [showLabel, setShowLabel] = useState(false);
  const hideTimer = useRef(0);
  const label = music.playing ? "Music: On" : "Music: Off";

  // Briefly show the state after each change (touch screens have no hover).
  const flashLabel = () => {
    setShowLabel(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowLabel(false), 1800);
  };
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  return (
    <motion.div
      className="music"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 2.4 }}
    >
      <AnimatePresence>
        {showLabel && (
          <motion.span
            className="music__label"
            aria-hidden="true"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.4 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <button
        type="button"
        className={`fab music__button${music.playing ? " is-playing" : ""}`}
        onClick={() => {
          music.toggle();
          flashLabel();
        }}
        onMouseEnter={flashLabel}
        aria-pressed={music.playing}
        aria-label={label}
        title={label}
      >
        <span className="music__ring" aria-hidden="true" />
        {music.playing ? (
          <span className="music__bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <VolumeX size={18} strokeWidth={1.25} aria-hidden="true" />
        )}
      </button>
    </motion.div>
  );
}
