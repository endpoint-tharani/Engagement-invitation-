import { invitation } from "../data/invitation";
import { isPlaceholder } from "./text";

const { venue, address, mapQuery } = invitation.event;
const query = encodeURIComponent(mapQuery || `${venue}, ${address}`);

export const maps = {
  /** False until a real address replaces the template placeholder */
  hasLocation: Boolean(mapQuery) || !isPlaceholder(`${venue} ${address}`),
  directions: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
  open: `https://www.google.com/maps/search/?api=1&query=${query}`,
  embed: `https://www.google.com/maps?q=${query}&z=15&output=embed`,
};
