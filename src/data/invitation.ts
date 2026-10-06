/**
 * ─────────────────────────────────────────────────────────────
 *  INVITATION CONFIGURATION
 *  Every name, date, place and photo shown on the site lives here.
 *  Edit this file only — components read everything from it.
 * ─────────────────────────────────────────────────────────────
 *
 *  Photos:  put image files in  src/assets/images/  and reference them
 *           by their path inside that folder, e.g. "gallery/01.jpg".
 *           Responsive WebP versions are generated automatically at build.
 *  Music:   put an .mp3 / .m4a / .ogg in  src/assets/music/  and set
 *           music.file to its name. Leave it empty to use the built-in
 *           soft music-box melody.
 */

export type GalleryLayout = "hero" | "tall" | "wide" | "square";

export interface GalleryItem {
  /** Path inside src/assets/images/ */
  file: string;
  alt: string;
  /** Grid shape. Defaults to a pattern tuned for 8 photos. */
  layout?: GalleryLayout;
  /** CSS object-position, for keeping faces in frame, e.g. "center 30%" */
  focus?: string;
}

export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
}

export interface Person {
  name: string;
  /** Shown under the name in the couple section */
  family: string;
  /** Path inside src/assets/images/. Leave empty for an elegant monogram card. */
  photo?: string;
  focus?: string;
}

export const invitation = {
  couple: {
    person1: {
      name: "Tharani",
      family: "[Parents' Names]",
      photo: "",
    } as Person,
    person2: {
      name: "[Partner Name]",
      family: "[Parents' Names]",
      photo: "",
    } as Person,
    tagline: "Two hearts, one beautiful beginning.",
  },

  event: {
    title: "Engagement Ceremony",
    date: "[Engagement Date]",
    time: "[Time]",
    venue: "[Venue Name]",
    address: "[Venue Address]",
    /**
     * Optional: what Google Maps should search for. Defaults to
     * "venue, address". The map shows an illustrated preview until a
     * real address replaces the [placeholder].
     */
    mapQuery: "",
  },

  /**
   * Exact start of the ceremony, used by the countdown and the
   * "Add to calendar" file. Include the timezone offset so the countdown
   * is correct for guests everywhere (e.g. +05:30 for India).
   */
  countdownDate: "2026-12-12T18:00:00+05:30",
  /** Length of the event in hours (for the calendar entry) */
  durationHours: 3,

  opening: {
    eyebrow: "You are invited",
    button: "Open Invitation",
  },

  hero: {
    eyebrow: "Together with our families",
    line1: "request the pleasure of your presence",
    line2: "at their",
  },

  message: {
    heading: "With joyful hearts",
    body: "We are delighted to invite you to celebrate the beginning of our beautiful journey together.",
  },

  countdown: {
    eyebrow: "Counting down",
    heading: "to Forever",
    done: "Today is the day! ♥",
  },

  timeline: [
    { time: "06:00 PM", title: "Guest Arrival", description: "Welcome drinks & warm greetings" },
    { time: "06:30 PM", title: "Engagement Ceremony", description: "The exchange of rings" },
    { time: "07:30 PM", title: "Blessings & Photographs", description: "Moments with family & friends" },
    { time: "08:00 PM", title: "Dinner", description: "An evening of celebration" },
  ] as TimelineItem[],

  gallery: [
    { file: "gallery/01.jpg", alt: "The couple together", layout: "hero" },
    { file: "gallery/02.jpg", alt: "Holding hands", layout: "tall" },
    { file: "gallery/03.jpg", alt: "The engagement ring", layout: "square" },
    { file: "gallery/04.jpg", alt: "Soft florals", layout: "square" },
    { file: "gallery/05.jpg", alt: "A quiet moment", layout: "wide" },
    { file: "gallery/06.jpg", alt: "Walking together", layout: "tall" },
    { file: "gallery/07.jpg", alt: "Laughter shared", layout: "tall" },
    { file: "gallery/08.jpg", alt: "Golden hour", layout: "wide" },
  ] as GalleryItem[],

  quote: {
    text: "Two souls, one heart, one beautiful beginning.",
    attribution: "",
  },

  rsvp: {
    heading: "Will You Join Us?",
    note: "Kindly respond by [RSVP Date]",
    maxGuests: 6,
    success: "Thank you for celebrating this special moment with us. ♥",
    /**
     * Optional: a URL that accepts a JSON POST (Formspree, Google Apps
     * Script, your own API…). Leave empty to show the success state
     * without sending anything.
     */
    endpoint: "",
  },

  music: {
    /** File name inside src/assets/music/, e.g. "our-song.mp3" */
    file: "",
    volume: 0.45,
  },

  footer: {
    closing: "With love",
    hashtag: "",
  },

  /** Used for the browser tab, search results and link previews (WhatsApp etc.) */
  meta: {
    title: "Tharani & [Partner Name] — Engagement Invitation",
    description:
      "You are warmly invited to celebrate the Engagement Ceremony of Tharani & [Partner Name].",
    /** Your final address once deployed, e.g. "https://tharani-engagement.com" (makes link previews show the photo) */
    siteUrl: "",
  },
};

export type Invitation = typeof invitation;

/** "Tharani & [Partner Name]" */
export const coupleNames = `${invitation.couple.person1.name} & ${invitation.couple.person2.name}`;
