import { useMemo, type CSSProperties } from "react";

/*
 * Hand-drawn-style olive branches, blossoms and ornaments.
 * Leaves are grown along a curve with a seeded random so every branch looks
 * natural but renders identically on every visit. Colours live in CSS
 * (botanicals.css) so the whole palette can be tuned in one place.
 */

type Point = readonly [number, number];
type Curve = (t: number) => Point;

const r1 = (n: number) => Math.round(n * 10) / 10;

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A slender, lance-shaped olive leaf pointing along +x. */
const leafPath = (l: number, w: number) =>
  `M0 0C${r1(l * 0.28)} ${r1(-w)} ${r1(l * 0.7)} ${r1(-w * 0.86)} ${r1(l)} 0` +
  `C${r1(l * 0.7)} ${r1(w * 0.78)} ${r1(l * 0.28)} ${r1(w * 0.9)} 0 0Z`;

const veinPath = (l: number, w: number) => `M${r1(l * 0.1)} 0Q${r1(l * 0.5)} ${r1(-w * 0.16)} ${r1(l * 0.9)} 0`;

const sample = (curve: Curve, segments = 28) =>
  Array.from({ length: segments + 1 }, (_, i) => curve(i / segments))
    .map(([x, y], i) => `${i ? "L" : "M"}${r1(x)} ${r1(y)}`)
    .join("");

