import { motion } from "framer-motion";
import { ExternalLink, Navigation } from "lucide-react";
import { invitation } from "../data/invitation";
import { maps } from "../lib/maps";
import { OrnamentDivider, TrailingBranch } from "./decorations/Botanicals";
import { SectionHeading } from "./SectionHeading";
import { EASE, VIEWPORT, fadeUp, stagger } from "./motion";

/** Illustrated stand-in shown until a real venue address is configured. */
function MapPreview({ label }: { label: string }) {
  return (
    <div className="map-preview">
      <svg viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="600" height="440" className="map-preview__ground" />
        <path className="map-preview__park" d="M392 40c58-10 132 6 150 52s-16 92-70 104-112-8-128-52 0-94 48-104Z" />
        <path className="map-preview__park" d="M40 300c40-22 104-18 128 14s4 82-44 92-104-6-112-44 4-48 28-62Z" />
        <path className="map-preview__water" d="M-20 150C80 120 150 190 250 170S420 70 620 120" />
        <g className="map-preview__road-edge">
          <path d="M-10 250H610M300 -10V450M-10 60L610 400" />
        </g>
        <g className="map-preview__road">
          <path d="M-10 250H610M300 -10V450M-10 60L610 400" />
        </g>
        <g className="map-preview__street">
          <path d="M120 -10V450M470 -10V450M-10 360H610M-10 110H610M210 250V450M390 0V250" />
        </g>
        <g className="map-preview__trees">
          {[[430, 90], [470, 120], [500, 80], [440, 150], [520, 140], [90, 330], [120, 360], [70, 370]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="5" />
          ))}
        </g>
      </svg>
      <div className="map-preview__pin">
        <span className="map-preview__pulse" />
        <svg viewBox="0 0 32 44" aria-hidden="true" focusable="false">
          <path d="M16 43C16 43 30 26 30 16A14 14 0 0 0 2 16C2 26 16 43 16 43Z" />
          <circle cx="16" cy="16" r="5.5" />
        </svg>
      </div>
      <span className="map-preview__label">{label}</span>
    </div>
  );
}

export function Venue() {
  const { event } = invitation;

  return (
    <section id="venue" className="section venue" aria-labelledby="venue-title">
      <TrailingBranch className="venue__branch" seed={51} />
      <SectionHeading eyebrow="The venue" script="Join Us" id="venue-title" />

      <div className="venue__layout">
        <motion.div className="venue__info" variants={stagger(0.14)} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <motion.h3 className="venue__name" variants={fadeUp}>
            {event.venue}
          </motion.h3>
          <motion.p className="venue__address" variants={fadeUp}>
            {event.address}
          </motion.p>
          <motion.div className="venue__divider" variants={fadeUp}>
            <OrnamentDivider />
          </motion.div>
          <motion.div className="venue__actions" variants={fadeUp}>
            <a className="btn btn--solid" href={maps.directions} target="_blank" rel="noopener noreferrer">
              <Navigation size={16} strokeWidth={1.25} aria-hidden="true" />
              Get Directions
            </a>
            <a className="btn" href={maps.open} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} strokeWidth={1.25} aria-hidden="true" />
              Open in Google Maps
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="venue__map"
          initial={{ opacity: 0, y: 34, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.5, delay: 0.15, ease: EASE }}
        >
          <div className="venue__map-inner">
            {maps.hasLocation ? (
              <iframe
                src={maps.embed}
                title={`Map showing ${event.venue}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <MapPreview label={event.venue} />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
