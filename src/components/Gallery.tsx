import { useMemo, useRef, useState, type SyntheticEvent } from "react";
import { motion } from "framer-motion";
import { invitation, type GalleryLayout } from "../data/invitation";
import { getImage } from "../lib/images";
import { Lightbox, type Photo } from "./Lightbox";
import { SectionHeading } from "./SectionHeading";
import { EASE, VIEWPORT } from "./motion";

/** Editorial rhythm used when a photo has no explicit layout (tuned for 8 photos). */
const PATTERN: GalleryLayout[] = ["hero", "tall", "square", "square", "wide", "tall", "tall", "wide"];

const SIZES: Record<GalleryLayout, string> = {
  hero: "(min-width: 1200px) 580px, (min-width: 768px) 50vw, 100vw",
  wide: "(min-width: 1200px) 580px, (min-width: 768px) 50vw, 100vw",
  tall: "(min-width: 1200px) 290px, (min-width: 768px) 25vw, 50vw",
  square: "(min-width: 1200px) 290px, (min-width: 768px) 25vw, 50vw",
};

const markLoaded = (event: SyntheticEvent<HTMLImageElement>) => event.currentTarget.classList.add("is-loaded");

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  // On close, return focus to the photo last viewed (Safari never focuses clicked buttons).
  const changePhoto = (index: number | null) => {
    if (index === null && active !== null) items.current[active]?.focus({ preventScroll: true });
    setActive(index);
  };

  const photos = useMemo<Photo[]>(
    () =>
      invitation.gallery.flatMap((item, i) => {
        const image = getImage(item.file);
        return image ? [{ ...item, image, layout: item.layout ?? PATTERN[i % PATTERN.length] }] : [];
      }),
    [],
  );

  if (!photos.length) return null;

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <SectionHeading eyebrow="Moments" title="Our Gallery" id="gallery-title" />

      <div className="gallery__grid">
        {photos.map((photo, i) => (
          <motion.button
            type="button"
            key={photo.file}
            ref={(button) => {
              items.current[i] = button;
            }}
            className={`gallery__item gallery__item--${photo.layout}`}
            onClick={() => setActive(i)}
            aria-label={`View photo: ${photo.alt}`}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.3, delay: (i % 3) * 0.1, ease: EASE }}
          >
            <motion.span
              className="gallery__media"
              initial={{ scale: 1.12 }}
              whileInView={{ scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 2.4, ease: EASE }}
            >
              <img
                src={photo.image.src}
                srcSet={photo.image.srcset}
                sizes={SIZES[photo.layout ?? "square"]}
                width={photo.image.w}
                height={photo.image.h}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ objectPosition: photo.focus }}
                onLoad={markLoaded}
                ref={(img) => {
                  if (img?.complete) img.classList.add("is-loaded");
                }}
              />
            </motion.span>
          </motion.button>
        ))}
      </div>

      <Lightbox photos={photos} index={active} onChange={changePhoto} />
    </section>
  );
}
