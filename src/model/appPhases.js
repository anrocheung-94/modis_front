export const APP_PHASES = {
  UNCLUSTERED_HOME: "unclustered-home",
  CLUSTERING_TRANSITION: "clustering-transition",
  CLUSTERED_HOME: "clustered-home",
  SECONDARY_FOCUS: "secondary-focus",
};

export function createInitialAtlasState({ reducedMotion = false } = {}) {
  return {
    phase: APP_PHASES.UNCLUSTERED_HOME,
    reducedMotion,
    hoveredClusterId: null,
    activeClusterId: null,
    returnClusterId: null,
    focusedNodeId: null,
  };
}

export function atlasReducer(state, action) {
  switch (action.type) {
    case "SET_REDUCED_MOTION":
      return {
        ...state,
        reducedMotion: Boolean(action.value),
      };
    case "START_CLUSTERING":
      return {
        ...state,
        phase: state.reducedMotion ? APP_PHASES.CLUSTERED_HOME : APP_PHASES.CLUSTERING_TRANSITION,
      };
    case "CLUSTERING_COMPLETE":
      return {
        ...state,
        phase: APP_PHASES.CLUSTERED_HOME,
      };
    case "HOVER_CLUSTER":
      return {
        ...state,
        hoveredClusterId: action.clusterId ?? null,
      };
    case "ENTER_SECONDARY":
      return {
        ...state,
        phase: APP_PHASES.SECONDARY_FOCUS,
        activeClusterId: action.clusterId,
        hoveredClusterId: action.clusterId,
        returnClusterId: action.clusterId,
        focusedNodeId: null,
      };
    case "EXIT_SECONDARY":
      return {
        ...state,
        phase: APP_PHASES.CLUSTERED_HOME,
        activeClusterId: null,
        hoveredClusterId: state.returnClusterId,
        focusedNodeId: null,
      };
    case "FOCUS_NODE":
      return {
        ...state,
        focusedNodeId: action.nodeId ?? null,
      };
    default:
      return state;
  }
}
