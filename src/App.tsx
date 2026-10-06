import { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { OpenedContext } from "./components/OpenedContext";
import { EASE } from "./components/motion";
import { InvitationOpening } from "./components/InvitationOpening";
import { Hero } from "./components/Hero";
import { CoupleSection } from "./components/CoupleSection";
import { InvitationMessage } from "./components/InvitationMessage";
import { Countdown } from "./components/Countdown";
import { EventDetails } from "./components/EventDetails";
import { Venue } from "./components/Venue";
import { EventTimeline } from "./components/EventTimeline";
import { Gallery } from "./components/Gallery";
import { QuoteSection } from "./components/QuoteSection";
import { RSVP } from "./components/RSVP";
import { Footer } from "./components/Footer";
import { MusicControl } from "./components/MusicControl";
import { FloatingNavigation } from "./components/FloatingNavigation";
import { useMusic } from "./hooks/useMusic";

/** `?open` skips the opening card — handy for previews and direct links like `?open#rsvp`. */
const skipOpening = new URLSearchParams(window.location.search).has("open");

export default function App() {
  const [opened, setOpened] = useState(skipOpening);
  const [openingDone, setOpeningDone] = useState(skipOpening);
  const music = useMusic();

  useEffect(() => {
    if (skipOpening && window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
    }
  }, []);

  const handleOpen = () => {
    setOpened(true);
    music.play(); // allowed: we're inside the guest's click
  };

  return (
    <MotionConfig reducedMotion="user">
      <OpenedContext.Provider value={opened}>
        {!openingDone && <InvitationOpening onOpen={handleOpen} onComplete={() => setOpeningDone(true)} />}

        <motion.main
          className="invitation"
          inert={!opened}
          initial={false}
          animate={{ opacity: opened ? 1 : 0 }}
          transition={{ duration: 1.6, delay: skipOpening ? 0 : 0.7, ease: EASE }}
        >
          <Hero />
          <CoupleSection />
          <InvitationMessage />
          <Countdown />
          <EventDetails />
          <Venue />
          <EventTimeline />
          <Gallery />
          <QuoteSection />
          <RSVP />
          <Footer />
        </motion.main>

        {openingDone && <FloatingNavigation />}
        {opened && <MusicControl music={music} />}
      </OpenedContext.Provider>
    </MotionConfig>
  );
}
