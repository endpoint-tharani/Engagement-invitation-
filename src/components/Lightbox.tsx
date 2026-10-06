import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "../data/invitation";
import { useScrollLock } from "../hooks/useScrollLock";
import { EASE } from "./motion";

export type Photo = GalleryItem & { image: ResponsiveImage };

interface Props {
  photos: Photo[];
  index: number | null;
  onChange: (index: number | null) => void;
}

const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 70, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
  exit: (direction: number) => ({ opacity: 0, x: direction * -70, transition: { duration: 0.45, ease: EASE } }),
};

export function Lightbox({ photos, index, onChange }: Props) {
  const open = index !== null;
  const photo = open ? photos[index] : undefined;
  const [direction, setDirection] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(open);

  const close = useCallback(() => onChange(null), [onChange]);
  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setDirection(delta);
      onChange((index + delta + photos.length) % photos.length);
    },
    [index, photos.length, onChange],
  );

  // Move focus into the viewer (the gallery returns it on close).
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="lightbox__backdrop" onClick={close} />

          <figure className="lightbox__figure">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={photo.file}
                className="lightbox__image"
                src={photo.image.src}
                srcSet={photo.image.srcset}
                sizes="92vw"
                alt={photo.alt}
                draggable={false}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
              />
            </AnimatePresence>
            <figcaption className="lightbox__caption">
              <span>{photo.alt}</span>
              <span className="lightbox__count">
                {index! + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>

          <button ref={closeRef} type="button" className="lightbox__button lightbox__close" onClick={close} aria-label="Close photo viewer">
            <X size={20} strokeWidth={1.25} />
          </button>
          {photos.length > 1 && (
            <>
              <button type="button" className="lightbox__button lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
                <ChevronLeft size={22} strokeWidth={1.25} />
              </button>
              <button type="button" className="lightbox__button lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next photo">
                <ChevronRight size={22} strokeWidth={1.25} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
