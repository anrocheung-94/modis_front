import test from "node:test";
import assert from "node:assert/strict";

import {
  APP_PHASES,
  createInitialAtlasState,
  atlasReducer,
} from "../src/model/appPhases.js";

test("atlas phase reducer follows the required phase order", () => {
  let state = createInitialAtlasState({ reducedMotion: false });
  assert.equal(state.phase, APP_PHASES.UNCLUSTERED_HOME);

  state = atlasReducer(state, { type: "START_CLUSTERING" });
  assert.equal(state.phase, APP_PHASES.CLUSTERING_TRANSITION);

  state = atlasReducer(state, { type: "CLUSTERING_COMPLETE" });
  assert.equal(state.phase, APP_PHASES.CLUSTERED_HOME);

  state = atlasReducer(state, { type: "HOVER_CLUSTER", clusterId: 5 });
  state = atlasReducer(state, { type: "ENTER_SECONDARY", clusterId: 5 });
  assert.equal(state.phase, APP_PHASES.SECONDARY_FOCUS);
  assert.equal(state.activeClusterId, 5);
  assert.equal(state.returnClusterId, 5);

  state = atlasReducer(state, { type: "EXIT_SECONDARY" });
  assert.equal(state.phase, APP_PHASES.CLUSTERED_HOME);
  assert.equal(state.hoveredClusterId, 5);
});

test("reduced motion skips cinematic transition states", () => {
  let state = createInitialAtlasState({ reducedMotion: true });
  assert.equal(state.phase, APP_PHASES.UNCLUSTERED_HOME);

  state = atlasReducer(state, { type: "START_CLUSTERING" });
  assert.equal(state.phase, APP_PHASES.CLUSTERED_HOME);
});

test("atlas phases no longer expose a prologue entry state", () => {
  assert.equal(APP_PHASES.PROLOGUE, undefined);
});
