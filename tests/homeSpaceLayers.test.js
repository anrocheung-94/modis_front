import test from "node:test";
import assert from "node:assert/strict";

import { HOME_SPACE_LAYER_GROUPS, HOME_SPACE_LAYERS } from "../src/data/homeSpaceLayers.js";

test("home space layers are independent semantic assets instead of baked layer sheets", () => {
  const layersByKind = HOME_SPACE_LAYERS.reduce((acc, layer) => {
    acc.set(layer.kind, [...(acc.get(layer.kind) ?? []), layer]);
    return acc;
  }, new Map());

  assert.equal(layersByKind.get("background")?.length, 1);
  assert.ok((layersByKind.get("galaxy") ?? []).length >= 7);
  assert.equal(layersByKind.get("dust")?.length ?? 0, 0);
  assert.equal(layersByKind.get("nebula")?.length ?? 0, 0);
  assert.equal(layersByKind.get("blue-glow")?.length ?? 0, 0);
  assert.equal(layersByKind.get("particle")?.length ?? 0, 0);

  for (const layer of HOME_SPACE_LAYERS) {
    assert.equal(layer.isComponentAsset, true, layer.id);
    assert.equal(typeof layer.src, "string", layer.id);
    assert.ok(layer.src.startsWith("/assets/home-space-layers/"), layer.id);
    assert.ok(layer.src.includes("/img-v3/"), layer.id);
    assert.ok(!layer.src.includes("galaxies-primary"), layer.id);
    assert.ok(layer.width > 0 && layer.width <= 1.2, layer.id);
    assert.ok(layer.opacity > 0 && layer.opacity <= 1, layer.id);
    assert.ok(Number.isFinite(layer.x), layer.id);
    assert.ok(Number.isFinite(layer.y), layer.id);
    assert.ok(Number.isFinite(layer.zIndex), layer.id);
  }
});

test("home space layer composition follows the selected concept 3 layout", () => {
  const baseMatte = HOME_SPACE_LAYERS.find((layer) => layer.id === "base-matte");
  const mainGalaxy = HOME_SPACE_LAYERS.find((layer) => layer.id === "galaxy-main-spiral");
  const rightGalaxy = HOME_SPACE_LAYERS.find((layer) => layer.id === "galaxy-right-red-smudge");

  assert.ok(baseMatte, "integrated base matte is present");
  assert.ok(mainGalaxy, "main spiral galaxy is present");
  assert.ok(rightGalaxy, "right red smudge galaxy is present");

  assert.equal(baseMatte.kind, "background");
  assert.equal(baseMatte.fit, "cover");
  assert.ok(baseMatte.width >= 1.1);
  assert.ok(mainGalaxy.x > 0.42 && mainGalaxy.x < 0.52);
  assert.ok(mainGalaxy.y > 0.3 && mainGalaxy.y < 0.42);
  assert.ok(mainGalaxy.width < 0.075);
  assert.ok(rightGalaxy.x > 0.7 && rightGalaxy.y > 0.38 && rightGalaxy.y < 0.6);
  assert.ok(rightGalaxy.width < 0.06);
});

test("home space layer groups expose stable render order names", () => {
  assert.deepEqual(
    HOME_SPACE_LAYER_GROUPS.map((group) => group.kind),
    ["background", "galaxy"],
  );
});
