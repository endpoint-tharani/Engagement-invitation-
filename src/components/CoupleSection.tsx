import { motion } from "framer-motion";
import { invitation, type Person } from "../data/invitation";
import { getImage } from "../lib/images";
import { initialOf } from "../lib/text";
import { Wreath } from "./decorations/Botanicals";
import { SectionHeading } from "./SectionHeading";
import { EASE, VIEWPORT } from "./motion";

function Portrait({ person, delay }: { person: Person; delay: number }) {
  const image = getImage(person.photo);

  return (
    <motion.figure
      className="portrait"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 1.4, delay, ease: EASE }}
    >
      <div className="portrait__frame">
        <div className="portrait__arch">
          {image ? (
            <motion.img
              src={image.src}
              srcSet={image.srcset}
              sizes="(min-width: 900px) 320px, 42vw"
              width={image.w}
              height={image.h}
              alt={person.name}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: person.focus }}
              initial={{ scale: 1.14 }}
              whileInView={{ scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 2.4, delay, ease: EASE }}
            />
          ) : (
            <div className="portrait__monogram" aria-hidden="true">
              <Wreath />
              <span>{initialOf(person.name)}</span>
            </div>
          )}
        </div>
      </div>
      <figcaption>
        <span className="portrait__name">{person.name}</span>
        <span className="portrait__family">{person.family}</span>
      </figcaption>
    </motion.figure>
  );
}

export function CoupleSection() {
  const { person1, person2, tagline } = invitation.couple;

  return (
    <section id="story" className="section couple" aria-labelledby="couple-title">
      <SectionHeading eyebrow="Meet the couple" title="The Two of Us" id="couple-title" />

      <div className="couple__pair">
        <Portrait person={person1} delay={0} />
        <motion.div
          className="couple__heart"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        >
          <i />
          <span>♥</span>
          <i />
        </motion.div>
        <Portrait person={person2} delay={0.2} />
      </div>

      <motion.p
        className="couple__tagline"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
      >
        {tagline}
      </motion.p>
    </section>
  );
}
