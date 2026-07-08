import test from "node:test";
import assert from "node:assert/strict";

import {
  CLUSTERING_TRANSITION_SECONDS,
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
