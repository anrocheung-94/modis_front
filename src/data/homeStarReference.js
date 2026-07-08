import { VIEWBOX } from "./atlasData.js";

export const HOME_REFERENCE_DIMENSIONS = {
  sourceWidth: 1487,
  sourceHeight: 1058,
  atlasWidth: VIEWBOX.width,
  atlasHeight: VIEWBOX.height,
  cols: 16,
  rows: 12,
};

export const HOME_REFERENCE_CLUSTER_CENTER = {
  x: 548,
  y: 274,
};

const HOME_REFERENCE_DENSITY_GRID = [
  [0.0, 0.0, 0.0, 0.0, 0.002, 0.083, 0.015, 0.205, 0.015, 0.007, 0.023, 0.003, 0.001, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.447, 0.173, 0.355, 1.0, 0.248, 0.105, 0.178, 0.012, 0.004, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.084, 0.335, 0.574, 0.906, 0.722, 0.541, 0.229, 0.025, 0.006, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.216, 0.79, 0.93, 0.593, 0.583, 0.765, 0.227, 0.057, 0.018, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.334, 0.819, 0.83, 0.564, 0.596, 0.421, 0.199, 0.088, 0.043, 0.0, 0.0, 0.0],
  [0.0, 0.005, 0.005, 0.05, 0.335, 0.402, 0.658, 0.642, 0.319, 0.229, 0.146, 0.117, 0.053, 0.0, 0.0, 0.0],
  [0.001, 0.001, 0.004, 0.023, 0.211, 0.427, 0.625, 0.318, 0.202, 0.16, 0.149, 0.094, 0.036, 0.0, 0.0, 0.0],
  [0.001, 0.0, 0.005, 0.008, 0.048, 0.05, 0.137, 0.171, 0.097, 0.081, 0.062, 0.022, 0.014, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.022, 0.04, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.007, 0.004, 0.008, 0.001, 0.002],
  [0.0, 0.0, 0.0, 0.212, 0.25, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.007, 0.005, 0.002, 0.002, 0.002],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const HOME_REFERENCE_WARM_GRID = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.005, 0.0, 0.0, 0.005, 0.01, 0.008, 0.001, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.892, 0.121, 0.016, 0.019, 0.008, 0.001, 0.018, 0.02, 0.01, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.028, 0.027, 0.086, 0.126, 0.055, 0.079, 0.061, 0.052, 0.009, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.069, 0.091, 0.136, 0.334, 0.284, 0.506, 0.18, 0.12, 0.049, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.041, 0.089, 0.315, 0.787, 0.68, 0.532, 0.31, 0.168, 0.048, 0.0, 0.0, 0.0],
  [0.0, 0.004, 0.002, 0.002, 0.043, 0.155, 0.683, 1.0, 0.642, 0.454, 0.218, 0.16, 0.056, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.011, 0.002, 0.006, 0.046, 0.558, 0.323, 0.35, 0.232, 0.251, 0.104, 0.058, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.007, 0.0, 0.0, 0.014, 0.038, 0.09, 0.094, 0.096, 0.079, 0.034, 0.02, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.029, 0.006, 0.001, 0.003, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.001, 0.001, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const HOME_REFERENCE_COOL_GRID = [
  [0.0, 0.0, 0.0, 0.0, 0.264, 0.395, 0.308, 0.497, 0.337, 0.262, 0.312, 0.188, 0.188, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.247, 0.462, 0.535, 0.953, 0.577, 0.445, 0.479, 0.242, 0.193, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.398, 0.639, 0.674, 0.816, 0.827, 0.636, 0.385, 0.26, 0.263, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.531, 0.933, 0.856, 0.529, 0.536, 0.426, 0.337, 0.287, 0.307, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.672, 0.931, 0.658, 0.327, 0.328, 0.282, 0.3, 0.313, 0.383, 0.0, 0.0, 0.0],
  [0.139, 0.186, 0.259, 0.444, 0.683, 0.577, 0.387, 0.262, 0.229, 0.244, 0.29, 0.335, 0.368, 0.0, 0.0, 0.0],
  [0.137, 0.173, 0.245, 0.382, 0.571, 0.559, 0.369, 0.331, 0.283, 0.306, 0.312, 0.356, 0.322, 0.0, 0.0, 0.0],
  [0.158, 0.192, 0.254, 0.354, 0.406, 0.381, 0.426, 0.422, 0.343, 0.355, 0.342, 0.314, 0.281, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.499, 0.534, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.271, 0.245, 0.18, 0.125, 0.108],
  [0.0, 0.0, 0.0, 0.955, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.274, 0.231, 0.175, 0.129, 0.114],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const HOME_REFERENCE_DENSITY_FIELDS = [
  { x: 0.52, y: 0.21, rx: 0.11, ry: 0.26, rotation: -0.02, strength: 0.22, falloff: 2.9 },
  { x: 0.44, y: 0.39, rx: 0.17, ry: 0.24, rotation: -0.34, strength: 0.24, falloff: 2.5 },
  { x: 0.56, y: 0.45, rx: 0.23, ry: 0.11, rotation: 0.36, strength: 0.32, falloff: 2.8 },
  { x: 0.65, y: 0.41, rx: 0.17, ry: 0.17, rotation: -0.24, strength: 0.18, falloff: 2.4 },
  { x: 0.52, y: 0.56, rx: 0.14, ry: 0.14, rotation: 0.08, strength: 0.1, falloff: 2.8 },
];

const HOME_REFERENCE_WARM_FIELDS = [
  { x: 0.59, y: 0.44, rx: 0.13, ry: 0.12, rotation: 0.22, strength: 0.38, falloff: 3.4 },
  { x: 0.5, y: 0.52, rx: 0.15, ry: 0.08, rotation: 0.52, strength: 0.3, falloff: 3.6 },
  { x: 0.67, y: 0.33, rx: 0.11, ry: 0.12, rotation: -0.16, strength: 0.22, falloff: 3.0 },
  { x: 0.54, y: 0.6, rx: 0.08, ry: 0.09, rotation: 0.0, strength: 0.12, falloff: 3.2 },
];

const HOME_REFERENCE_COOL_FIELDS = [
  { x: 0.52, y: 0.15, rx: 0.1, ry: 0.24, rotation: -0.04, strength: 0.48, falloff: 3.1 },
  { x: 0.39, y: 0.38, rx: 0.15, ry: 0.27, rotation: -0.32, strength: 0.44, falloff: 2.8 },
  { x: 0.64, y: 0.36, rx: 0.19, ry: 0.2, rotation: 0.3, strength: 0.28, falloff: 2.5 },
  { x: 0.47, y: 0.59, rx: 0.2, ry: 0.11, rotation: 0.16, strength: 0.16, falloff: 2.4 },
];

const HOME_REFERENCE_VOID_FIELDS = [
  { x: 0.16, y: 0.33, rx: 0.2, ry: 0.3, rotation: -0.08, strength: 0.62 },
  { x: 0.12, y: 0.79, rx: 0.22, ry: 0.14, rotation: 0.02, strength: 0.94 },
  { x: 0.86, y: 0.36, rx: 0.13, ry: 0.24, rotation: -0.12, strength: 0.56 },
  { x: 0.72, y: 0.18, rx: 0.12, ry: 0.11, rotation: 0.0, strength: 0.3 },
  { x: 0.57, y: 0.89, rx: 0.24, ry: 0.1, rotation: 0.02, strength: 0.88 },
];

export const HOME_REFERENCE_NEBULA_LAYERS = {
  backlights: [
    { x: 0.55, y: 0.42, rx: 0.09, ry: 0.07, rotation: 0.16, alpha: 0.014, color: "#efc28d" },
    { x: 0.48, y: 0.26, rx: 0.07, ry: 0.14, rotation: -0.18, alpha: 0.014, color: "#87baf2" },
    { x: 0.61, y: 0.22, rx: 0.06, ry: 0.13, rotation: 0.1, alpha: 0.012, color: "#9da9ff" },
  ],
  volumetrics: [
    { x: 0.52, y: 0.35, rx: 0.15, ry: 0.11, rotation: -0.06, alpha: 0.008, color: "#96c0f6" },
    { x: 0.57, y: 0.46, rx: 0.14, ry: 0.07, rotation: 0.3, alpha: 0.007, color: "#ebc28f" },
  ],
  coolPlumes: [
    { x: 0.48, y: 0.16, rx: 0.026, ry: 0.26, rotation: -0.02, alpha: 0.036, color: "#9aceff" },
    { x: 0.43, y: 0.39, rx: 0.04, ry: 0.17, rotation: -0.33, alpha: 0.024, color: "#73acef" },
    { x: 0.55, y: 0.18, rx: 0.03, ry: 0.22, rotation: -0.04, alpha: 0.03, color: "#b7dcff" },
    { x: 0.62, y: 0.2, rx: 0.03, ry: 0.18, rotation: 0.06, alpha: 0.024, color: "#95a7ff" },
  ],
  milkyBands: [
    { x: 0.45, y: 0.48, rx: 0.1, ry: 0.024, rotation: 0.32, alpha: 0.02, color: "#dce8ff" },
    { x: 0.56, y: 0.43, rx: 0.13, ry: 0.028, rotation: 0.32, alpha: 0.026, color: "#eef4ff" },
    { x: 0.66, y: 0.39, rx: 0.08, ry: 0.022, rotation: 0.32, alpha: 0.018, color: "#cfe0fb" },
  ],
  warmCores: [
    { x: 0.56, y: 0.42, rx: 0.06, ry: 0.05, rotation: 0.18, alpha: 0.03, color: "#ffd3a0" },
    { x: 0.51, y: 0.5, rx: 0.08, ry: 0.036, rotation: 0.54, alpha: 0.026, color: "#f0b76f" },
  ],
  dustVeils: [
    { x: 0.56, y: 0.45, rx: 0.12, ry: 0.03, rotation: 0.34, alpha: 0.018, color: "#f1bf7f" },
  ],
  haze: [
    { x: 0.53, y: 0.37, rx: 0.14, ry: 0.1, rotation: -0.06, alpha: 0.008, color: "#96bcf1" },
  ],
};

const HOME_REFERENCE_PARTICLE_STREAMS = [
  {
    count: 320,
    x: 0.48,
    y: 0.16,
    rx: 0.028,
    ry: 0.26,
    rotation: -0.02,
    focus: 1.7,
    radius: [0.24, 1.12],
    alpha: [0.02, 0.12],
    halo: [0, 0.18],
    palette: ["#7ba9e1", "#9bcdf8", "#dcecff"],
    drift: 0.9,
  },
  {
    count: 260,
    x: 0.43,
    y: 0.39,
    rx: 0.042,
    ry: 0.17,
    rotation: -0.34,
    focus: 1.6,
    radius: [0.24, 1.04],
    alpha: [0.02, 0.11],
    halo: [0, 0.16],
    palette: ["#699ad9", "#88baef", "#d6e9ff"],
    drift: 0.72,
  },
  {
    count: 280,
    x: 0.58,
    y: 0.21,
    rx: 0.05,
    ry: 0.22,
    rotation: 0.04,
    focus: 1.72,
    radius: [0.24, 1.08],
    alpha: [0.02, 0.115],
    halo: [0, 0.16],
    palette: ["#85afe8", "#a5d4ff", "#eef6ff"],
    drift: 0.82,
  },
  {
    count: 360,
    x: 0.56,
    y: 0.43,
    rx: 0.19,
    ry: 0.038,
    rotation: 0.32,
    focus: 1.44,
    radius: [0.24, 1.08],
    alpha: [0.018, 0.1],
    halo: [0, 0.14],
    palette: ["#c3d6f6", "#dbe7fb", "#f1f6ff"],
    drift: 0.66,
  },
  {
    count: 540,
    x: 0.56,
    y: 0.42,
    rx: 0.1,
    ry: 0.11,
    rotation: 0.22,
    focus: 1.82,
    radius: [0.28, 1.26],
    alpha: [0.028, 0.18],
    halo: [0.04, 0.24],
    palette: ["#e2a35c", "#f1c68f", "#ffe1b7"],
    drift: 0.58,
  },
  {
    count: 320,
    x: 0.5,
    y: 0.52,
    rx: 0.12,
    ry: 0.05,
    rotation: 0.52,
    focus: 1.56,
    radius: [0.24, 1.02],
    alpha: [0.02, 0.12],
    halo: [0, 0.16],
    palette: ["#cc8b4f", "#e7b06f", "#f8d09f"],
    drift: 0.52,
  },
];

export const HOME_REFERENCE_PARTICLE_OVERLAY = buildHomeReferenceParticleOverlay();

export function sampleHomeReferenceField(x, y) {
  const nx = clamp(x / VIEWBOX.width, 0, 1);
  const ny = clamp(y / VIEWBOX.height, 0, 1);
  const densityBase = sampleGrid(HOME_REFERENCE_DENSITY_GRID, nx, ny);
  const warmBase = sampleGrid(HOME_REFERENCE_WARM_GRID, nx, ny);
  const coolBase = sampleGrid(HOME_REFERENCE_COOL_GRID, nx, ny);
  const densityBoost = sampleFeatureSet(HOME_REFERENCE_DENSITY_FIELDS, nx, ny);
  const warmBoost = sampleFeatureSet(HOME_REFERENCE_WARM_FIELDS, nx, ny);
  const coolBoost = sampleFeatureSet(HOME_REFERENCE_COOL_FIELDS, nx, ny);
  const voidStrength = clamp(sampleFeatureSet(HOME_REFERENCE_VOID_FIELDS, nx, ny), 0, 1);
  const upperAttenuation = ny < 0.3 ? lerp(0.58, 1, ny / 0.3) : 1;
  const dustBand = sampleGaussianEllipse(
    { x: 0.56, y: 0.44, rx: 0.18, ry: 0.05, rotation: 0.33, strength: 0.18, falloff: 2.5 },
    nx,
    ny,
  );
  const milkyBand = sampleGaussianEllipse(
    { x: 0.55, y: 0.42, rx: 0.22, ry: 0.048, rotation: 0.32, strength: 0.32, falloff: 2.35 },
    nx,
    ny,
  );
  const centralGlow = sampleGaussianEllipse(
    { x: 0.57, y: 0.42, rx: 0.09, ry: 0.08, rotation: 0.08, strength: 0.1, falloff: 2.7 },
    nx,
    ny,
  );
  const density = clamp(
    (densityBase * 0.46 +
      warmBase * 0.42 +
      coolBase * 0.34 +
      densityBoost * 0.96 +
      warmBoost * 0.26 +
      dustBand * 0.34 +
      milkyBand * 0.46 +
      centralGlow * 0.2 -
      coolBoost * 0.04) *
      upperAttenuation *
      (1 - voidStrength * 0.94),
    0,
    1,
  );
  const warm = clamp(
    (warmBase * 0.92 + warmBoost * 0.84 + dustBand * 0.16 + milkyBand * 0.02) * (1 - voidStrength * 0.82),
    0,
    1,
  );
  const cool = clamp(
    (coolBase * 1.04 + coolBoost * 1.05 + milkyBand * 0.22 + centralGlow * 0.05) * (1 - voidStrength * 0.72),
    0,
    1,
  );
  const backlight = clamp(centralGlow * 0.24 + dustBand * 0.08 + milkyBand * 0.18 + cool * 0.1, 0, 1);
  const brightness = clamp(
    density * 0.54 + Math.max(warm, cool) * 0.28 + Math.abs(warm - cool) * 0.12 + backlight * 0.06,
    0,
    1,
  );

  return {
    density,
    warm,
    cool,
    brightness,
    backlight,
    void: voidStrength,
    ambient: clamp(density * 0.42 + cool * 0.36 + backlight * 0.08 + (1 - voidStrength) * 0.08, 0, 1),
  };
}

function buildHomeReferenceParticleOverlay() {
  const random = mulberry32(0x4d4f4449);
  return HOME_REFERENCE_PARTICLE_STREAMS.flatMap((stream, streamIndex) =>
    Array.from({ length: stream.count }, (_, index) =>
      createHomeReferenceParticle(random, stream, `${streamIndex}-${index}`),
    ),
  );
}

function createHomeReferenceParticle(random, stream, id) {
  const position = sampleStreamPoint(random, stream);
  const paletteIndex = Math.min(stream.palette.length - 1, Math.floor(random() * stream.palette.length));
  return {
    id,
    x: clamp(position.x, 0.02, 0.98),
    y: clamp(position.y, 0.02, 0.98),
    color: stream.palette[paletteIndex] ?? stream.palette[0],
    radius: lerp(stream.radius[0], stream.radius[1], random() ** 1.45),
    alpha: lerp(stream.alpha[0], stream.alpha[1], random() ** 1.24),
    halo: stream.halo ? lerp(stream.halo[0], stream.halo[1], random() ** 1.75) : 0,
    driftX: (random() - 0.5) * (stream.drift ?? 0.5),
    driftY: (random() - 0.5) * ((stream.drift ?? 0.5) * 0.8),
    twinkle: 0.88 + random() * 0.24,
    phase: random() * Math.PI * 2,
  };
}

function sampleStreamPoint(random, stream) {
  const theta = random() * Math.PI * 2;
  const radius = random() ** (stream.focus ?? 1.6);
  const localX = Math.cos(theta) * stream.rx * radius;
  const localY = Math.sin(theta) * stream.ry * radius;
  const rotated = rotate(localX, localY, stream.rotation ?? 0);
  return {
    x: stream.x + rotated.x,
    y: stream.y + rotated.y,
  };
}

function sampleGrid(grid, nx, ny) {
  const rowCount = grid.length;
  const colCount = grid[0]?.length ?? 0;
  const gx = clamp(nx * (colCount - 1), 0, colCount - 1);
  const gy = clamp(ny * (rowCount - 1), 0, rowCount - 1);
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const x1 = Math.min(colCount - 1, x0 + 1);
  const y1 = Math.min(rowCount - 1, y0 + 1);
  const tx = gx - x0;
  const ty = gy - y0;
  const top = lerp(grid[y0][x0], grid[y0][x1], tx);
  const bottom = lerp(grid[y1][x0], grid[y1][x1], tx);
  return lerp(top, bottom, ty);
}

function sampleFeatureSet(features, nx, ny) {
  return features.reduce((sum, feature) => sum + sampleGaussianEllipse(feature, nx, ny), 0);
}

function sampleGaussianEllipse(feature, nx, ny) {
  const rotated = rotate(nx - feature.x, ny - feature.y, -(feature.rotation ?? 0));
  const normalized = (rotated.x / feature.rx) ** 2 + (rotated.y / feature.ry) ** 2;
  return Math.exp(-normalized * (feature.falloff ?? 2.8)) * feature.strength;
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
