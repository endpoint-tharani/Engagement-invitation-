import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { invitation } from "./src/data/invitation.ts";

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Fills the SEO / Open Graph tags in index.html from the invitation config. */
function invitationMeta(): Plugin {
  const { title, description, siteUrl } = invitation.meta;
  const base = siteUrl.replace(/\/$/, "");
  const values: Record<string, string> = {
    "%INVITE_TITLE%": title,
    "%INVITE_DESCRIPTION%": description,
    "%INVITE_URL%": base ? `${base}/` : "/",
    "%INVITE_OG_IMAGE%": `${base}/og-image.jpg`,
  };
  return {
    name: "invitation-meta",
    transformIndexHtml(html) {
      return Object.entries(values).reduce(
        (out, [token, value]) => out.replaceAll(token, escapeHtml(value)),
        html,
      );
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    invitationMeta(),
    imagetools({
      // `?responsive` → WebP at several widths + intrinsic size, as { src, srcset, w, h }
      defaultDirectives: (url) =>
        url.searchParams.has("responsive")
          ? new URLSearchParams({ w: "480;800;1200;1600", format: "webp", quality: "74", as: "img" })
          : new URLSearchParams(),
    }),
  ],
});
