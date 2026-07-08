import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { AtlasCanvas } from "../components/AtlasCanvas.jsx";
import { HomeSpaceLayers } from "../components/HomeSpaceLayers.jsx";
import { SpaceMotionLayer } from "../components/SpaceMotionLayer.jsx";
import { CLUSTER_ACTIONS, HOME_SCENE } from "../data/atlasData.js";
import { useAtlas } from "../model/AtlasContext.jsx";
import { CLUSTERING_TRANSITION_SECONDS } from "../model/clusterTransition.js";

export function AtlasRoute() {
  const rootRef = useRef(null);
  const mastheadRef = useRef(null);
  const clusterRef = useRef(null);
  const [clusterProgress, setClusterProgress] = useState(0);
  const {
    appPhases,
    dispatch,
    galaxies,
    reducedMotion,
    state,
    universe,
  } = useAtlas();

  const isMinimalHome = state.phase === appPhases.UNCLUSTERED_HOME;
  const isTransitioning = state.phase === appPhases.CLUSTERING_TRANSITION;
  const isClusteredHome = state.phase === appPhases.CLUSTERED_HOME;
  const isMinimalSurface =
    isMinimalHome || isTransitioning || isClusteredHome;

  useEffect(() => {
    if (state.phase === appPhases.UNCLUSTERED_HOME) {
      setClusterProgress(0);
      return undefined;
    }
    if (state.phase === appPhases.CLUSTERED_HOME) {
      setClusterProgress(1);
      return undefined;
    }
    if (state.phase !== appPhases.CLUSTERING_TRANSITION) {
      return undefined;
    }

    const durationMs = reducedMotion ? 0 : CLUSTERING_TRANSITION_SECONDS * 1000;
    if (durationMs === 0) {
      setClusterProgress(1);
      dispatch({ type: "CLUSTERING_COMPLETE" });
      return undefined;
    }

    setClusterProgress(0);
    const timeoutId = window.setTimeout(() => {
      setClusterProgress(1);
      dispatch({ type: "CLUSTERING_COMPLETE" });
    }, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [appPhases, dispatch, reducedMotion, state.phase]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isMinimalHome) {
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (reducedMotion) {
        return undefined;
      }

      const intro = gsap.timeline({
        defaults: {
          duration: 0.9,
          ease: "power3.out",
        },
      });

      if (mastheadRef.current) {
        intro.from(mastheadRef.current, { autoAlpha: 0, y: 18 }, 0);
      }
      if (clusterRef.current) {
        intro.from(clusterRef.current, { autoAlpha: 0, y: 20, scale: 0.98 }, 0.08);
      }

      return () => intro.kill();
    });

    return () => mm.revert();
  }, [isMinimalHome, reducedMotion]);

  const handleCluster = () => {
    if (state.phase !== appPhases.UNCLUSTERED_HOME) {
      return;
    }
    dispatch({ type: "START_CLUSTERING" });
  };

  return (
    <main
      ref={rootRef}
      className={[
        "atlas",
        `atlas--${state.phase}`,
        isMinimalHome ? "atlas--minimal-home" : "",
        isTransitioning ? "atlas--transitioning-home" : "",
        isMinimalSurface ? "atlas--minimal-surface" : "",
      ].filter(Boolean).join(" ")}
    >
      {isMinimalSurface ? <SpaceMotionLayer phase={state.phase} reducedMotion={reducedMotion} /> : null}
      {isMinimalSurface ? <HomeSpaceLayers stage="back" /> : null}

      <AtlasCanvas
        ambientStars={universe.ambientStars}
        clusterProgress={clusterProgress}
        galaxies={galaxies}
        hoveredClusterId={null}
        phase={state.phase}
        points={universe.points}
        reducedMotion={reducedMotion}
        useLayeredHomeAssets={isMinimalSurface}
        onHoverCluster={() => {}}
        onSelectCluster={() => {}}
      />

      {isMinimalSurface ? <HomeSpaceLayers stage="front" /> : null}

      <div className="atlas__sky-film" aria-hidden="true" />

      {isMinimalHome ? (
        <header
          ref={mastheadRef}
          className="atlas__home-hero"
          aria-label={HOME_SCENE.homeHero.ariaLabel}
        >
          <div className="atlas__home-title-stack">
            <h1 className={`atlas__home-title ${HOME_SCENE.homeHero.titleClassName}`}>
              {HOME_SCENE.homeHero.title}
            </h1>
          </div>
          <button
            ref={clusterRef}
            type="button"
            className="atlas__home-cta"
            aria-label={`${HOME_SCENE.homeHero.ctaZh} / ${HOME_SCENE.homeHero.ctaEn}`}
            onClick={handleCluster}
          >
            <img
              src={HOME_SCENE.homeHero.ctaAsset}
              alt=""
              aria-hidden="true"
              className="atlas__home-cta-image"
              draggable="false"
            />
            <span className="atlas__home-cta-text">{HOME_SCENE.homeHero.ctaZh}</span>
          </button>
        </header>
      ) : null}

      {isClusteredHome ? (
        <nav className="atlas__cluster-actions" aria-label="Primary MODIS analysis entrances">
          {CLUSTER_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="atlas__cluster-action"
              aria-label={action.label}
            >
              {action.label}
            </button>
          ))}
        </nav>
      ) : null}
    </main>
  );
}
