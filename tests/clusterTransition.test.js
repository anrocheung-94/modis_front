import test from "node:test";
import assert from "node:assert/strict";

import {
  CLUSTERED_POINT_RADIUS_SCALE,
  CLUSTERING_TRANSITION_SECONDS,
  getClusteredPointMotion,
  getClusterTransitionPosition,
} from "../src/model/clusterTransition.js";

const samplePoint = {
  pointIndex: 17,
  clusterId: 4,
  freeX: 120,
  freeY: 480,
  clusteredX: 760,
  clusteredY: 180,
};

test("cluster transition duration is fixed at two seconds", () => {
  assert.equal(CLUSTERING_TRANSITION_SECONDS, 2);
});

test("curved cluster transition preserves exact start and end positions", () => {
  assert.deepEqual(getClusterTransitionPosition(samplePoint, 0), {
    x: samplePoint.freeX,
    y: samplePoint.freeY,
  });
  assert.deepEqual(getClusterTransitionPosition(samplePoint, 1), {
    x: samplePoint.clusteredX,
    y: samplePoint.clusteredY,
  });
});

test("curved cluster transition midpoint bends away from linear interpolation", () => {
  const midpoint = getClusterTransitionPosition(samplePoint, 0.5);
  const linearMidpoint = {
    x: (samplePoint.freeX + samplePoint.clusteredX) / 2,
    y: (samplePoint.freeY + samplePoint.clusteredY) / 2,
  };

  assert.ok(Math.abs(midpoint.x - linearMidpoint.x) > 8);
  assert.ok(Math.abs(midpoint.y - linearMidpoint.y) > 8);
});

test("clustered point motion adds subtle liveness in normal motion", () => {
  const motionA = getClusteredPointMotion(samplePoint, 1000, false);
  const motionB = getClusteredPointMotion(samplePoint, 2400, false);

  assert.equal(CLUSTERED_POINT_RADIUS_SCALE, 1.12);
  assert.ok(Math.abs(motionA.driftX) > 0.01 || Math.abs(motionA.driftY) > 0.01);
  assert.notEqual(motionA.radiusScale, motionB.radiusScale);
  assert.ok(motionA.radiusScale > 1.07);
  assert.ok(motionA.radiusScale < 1.18);
  assert.ok(motionA.alphaScale > 0.92);
  assert.ok(motionA.alphaScale < 1.09);
});

test("clustered point motion is static for reduced motion users", () => {
  assert.deepEqual(getClusteredPointMotion(samplePoint, 1000, true), {
    driftX: 0,
    driftY: 0,
    radiusScale: CLUSTERED_POINT_RADIUS_SCALE,
    alphaScale: 1,
  });
});
