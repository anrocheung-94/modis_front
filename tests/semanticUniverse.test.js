import test from "node:test";
import assert from "node:assert/strict";

import { APP_META, HOME_SCENE, VIEWBOX } from "../src/data/atlasData.js";
import {
  SCATTER_POINT_BUDGET,
  PRIMARY_CLUSTER_COUNT,
  buildSemanticUniverse,
  buildGalaxyMetrics,
} from "../src/model/semanticUniverse.js";

test("semantic universe keeps the exact homepage point budget", () => {
  const universe = buildSemanticUniverse();
  assert.equal(universe.points.length, SCATTER_POINT_BUDGET);
  assert.equal(universe.ambientStars.length, 2360);

  const clusterIds = new Set(universe.points.map((point) => point.clusterId));
  assert.equal(clusterIds.size, PRIMARY_CLUSTER_COUNT);
});

test("clustered galaxy metrics preserve all primary clusters and rank the largest galaxies first", () => {
  const universe = buildSemanticUniverse();
  const metrics = buildGalaxyMetrics(universe.points);

  assert.equal(metrics.length, PRIMARY_CLUSTER_COUNT);
  assert.equal(metrics[0].clusterId, 5);
  assert.equal(metrics[1].clusterId, 1);
  assert.equal(metrics[2].clusterId, 2);
});

test("homepage scene config keeps observation console truth values centralized", () => {
  const { homeHero, observationConsole, clusterConsole, hud } = HOME_SCENE;

  assert.equal(homeHero.title, "MODIS Research");
  assert.equal(homeHero.ctaZh, "开始探索");
  assert.equal(homeHero.fontOptions.length, 1);
  assert.equal(homeHero.fontOptions[0].id, "crimson");
  assert.ok(homeHero.ctaAsset.includes("/assets/home-cta/start-explore-"));
  assert.equal(observationConsole.rows[0].value, APP_META.corpusSentences.toLocaleString());
  assert.equal(observationConsole.rows[1].value, APP_META.publicationCount.toLocaleString());
  assert.equal(observationConsole.rows[2].value, "2001-2025");
  assert.equal(observationConsole.rows[3].captionEn, "23,000 semantic points");
  assert.equal(observationConsole.rows[4].captionEn, "12 primary clusters");
  assert.equal(clusterConsole.actionEn, "Start Level-1 Clustering");
  assert.equal(hud[0].value, `${APP_META.pointBudget.toLocaleString()} points`);
});

test("unclustered homepage points follow a full deep-space field with concept-3 feature emphasis", () => {
  const universe = buildSemanticUniverse();
  const bounds = universe.points.reduce(
    (acc, point) => ({
      sumX: acc.sumX + point.freeX,
      sumY: acc.sumY + point.freeY,
    }),
    {
      sumX: 0,
      sumY: 0,
    },
  );
  const averageX = bounds.sumX / universe.points.length;
  const averageY = bounds.sumY / universe.points.length;
  const topLeft = universe.points.filter((point) => point.freeX < VIEWBOX.width * 0.5 && point.freeY < VIEWBOX.height * 0.5).length;
  const topRight = universe.points.filter((point) => point.freeX >= VIEWBOX.width * 0.5 && point.freeY < VIEWBOX.height * 0.5).length;
  const bottomLeft = universe.points.filter((point) => point.freeX < VIEWBOX.width * 0.5 && point.freeY >= VIEWBOX.height * 0.5).length;
  const bottomRight = universe.points.filter((point) => point.freeX >= VIEWBOX.width * 0.5 && point.freeY >= VIEWBOX.height * 0.5).length;
  const mainSpiralRegion = universe.points.filter((point) => point.freeX > 420 && point.freeX < 560 && point.freeY > 190 && point.freeY < 300).length;
  const leftNebulaCorridor = universe.points.filter((point) => point.freeX < 210 && point.freeY > 70 && point.freeY < 410).length;
  const lowerRightNebulaCorridor = universe.points.filter((point) => point.freeX > 730 && point.freeY > 420).length;
  const centerField = universe.points.filter((point) => point.freeX > 300 && point.freeX < 720 && point.freeY > 180 && point.freeY < 500).length;
  const quadrantShares = [topLeft, topRight, bottomLeft, bottomRight].map((count) => count / universe.points.length);
  const quadrantSpread = Math.max(...quadrantShares) / Math.min(...quadrantShares);

  assert.ok(averageX > VIEWBOX.width * 0.46 && averageX < VIEWBOX.width * 0.54);
  assert.ok(averageY > VIEWBOX.height * 0.44 && averageY < VIEWBOX.height * 0.56);
  assert.ok(topLeft / universe.points.length > 0.18);
  assert.ok(topRight / universe.points.length > 0.18);
  assert.ok(bottomLeft / universe.points.length > 0.16);
  assert.ok(bottomRight / universe.points.length > 0.16);
  assert.ok(quadrantSpread < 1.16);
  assert.ok(centerField / universe.points.length > 0.2);
  assert.ok(mainSpiralRegion / universe.points.length > 0.018);
  assert.ok(mainSpiralRegion / universe.points.length < 0.03);
  assert.ok(leftNebulaCorridor / universe.points.length > 0.08);
  assert.ok(lowerRightNebulaCorridor / universe.points.length > 0.08);
});

