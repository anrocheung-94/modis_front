const ASSET_ROOT = "/assets/home-space-layers/img-v3/";

export const HOME_SPACE_LAYER_GROUPS = [
  { kind: "background", stage: "back" },
  { kind: "galaxy", stage: "back" },
];

export const HOME_SPACE_LAYERS = [
  layer("base-matte", "background", "base-matte.png", 0.5, 0.5, 1.18, 0, 1, "normal", 0, "back", "cover"),

  layer("galaxy-main-spiral", "galaxy", "galaxy-main-spiral.png", 0.475, 0.34, 0.046, -6, 0.44, "screen", 3, "front"),
  layer("galaxy-small-blue-spiral", "galaxy", "galaxy-small-blue-spiral.png", 0.66, 0.89, 0.032, -16, 0.28, "screen", 3, "front"),
  layer("galaxy-right-red-smudge", "galaxy", "galaxy-right-red-smudge.png", 0.79, 0.475, 0.035, 5, 0.34, "screen", 3, "front"),
  layer("galaxy-upper-silver-oval", "galaxy", "galaxy-upper-silver-oval.png", 0.515, 0.255, 0.022, -12, 0.24, "screen", 3, "front"),
  layer("galaxy-left-edge-oval", "galaxy", "galaxy-left-edge-oval.png", 0.026, 0.595, 0.023, -24, 0.28, "screen", 3, "front"),
  layer("galaxy-lower-red-core", "galaxy", "galaxy-lower-red-core.png", 0.25, 0.94, 0.03, 14, 0.32, "screen", 3, "front"),
  layer("galaxy-bottom-blue-edge", "galaxy", "galaxy-bottom-blue-edge.png", 0.665, 0.92, 0.028, -8, 0.24, "screen", 3, "front"),
  layer("galaxy-right-edge-on", "galaxy", "galaxy-right-edge-on.png", 0.82, 0.345, 0.032, 5, 0.24, "screen", 3, "front"),
  layer("galaxy-tiny-upper-right", "galaxy", "galaxy-tiny-upper-right.png", 0.72, 0.18, 0.016, -18, 0.24, "screen", 3, "front"),
];

function layer(id, kind, filename, x, y, width, rotation, opacity, blendMode, zIndex, stage, fit = "contain") {
  return {
    id,
    kind,
    src: `${ASSET_ROOT}${filename}`,
    x,
    y,
    width,
    rotation,
    opacity,
    blendMode,
    zIndex,
    stage,
    fit,
    isComponentAsset: true,
  };
}
