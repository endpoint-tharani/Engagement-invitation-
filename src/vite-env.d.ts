/// <reference types="vite/client" />

/** Output of a `?responsive` image import (see vite.config.ts) */
interface ResponsiveImage {
  src: string;
  srcset?: string;
  w: number;
  h: number;
}