const tangentAt = (curve: Curve, t: number) => {
  const [ax, ay] = curve(Math.max(0, t - 0.002));
  const [bx, by] = curve(Math.min(1, t + 0.002));
  return (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
};

export interface GrowOptions {
  leaves?: number;
  /** Leaf length in viewBox units */
  size?: number;
  /** Angle between leaf and stem, degrees */
  spread?: number;
  olives?: number;
  seed?: number;
  tone?: "sage" | "light" | "gold";
  /** Omit the leaf at the very tip */
  noTip?: boolean;
}

function Growth({ curve, leaves = 8, size = 34, spread = 40, olives = 0, seed = 1, tone = "sage", noTip }: GrowOptions & { curve: Curve }) {
  const shapes = useMemo(() => {
    const rand = seeded(seed);
    const items = Array.from({ length: leaves }, (_, i) => {
      const t = 0.08 + (i / Math.max(1, leaves - 1)) * 0.84;
      const side = i % 2 ? -1 : 1;
      const l = size * (1 - t * 0.32) * (0.86 + rand() * 0.24);
      const [x, y] = curve(t);
      return {
        x,
        y,
        l,
        w: l * (0.19 + rand() * 0.05),
        rotate: tangentAt(curve, t) + side * (spread + (rand() - 0.5) * 16),
        shade: Math.floor(rand() * 3),
      };
    });
    if (!noTip) {
      const [x, y] = curve(1);
      items.push({ x, y, l: size * 0.74, w: size * 0.15, rotate: tangentAt(curve, 1) + (rand() - 0.5) * 10, shade: 0 });
    }
    const fruit = Array.from({ length: olives }, (_, k) => {
      const t = 0.22 + ((k + 0.5) / olives) * 0.56;
      const [x, y] = curve(t);
      const angle = ((tangentAt(curve, t) + (k % 2 ? -62 : 62)) * Math.PI) / 180;
      return { x, y, ox: x + Math.cos(angle) * 9, oy: y + Math.sin(angle) * 9, rotate: tangentAt(curve, t) };
    });
    return { stem: sample(curve), items, fruit };
  }, [curve, leaves, size, spread, olives, seed, noTip]);

  return (
    <g className={`bt bt--${tone}`}>
      <path className="bt__stem" d={shapes.stem} />
      {shapes.fruit.map((o, i) => (
        <g key={`o${i}`}>
          <path className="bt__twig" d={`M${r1(o.x)} ${r1(o.y)}L${r1(o.ox)} ${r1(o.oy)}`} />
          <ellipse className="bt__olive" cx={r1(o.ox)} cy={r1(o.oy)} rx={4.4} ry={3.2} transform={`rotate(${r1(o.rotate)} ${r1(o.ox)} ${r1(o.oy)})`} />
          <circle className="bt__shine" cx={r1(o.ox - 1.2)} cy={r1(o.oy - 1)} r={0.9} />
        </g>
      ))}
      {shapes.items.map((leaf, i) => (
        <g key={i} transform={`translate(${r1(leaf.x)} ${r1(leaf.y)}) rotate(${r1(leaf.rotate)})`}>
          <path className={`bt__leaf bt__leaf--${leaf.shade}`} d={leafPath(leaf.l, leaf.w)} />
          <path className="bt__vein" d={veinPath(leaf.l, leaf.w)} />
        </g>
      ))}
    </g>
  );
}

/** Branch along a quadratic curve; `bend` pushes the middle sideways. */
export function Branch({ from, to, bend = 0, ...options }: GrowOptions & { from: Point; to: Point; bend?: number }) {
  const curve = useMemo<Curve>(() => {
    const [x0, y0] = from;
    const [x2, y2] = to;
    const length = Math.hypot(x2 - x0, y2 - y0) || 1;
    const cx = (x0 + x2) / 2 - ((y2 - y0) / length) * bend;
    const cy = (y0 + y2) / 2 + ((x2 - x0) / length) * bend;
    return (t) => {
      const u = 1 - t;
      return [u * u * x0 + 2 * u * t * cx + t * t * x2, u * u * y0 + 2 * u * t * cy + t * t * y2];
    };
  }, [from[0], from[1], to[0], to[1], bend]);
  return <Growth curve={curve} {...options} />;
}

/** Branch along a circular arc (angles in degrees, SVG orientation). */
function Arc({ cx, cy, r, start, end, ...options }: GrowOptions & { cx: number; cy: number; r: number; start: number; end: number }) {
  const curve = useMemo<Curve>(
    () => (t) => {
      const a = ((start + (end - start) * t) * Math.PI) / 180;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    },
    [cx, cy, r, start, end],
  );
  return <Growth curve={curve} {...options} />;
}

export function Blossom({ x, y, r = 8, rotate = 0 }: { x: number; y: number; r?: number; rotate?: number }) {
  return (
    <g className="blossom" transform={`translate(${x} ${y}) rotate(${rotate})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} className="blossom__petal" cx={0} cy={-r * 0.92} rx={r * 0.56} ry={r} transform={`rotate(${a})`} />
      ))}
      <circle className="blossom__heart" r={r * 0.34} />
      {[20, 140, 260].map((a) => (
        <circle key={a} className="blossom__stamen" cx={Math.cos((a * Math.PI) / 180) * r * 0.55} cy={Math.sin((a * Math.PI) / 180) * r * 0.55} r={r * 0.09} />
      ))}
    </g>
  );
}

function Bud({ x, y, rotate = 0, s = 1 }: { x: number; y: number; rotate?: number; s?: number }) {
  return (
    <g className="bud" transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}>
      <path className="bt__twig" d="M0 0L0 -10" />
      <path className="bud__body" d="M0 -9C-4 -12 -4 -18 0 -22C4 -18 4 -12 0 -9Z" />
    </g>
  );
}

function Dots({ points }: { points: readonly (readonly [number, number, number?])[] }) {
  return (
    <g className="dots">
      {points.map(([x, y, r = 1.8], i) => (
        <circle key={i} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

/* ───────────────────────── compositions ───────────────────────── */

interface DecorProps {
  className?: string;
  style?: CSSProperties;
}

/** Olive spray for a top-left corner. Mirror it with CSS for other corners. */
export function CornerSpray({ className = "", style }: DecorProps) {
  return (
    <svg className={`decor ${className}`} style={style} viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <Branch from={[0, 0]} to={[206, 196]} bend={14} leaves={10} size={34} seed={11} tone="light" />
      <Branch from={[12, -6]} to={[290, 22]} bend={20} leaves={9} size={30} seed={13} tone="light" />
      <Branch from={[6, 16]} to={[236, 132]} bend={28} leaves={8} size={21} seed={5} tone="gold" noTip />
      <Branch from={[-8, 34]} to={[280, 70]} bend={26} leaves={14} size={44} olives={2} seed={3} />
      <Branch from={[30, -8]} to={[66, 280]} bend={-24} leaves={13} size={42} olives={2} seed={7} />
      <Branch from={[14, 22]} to={[150, 128]} bend={-10} leaves={7} size={32} seed={17} />
      <Bud x={170} y={56} rotate={58} s={1} />
      <Bud x={96} y={178} rotate={146} s={0.9} />
      <Bud x={214} y={92} rotate={70} s={0.75} />
      <Blossom x={70} y={62} r={12} rotate={12} />
      <Blossom x={120} y={44} r={7.5} rotate={40} />
      <Blossom x={46} y={114} r={9} rotate={-8} />
      <Blossom x={146} y={108} r={6} rotate={22} />
      <Blossom x={96} y={92} r={4.5} rotate={50} />
      <Dots points={[[100, 76, 2.2], [110, 70, 1.5], [84, 98, 1.7], [182, 74, 1.6], [62, 156, 1.8], [210, 40, 1.4], [138, 140, 1.5], [24, 200, 1.3], [240, 60, 1.2]]} />
    </svg>
  );
}

/** Long, single trailing branch for section edges. */
export function TrailingBranch({ className = "", style, seed = 21 }: DecorProps & { seed?: number }) {
  return (
    <svg className={`decor ${className}`} style={style} viewBox="0 0 320 120" aria-hidden="true" focusable="false">
      <Branch from={[4, 70]} to={[312, 46]} bend={-26} leaves={14} size={34} olives={2} seed={seed} />
      <Branch from={[60, 74]} to={[210, 104]} bend={10} leaves={6} size={20} seed={seed + 4} tone="gold" noTip />
      <Blossom x={92} y={58} r={6} rotate={14} />
      <Dots points={[[150, 34, 1.6], [168, 30, 1.2], [232, 78, 1.5]]} />
    </svg>
  );
}

/** Small centred sprig used above and below text blocks. */
export function Sprig({ className = "", style }: DecorProps) {
  return (
    <svg className={`decor decor--sprig ${className}`} style={style} viewBox="0 0 240 48" aria-hidden="true" focusable="false">
      <path className="ornament__line" d="M8 24H72M168 24H232" />
      <Branch from={[118, 26]} to={[70, 22]} bend={-8} leaves={6} size={17} seed={31} />
      <Branch from={[122, 26]} to={[170, 22]} bend={8} leaves={6} size={17} seed={32} />
      <Blossom x={120} y={24} r={6.4} />
      <Dots points={[[60, 24, 1.4], [180, 24, 1.4]]} />
    </svg>
  );
}

/** Open laurel-style wreath. Children render centred inside it. */
export function Wreath({ className = "", style }: DecorProps) {
  return (
    <svg className={`decor decor--wreath ${className}`} style={style} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <Arc cx={100} cy={100} r={74} start={104} end={252} leaves={12} size={24} spread={44} olives={2} seed={41} />
      <Arc cx={100} cy={100} r={74} start={76} end={-72} leaves={12} size={24} spread={44} olives={2} seed={42} />
      <Arc cx={100} cy={100} r={84} start={118} end={200} leaves={5} size={14} spread={48} seed={43} tone="gold" noTip />
      <Arc cx={100} cy={100} r={84} start={62} end={-20} leaves={5} size={14} spread={48} seed={44} tone="gold" noTip />
      <Blossom x={100} y={174} r={7.5} />
      <Blossom x={86} y={170} r={4.6} rotate={20} />
      <Blossom x={114} y={170} r={4.6} rotate={-20} />
      <Dots points={[[100, 160, 1.4], [78, 160, 1.2], [122, 160, 1.2]]} />
    </svg>
  );
}

/** Thin line – diamond – line divider. */
export function OrnamentDivider({ className = "", style }: DecorProps) {
  return (
    <svg className={`decor decor--divider ${className}`} style={style} viewBox="0 0 220 14" aria-hidden="true" focusable="false">
      <path className="ornament__line" d="M0 7H92M128 7H220" />
      <path className="ornament__diamond" d="M110 1.5L115.5 7L110 12.5L104.5 7Z" />
      <circle className="ornament__dot" cx={98} cy={7} r={1.6} />
      <circle className="ornament__dot" cx={122} cy={7} r={1.6} />
    </svg>
  );
}
