import { HOME_SPACE_LAYERS } from "../data/homeSpaceLayers.js";

export function HomeSpaceLayers({ stage }) {
  const layers = HOME_SPACE_LAYERS.filter((layer) => layer.stage === stage);

  return (
    <div className={`atlas__home-space atlas__home-space--${stage}`} aria-hidden="true">
      {layers.map((layer) => (
        <img
          key={layer.id}
          alt=""
          className={`atlas__home-space-layer atlas__home-space-layer--${layer.kind}`}
          data-layer-id={layer.id}
          draggable="false"
          src={layer.src}
          style={{
            left: `${layer.x * 100}%`,
            top: `${layer.y * 100}%`,
            width: `${layer.width * 100}vw`,
            opacity: layer.opacity,
            mixBlendMode: layer.blendMode,
            objectFit: layer.fit,
            transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
            zIndex: layer.zIndex,
          }}
        />
      ))}
    </div>
  );
}
