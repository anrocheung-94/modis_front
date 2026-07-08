import { VIEWBOX } from "./atlasData.js";

const DEFAULT_SLOT_COUNT = 23000;
const VIEW_MARGIN = 6;
const WARM_COLORS = ["#fff6e8", "#f7e7d1", "#efcaa0", "#ffc782", "#e0a36d", "#dcc3a3"];
const COOL_COLORS = ["#f7fbff", "#e6f1ff", "#d8e8ff", "#cde0ff", "#aac9f0", "#86b9ff"];
const NEUTRAL_COLORS = ["#ffffff", "#edf4ff", "#d9e3f1", "#f8efe1", "#f1dac1"];

const FEATURE_FIELDS = [
  { id: "mainSpiral", x: 0.475, y: 0.34, rx: 0.07, ry: 0.052, rotation: -0.1, strength: 0.42, falloff: 2.2, tone: "warm" },
  { id: "leftNebula", x: 0.035, y: 0.25, rx: 0.12, ry: 0.34, rotation: -0.08, strength: 0.24, falloff: 1.85, tone: "cool" },
  { id: "leftLower", x: 0.255, y: 0.6, rx: 0.14, ry: 0.13, rotation: -0.35, strength: 0.12, falloff: 2.4, tone: "cool" },
  { id: "lowerRightNebula", x: 0.87, y: 0.83, rx: 0.2, ry: 0.16, rotation: -0.22, strength: 0.28, falloff: 1.9, tone: "cool" },
  { id: "rightFaint", x: 0.91, y: 0.3, rx: 0.1, ry: 0.18, rotation: -0.08, strength: 0.12, falloff: 2.5, tone: "cool" },
  { id: "rightRedGalaxy", x: 0.79, y: 0.475, rx: 0.055, ry: 0.04, rotation: 0.08, strength: 0.24, falloff: 2.4, tone: "warm" },
  { id: "bottomBlue", x: 0.665, y: 0.9, rx: 0.08, ry: 0.055, rotation: -0.1, strength: 0.16, falloff: 2.6, tone: "cool" },
  { id: "lowerRed", x: 0.25, y: 0.94, rx: 0.055, ry: 0.04, rotation: 0.2, strength: 0.16, falloff: 2.5, tone: "warm" },
  { id: "upperSilver", x: 0.515, y: 0.255, rx: 0.045, ry: 0.03, rotation: -0.18, strength: 0.12, falloff: 2.2, tone: "cool" },
];

const DUST_SHADOWS = [
  { x: 0.56, y: 0.49, rx: 0.32, ry: 0.06, rotation: 0.32, strength: 0.1, falloff: 2.2 },
  { x: 0.5, y: 0.86, rx: 0.36, ry: 0.09, rotation: 0.02, strength: 0.09, falloff: 2.0 },
  { x: 0.74, y: 0.28, rx: 0.18, ry: 0.08, rotation: -0.18, strength: 0.06, falloff: 2.2 },
];

const slotCache = new Map();

export const HOME_DEEP_SPACE_SLOT_CENTER = {
  x: VIEWBOX.width * 0.5,
  y: VIEWBOX.height * 0.5,
};

export function getHomeDeepSpaceSlots(count = DEFAULT_SLOT_COUNT) {
  if (slotCache.has(count)) {
    return slotCache.get(count);
  }

  const random = mulberry32(hashString(`home-deep-space-${count}`));
  const slots = [];
  let attempts = 0;
  while (slots.length < count && attempts < count * 24) {
    attempts += 1;
    const nx = random();
    const ny = random();
    if (random() <= sampleDeepSpaceDensity(nx, ny)) {
      slots.push(createSlot(nx, ny, random, slots.length));
    }
  }

  while (slots.length < count) {
    const nx = random();
    const ny = random();
    slots.push(createSlot(nx, ny, random, slots.length));
  }

  slotCache.set(count, slots);
  return slots;
}

export function sampleDeepSpaceHomeField(x, y) {
  const nx = clamp(x / VIEWBOX.width, 0, 1);
  const ny = clamp(y / VIEWBOX.height, 0, 1);
  const featureSamples = sampleFeatureFields(nx, ny);
  const dust = sampleDust(nx, ny);
  const density = sampleDeepSpaceDensity(nx, ny);
  const warm = clamp(featureSamples.warm + density * 0.09, 0, 1);
  const cool = clamp(featureSamples.cool + density * 0.14, 0, 1);
  const brightness = clamp(0.08 + density * 0.5 + Math.max(warm, cool) * 0.24 - dust * 0.08, 0, 1);

  return {
    density,
    warm,
    cool,
    brightness,
    backlight: clamp(featureSamples.glow * 0.55 + density * 0.08, 0, 1),
    void: clamp(dust * 0.38, 0, 1),
    ambient: clamp(0.46 + density * 0.42 + cool * 0.1 - dust * 0.08, 0, 1),
  };
}

