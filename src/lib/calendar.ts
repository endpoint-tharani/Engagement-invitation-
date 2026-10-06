import { invitation, coupleNames } from "../data/invitation";

const toIcsDate = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escapeIcs = (value: string) => value.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

/** Downloads an .ics file so guests can save the ceremony to their calendar. */
export function downloadCalendarFile() {
  const { event, countdownDate, durationHours } = invitation;
  const start = new Date(countdownDate);
  const end = new Date(start.getTime() + durationHours * 3_600_000);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Engagement Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}-engagement@invitation`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(`${event.title} · ${coupleNames}`)}`,
    `LOCATION:${escapeIcs(`${event.venue}, ${event.address}`)}`,
    `DESCRIPTION:${escapeIcs(invitation.message.body)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: "engagement.ics" });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
