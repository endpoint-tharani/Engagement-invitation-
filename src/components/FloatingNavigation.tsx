import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "../hooks/useActiveSection";
import { EASE } from "./motion";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "story", label: "Story" },
  { id: "event", label: "Event" },
  { id: "venue", label: "Venue" },
  { id: "gallery", label: "Gallery" },
  { id: "rsvp", label: "RSVP" },
] as const;

const IDS = SECTIONS.map((s) => s.id);

export function FloatingNavigation() {
  const active = useActiveSection(IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = (onSelect?: () => void) =>
    SECTIONS.map(({ id, label }) => (
      <li key={id}>
        <a href={`#${id}`} className={active === id ? "is-active" : undefined} aria-current={active === id ? "location" : undefined} onClick={onSelect}>
          <span className="nav__label">{label}</span>
          <span className="nav__dot" aria-hidden="true" />
        </a>
      </li>
    ));

  return (
    <>
      {/* Desktop: quiet column of dots on the right edge */}
      <motion.nav
        className="dotnav"
        aria-label="Sections"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 1.2, ease: EASE }}
      >
        <ul>{links()}</ul>
      </motion.nav>

      {/* Phones & tablets: small floating menu */}
      <motion.div
        className="menu"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.4 }}
      >
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                key="backdrop"
                className="menu__backdrop"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.nav
                key="sheet"
                id="section-menu"
                className="menu__sheet"
                aria-label="Sections"
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <ul>{links(() => setMenuOpen(false))}</ul>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
        <button
          type="button"
          className="fab menu__toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="section-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={18} strokeWidth={1.25} /> : <Menu size={18} strokeWidth={1.25} />}
        </button>
      </motion.div>
    </>
  );
}