function createSlot(nx, ny, random, index) {
  const x = lerp(VIEW_MARGIN, VIEWBOX.width - VIEW_MARGIN, nx);
  const y = lerp(VIEW_MARGIN, VIEWBOX.height - VIEW_MARGIN, ny);
  const field = sampleDeepSpaceHomeField(x, y);
  const warmBias = clamp(field.warm - field.cool * 0.42, 0, 1);
  const coolBias = clamp(field.cool - field.warm * 0.28, 0, 1);
  const paletteRoll = random();
  const warmPickChance = clamp(0.18 + warmBias * 0.42 + field.brightness * 0.06, 0.18, 0.64);
  const palette =
    paletteRoll < warmPickChance
      ? WARM_COLORS
      : coolBias > 0.22 || paletteRoll < warmPickChance + 0.38
        ? COOL_COLORS
        : NEUTRAL_COLORS;
  const color = palette[Math.floor(random() * palette.length)] ?? palette[0];
  const coreColor = warmBias > coolBias ? "#fff1d6" : random() > 0.28 ? "#f6fbff" : "#e8f2ff";
  const haloColor = warmBias > coolBias ? "#f5bf85" : "#8dc6ff";
  const sizeRoll = random();
  const brightTier = sizeRoll > 0.988 ? 1 : sizeRoll > 0.82 ? 0.46 : 0;
  const sparkleSeed = field.brightness * 0.58 + field.density * 0.16 + Math.max(warmBias, coolBias) * 0.24 + random() * 0.42 + brightTier * 0.2;

  return {
    id: index,
    x,
    y,
    homeColor: color,
    homeCoreColor: coreColor,
    homeHaloColor: haloColor,
    homeAlpha: clamp(0.07 + field.density * 0.22 + field.brightness * 0.08 + random() * 0.12 + brightTier * 0.42, 0.06, 0.96),
    homeRadiusScale: clamp(0.055 + field.density * 0.085 + field.brightness * 0.04 + random() * 0.09 + brightTier * 0.62, 0.05, 1.02),
    homeGlowStrength: clamp(field.brightness * 0.3 + field.backlight * 0.16 + random() * 0.16 + brightTier * 0.5, 0, 0.98),
    homeSharpness: clamp(0.58 + field.brightness * 0.28 + random() * 0.14, 0.5, 0.96),
    homeSparkle: clamp(sparkleSeed, 0, 0.92),
  };
}

function sampleDeepSpaceDensity(nx, ny) {
  const featureSamples = sampleFeatureFields(nx, ny);
  const dust = sampleDust(nx, ny);
  const subtleBand = sampleEllipse({ x: 0.54, y: 0.52, rx: 0.52, ry: 0.24, rotation: 0.18, strength: 0.055, falloff: 1.6 }, nx, ny);
  const edgeFalloff = 1 - Math.max(0, Math.hypot(nx - 0.5, ny - 0.5) - 0.62) * 0.08;
  const microVariation = (Math.sin(nx * 81.7 + ny * 37.1) + Math.sin(nx * 23.3 - ny * 59.4)) * 0.012;
  return clamp((0.58 + featureSamples.total * 0.2 + subtleBand + microVariation - dust * 0.06) * edgeFalloff, 0.44, 0.86);
}

function sampleFeatureFields(nx, ny) {
  return FEATURE_FIELDS.reduce(
    (acc, feature) => {
      const value = sampleEllipse(feature, nx, ny);
      acc.total += value;
      acc.glow += value * (feature.id === "mainSpiral" || feature.id.includes("Nebula") ? 0.82 : 0.42);
      if (feature.tone === "warm") {
        acc.warm += value;
      } else {
        acc.cool += value;
      }
      return acc;
    },
    { total: 0, warm: 0, cool: 0, glow: 0 },
  );
}

function sampleDust(nx, ny) {
  return DUST_SHADOWS.reduce((sum, feature) => sum + sampleEllipse(feature, nx, ny), 0);
}

function sampleEllipse(feature, nx, ny) {
  const rotated = rotate(nx - feature.x, ny - feature.y, -(feature.rotation ?? 0));
  const normalized = (rotated.x / feature.rx) ** 2 + (rotated.y / feature.ry) ** 2;
  return Math.exp(-normalized * (feature.falloff ?? 2.4)) * feature.strength;
}

function rotate(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
