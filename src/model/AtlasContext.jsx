import { createContext, useContext, useEffect, useReducer, useState } from "react";

import { useReducedMotion } from "../hooks/useReducedMotion.js";
import { APP_PHASES, atlasReducer, createInitialAtlasState } from "./appPhases.js";
import { buildGalaxyMetrics, buildSemanticUniverse } from "./semanticUniverse.js";

const AtlasContext = createContext(null);

export function AtlasProvider({ children }) {
  const reducedMotion = useReducedMotion();
  const [state, dispatch] = useReducer(atlasReducer, { reducedMotion }, createInitialAtlasState);
  const [universe] = useState(() => buildSemanticUniverse());
  const [galaxies] = useState(() => buildGalaxyMetrics(universe.points));

  useEffect(() => {
    dispatch({ type: "SET_REDUCED_MOTION", value: reducedMotion });
  }, [reducedMotion]);

  return (
    <AtlasContext.Provider
      value={{
        state,
        dispatch,
        universe,
        galaxies,
        reducedMotion,
        appPhases: APP_PHASES,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
}

export function useAtlas() {
  const value = useContext(AtlasContext);
  if (!value) {
    throw new Error("useAtlas must be used inside AtlasProvider.");
  }
  return value;
}