test("unclustered homepage points precompute reference-driven home styling metadata", () => {
  const universe = buildSemanticUniverse();
  const warmColors = new Set(["#fff6e8", "#f7e7d1", "#efcaa0", "#ffc782", "#e0a36d", "#dcc3a3"]);
  const coolColors = new Set(["#f7fbff", "#e6f1ff", "#d8e8ff", "#cde0ff", "#aac9f0", "#86b9ff"]);
  const homeColors = new Set();
  let maxAlpha = 0;
  let minAlpha = Number.POSITIVE_INFINITY;
  let maxRadiusScale = 0;
  let minRadiusScale = Number.POSITIVE_INFINITY;
  let maxSharpness = 0;
  let minSharpness = Number.POSITIVE_INFINITY;
  let maxSparkle = 0;
  let minSparkle = Number.POSITIVE_INFINITY;
  let warmCount = 0;
  let coolCount = 0;
  let glowCount = 0;
  let sparkleCount = 0;

  universe.points.forEach((point) => {
    assert.equal(typeof point.homeColor, "string");
    assert.equal(typeof point.homeAlpha, "number");
    assert.equal(typeof point.homeRadiusScale, "number");
    assert.equal(typeof point.homeGlowStrength, "number");
    assert.equal(typeof point.homeSharpness, "number");
    assert.equal(typeof point.homeSparkle, "number");
    assert.equal(typeof point.homeCoreColor, "string");
    assert.equal(typeof point.homeHaloColor, "string");

    homeColors.add(point.homeColor);
    maxAlpha = Math.max(maxAlpha, point.homeAlpha);
    minAlpha = Math.min(minAlpha, point.homeAlpha);
    maxRadiusScale = Math.max(maxRadiusScale, point.homeRadiusScale);
    minRadiusScale = Math.min(minRadiusScale, point.homeRadiusScale);
    maxSharpness = Math.max(maxSharpness, point.homeSharpness);
    minSharpness = Math.min(minSharpness, point.homeSharpness);
    maxSparkle = Math.max(maxSparkle, point.homeSparkle);
    minSparkle = Math.min(minSparkle, point.homeSparkle);
    if (warmColors.has(point.homeColor)) {
      warmCount += 1;
    }
    if (coolColors.has(point.homeColor)) {
      coolCount += 1;
    }
    if (point.homeGlowStrength > 0.45) {
      glowCount += 1;
    }
    if (point.homeSparkle > 0.62) {
      sparkleCount += 1;
    }
  });

  assert.ok(homeColors.size >= 6);
  assert.ok(minAlpha >= 0.06);
  assert.ok(maxAlpha >= 0.66);
  assert.ok(minRadiusScale >= 0.07);
  assert.ok(maxRadiusScale >= 0.6);
  assert.ok(minSharpness >= 0.5);
  assert.ok(maxSharpness >= 0.84);
  assert.ok(minSparkle >= 0);
  assert.ok(maxSparkle >= 0.65);
  assert.ok(warmCount / universe.points.length > 0.02);
  assert.ok(coolCount / universe.points.length > 0.2);
  assert.ok(glowCount / universe.points.length > 0.025);
  assert.ok(glowCount / universe.points.length < 0.1);
  assert.ok(sparkleCount / universe.points.length > 0.08);
});
