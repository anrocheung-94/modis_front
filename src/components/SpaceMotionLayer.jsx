import { useEffect, useMemo, useRef } from "react";

import { SPACE_MOTION_SCENES } from "../data/spaceMotion.js";

export function SpaceMotionLayer({ phase, reducedMotion }) {
  const videoRef = useRef(null);
  const scene = useMemo(() => {
    if (phase === "clustering-transition") {
      return SPACE_MOTION_SCENES.clusterTransition;
    }
    return SPACE_MOTION_SCENES.home;
  }, [phase]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) {
      return undefined;
    }

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }

    return undefined;
  }, [reducedMotion, scene.id]);

  return (
    <div
      className={[
        "atlas__space-motion",
        `atlas__space-motion--${scene.id}`,
        reducedMotion ? "atlas__space-motion--static" : "",
      ].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {reducedMotion ? (
        <img className="atlas__space-motion-poster" src={scene.poster} alt="" draggable="false" />
      ) : (
        <video
          key={scene.id}
          ref={videoRef}
          className="atlas__space-motion-video"
          muted
          loop={scene.loop}
          playsInline
          preload="auto"
          poster={scene.poster}
        >
          {scene.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}
      <div className="atlas__space-motion-vignette" />
    </div>
  );
}
