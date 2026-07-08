import { useEffect, useRef } from "react";

import { COLOR_SYSTEM, HOME_SCENE, VIEWBOX } from "../data/atlasData.js";
import { sampleDeepSpaceHomeField as sampleHomeReferenceField } from "../data/homeDeepSpaceLayout.js";
import {
  HOME_REFERENCE_NEBULA_LAYERS,
  HOME_REFERENCE_PARTICLE_OVERLAY,
} from "../data/homeStarReference.js";
import {
  CLUSTERING_TRANSITION_SECONDS,
  getClusterTransitionPosition,
} from "../model/clusterTransition.js";

export function AtlasCanvas({
  ambientStars,
  clusterProgress,
  galaxies,
  hoveredClusterId,
  phase,
  points,
  reducedMotion,
  useLayeredHomeAssets = false,
  onHoverCluster,
  onSelectCluster,
}) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const hoveredRef = useRef(null);
  const clusterProgressRef = useRef(clusterProgress);

  useEffect(() => {
    clusterProgressRef.current = clusterProgress;
  }, [clusterProgress]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) {
      return undefined;
    }

    let frameId = 0;
    let transitionStartTime = null;
    let lastTransitionPaintTime = Number.NEGATIVE_INFINITY;
    const context = canvas.getContext("2d");
    const animate = !reducedMotion || phase === "clustering-transition";
    const preserveHomePointAppearance =
      phase === "clustering-transition" || phase === "clustered-home";

    const render = (timestamp = 0) => {
      const frameTime = timestamp || window.performance.now();
      if (
        phase === "clustering-transition" &&
        frameTime - lastTransitionPaintTime < 1000 / 30
      ) {
        frameId = window.requestAnimationFrame(render);
        return;
      }
      if (phase === "clustering-transition") {
        lastTransitionPaintTime = frameTime;
      }
      if (phase === "clustering-transition" && transitionStartTime === null) {
        transitionStartTime = frameTime;
      }
      const transitionProgress =
        phase === "clustering-transition"
          ? Math.max(
              0,
              Math.min(
                1,
                (frameTime - transitionStartTime) / (CLUSTERING_TRANSITION_SECONDS * 1000),
              ),
            )
          : clusterProgressRef.current;
      const reveal =
        phase === "clustered-home"
          ? 1
          : phase === "clustering-transition"
            ? easeInOut(transitionProgress)
            : 0;

      fitCanvas(canvas);
      const fit = fitViewBox(canvas.width, canvas.height, VIEWBOX.width, VIEWBOX.height);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.translate(fit.offsetX, fit.offsetY);
      context.scale(fit.scale, fit.scale);

      drawSceneBackdrop(context, useLayeredHomeAssets);
      const backgroundReveal = preserveHomePointAppearance ? 0 : reveal;

      drawAmbientStars(context, ambientStars, timestamp, backgroundReveal);
      if (!useLayeredHomeAssets) {
        drawHomeNebula(context, timestamp, backgroundReveal, reducedMotion);
        drawHomeParticleOverlay(context, timestamp, backgroundReveal, reducedMotion);
      }
      if (!preserveHomePointAppearance) {
        drawNebulaClouds(context, galaxies, reveal, hoveredClusterId);
        drawClusterPulse(context, phase, reveal);
      }
      drawSemanticPoints(
        context,
        points,
        galaxies,
        timestamp,
        reveal,
        hoveredClusterId,
        reducedMotion,
        preserveHomePointAppearance,
      );
      drawHomeAnchorFlares(context, ambientStars, timestamp, backgroundReveal, useLayeredHomeAssets);

      if (animate) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => window.cancelAnimationFrame(frameId);
  }, [ambientStars, galaxies, hoveredClusterId, phase, points, reducedMotion, useLayeredHomeAssets]);

  const handlePointerMove = (event) => {
    if (phase !== "clustered-home" || isMinimalClusterSurface(phase)) {
      if (hoveredRef.current !== null) {
        hoveredRef.current = null;
        onHoverCluster(null);
      }
      return;
    }

    const point = localPoint(event, canvasRef.current);
    if (!point) {
      return;
    }
    const fit = fitViewBox(canvasRef.current.width, canvasRef.current.height, VIEWBOX.width, VIEWBOX.height);
    const atlasPoint = {
      x: (point.x - fit.offsetX) / fit.scale,
      y: (point.y - fit.offsetY) / fit.scale,
    };
    const galaxy = resolveGalaxyHit(galaxies, atlasPoint.x, atlasPoint.y);
    const nextId = galaxy?.clusterId ?? null;
    if (hoveredRef.current !== nextId) {
      hoveredRef.current = nextId;
      onHoverCluster(nextId);
    }
  };

  const handlePointerLeave = () => {
    hoveredRef.current = null;
    onHoverCluster(null);
  };

  const handleClick = () => {
    if (phase !== "clustered-home" || isMinimalClusterSurface(phase) || hoveredRef.current == null) {
      return;
    }
    onSelectCluster(hoveredRef.current);
  };

  return (
    <div className="atlas-canvas" ref={hostRef}>
      <canvas
        ref={canvasRef}
        aria-label="MODIS semantic star atlas"
        onClick={handleClick}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      />
    </div>
  );
}

function isMinimalClusterSurface(phase) {
  return phase === "clustering-transition" || phase === "clustered-home";
}

function drawSceneBackdrop(context, useLayeredHomeAssets) {
  if (useLayeredHomeAssets) {
    return;
  }

  const background = context.createLinearGradient(0, 0, 0, VIEWBOX.height);
  background.addColorStop(0, "#020611");
  background.addColorStop(0.4, "#061121");
  background.addColorStop(0.78, "#030918");
  background.addColorStop(1, "#01040d");
  context.fillStyle = background;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);

  const leftBloom = context.createRadialGradient(220, 180, 0, 220, 180, 220);
  leftBloom.addColorStop(0, "rgba(40, 90, 160, 0.08)");
  leftBloom.addColorStop(0.58, "rgba(22, 60, 105, 0.025)");
  leftBloom.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = leftBloom;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);

  const rightBloom = context.createRadialGradient(720, 140, 0, 720, 140, 260);
  rightBloom.addColorStop(0, "rgba(48, 108, 168, 0.08)");
  rightBloom.addColorStop(0.56, "rgba(20, 58, 98, 0.024)");
  rightBloom.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = rightBloom;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);

  const coreGlow = context.createRadialGradient(548, 294, 0, 548, 294, 180);
  coreGlow.addColorStop(0, "rgba(235, 202, 148, 0.024)");
  coreGlow.addColorStop(0.38, "rgba(97, 138, 198, 0.016)");
  coreGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = coreGlow;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);

  const lowerMist = context.createRadialGradient(500, 620, 0, 500, 620, 320);
  lowerMist.addColorStop(0, "rgba(18, 49, 93, 0.11)");
  lowerMist.addColorStop(0.52, "rgba(9, 23, 48, 0.05)");
  lowerMist.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = lowerMist;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);

  context.save();
  context.globalCompositeOperation = "screen";
  const backdropLayers = [
    { x: 0.48, y: 0.18, rx: 0.024, ry: 0.26, rotation: -0.02, alpha: 0.016, color: "#dce8ff" },
    { x: 0.58, y: 0.22, rx: 0.032, ry: 0.22, rotation: 0.05, alpha: 0.014, color: "#b4daff" },
    { x: 0.56, y: 0.44, rx: 0.18, ry: 0.034, rotation: 0.33, alpha: 0.01, color: "#f2bd7b" },
  ];
  for (const layer of backdropLayers) {
    drawGradientEllipse(context, layer, layer.alpha, 0);
  }
  context.restore();

  const vignette = context.createRadialGradient(512, 320, 180, 512, 320, 760);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.68, "rgba(2, 5, 12, 0.16)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.42)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);
}

function drawAmbientStars(context, stars, timestamp, reveal) {
  const heroBlend = 1 - clamp(reveal / 0.22, 0, 1);
  context.save();
  context.globalCompositeOperation = "screen";
  for (const star of stars) {
    const twinkle = 0.74 + Math.sin(timestamp * 0.0008 * star.depth + star.phase) * 0.26;
    const baseAlpha = star.alpha * twinkle * (0.88 - reveal * 0.05);
    const field = heroBlend > 0.01 ? sampleHomeReferenceField(star.x, star.y) : null;
    const heroAlpha = field
      ? star.alpha *
        twinkle *
        clamp(0.28 + field.ambient * 0.72 + field.density * 0.24 + field.backlight * 0.06 - field.void * 0.08, 0.12, 0.96)
      : baseAlpha;
    const baseColor = star.depth > 0.8 ? "#f3f8ff" : star.depth > 0.56 ? "#9ec2e6" : "#7395c2";
    const heroColor = !field
      ? baseColor
      : field.warm > field.cool + 0.1
        ? star.toneBias > 0.48
          ? "#f2c98e"
          : "#ffe7c6"
        : field.cool > 0.46
          ? star.depth > 0.76
            ? "#deecff"
            : "#8dbcf0"
          : star.toneBias > 0.62
            ? "#f0d0a7"
            : "#edf4ff";
    const alpha = lerp(baseAlpha, heroAlpha * 1.08, heroBlend);
    const brightness = clamp(
      (field?.brightness ?? 0) * 0.58 + star.depth * 0.22 + star.radius * 0.14 + star.alpha * 0.18,
      0,
      1,
    );
    const fillStyle = mixHex(baseColor, heroColor, heroBlend * 0.92);

    if ((star.halo ?? 0) > 0.38 && brightness > 0.78) {
      const haloColor = field?.warm > (field?.cool ?? 0) + 0.08 ? "#f8d9a7" : field?.cool > 0.44 ? "#b8d7ff" : "#eef5ff";
      context.fillStyle = haloColor;
      context.globalAlpha = clamp(alpha * (0.012 + (star.halo ?? 0) * 0.032 + brightness * 0.012), 0, 0.055);
      context.beginPath();
      context.arc(star.x, star.y, star.radius * (0.72 + (star.halo ?? 0) * 0.32 + brightness * 0.08), 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = alpha;
    context.fillStyle = fillStyle;
    if (star.radius > 0.74) {
      context.beginPath();
      context.arc(star.x, star.y, star.radius * (heroBlend > 0.01 ? 0.9 : 0.96), 0, Math.PI * 2);
      context.fill();
    } else {
      const size = Math.max(0.42, star.radius * (heroBlend > 0.01 ? 1.02 : 1.08));
      context.fillRect(star.x - size * 0.5, star.y - size * 0.5, size, size);
    }

    if ((star.flare ?? 0) > 0.12 && (brightness > 0.82 || (star.flare ?? 0) > 0.7)) {
      const flareLength =
        (star.flare ?? 0) > 0.7
          ? star.radius * (4.2 + (star.flare ?? 0) * 4.8)
          : star.radius * (1.4 + (star.flare ?? 0) * 1.4);
      drawStarFlare(
        context,
        star.x,
        star.y,
        flareLength,
        clamp(alpha * (0.1 + (star.flare ?? 0) * 0.14), 0, 0.38),
        field?.warm > (field?.cool ?? 0) + 0.08 ? "#fff0cf" : "#eef7ff",
      );
    }
  }
  context.restore();
}

function drawHomeAnchorFlares(context, stars, timestamp, reveal, useLayeredHomeAssets) {
  const heroBlend = 1 - clamp(reveal / 0.22, 0, 1);
  if (!useLayeredHomeAssets || heroBlend <= 0.01) {
    return;
  }

  context.save();
  context.globalCompositeOperation = "screen";
  for (const star of stars) {
    if ((star.flare ?? 0) <= 0.7) {
      continue;
    }

    const twinkle = 0.74 + Math.sin(timestamp * 0.0008 * star.depth + star.phase) * 0.26;
    const alpha = clamp(star.alpha * twinkle * heroBlend * (0.26 + (star.flare ?? 0) * 0.2), 0, 0.44);
    const length = star.radius * (7 + (star.flare ?? 0) * 6);

    context.fillStyle = star.toneBias > 0.68 ? "#fff2d8" : "#f5fbff";
    context.globalAlpha = alpha;
    context.beginPath();
    context.arc(star.x, star.y, Math.max(0.9, star.radius * 1.1), 0, Math.PI * 2);
    context.fill();
    drawStarFlare(context, star.x, star.y, length, alpha, star.toneBias > 0.68 ? "#fff0ce" : "#eef7ff");
  }
  context.restore();
}

function drawHomeNebula(context, timestamp, reveal, reducedMotion) {
  const fade = 1 - reveal * 0.9;
  if (fade <= 0.02) {
    return;
  }

  const drift = reducedMotion ? 0 : Math.sin(timestamp * 0.00014) * 4;

  context.save();
  context.globalCompositeOperation = "screen";
  for (const glow of HOME_REFERENCE_NEBULA_LAYERS.backlights) {
    drawGradientEllipse(context, glow, fade * glow.alpha, drift * 0.04);
  }
  for (const volume of HOME_REFERENCE_NEBULA_LAYERS.volumetrics) {
    drawGradientEllipse(context, volume, fade * volume.alpha, drift * 0.03);
  }
  for (const plume of HOME_REFERENCE_NEBULA_LAYERS.coolPlumes) {
    drawGradientEllipse(context, plume, fade * plume.alpha, drift * 0.14);
  }
  for (const band of HOME_REFERENCE_NEBULA_LAYERS.milkyBands) {
    drawGradientEllipse(context, band, fade * band.alpha, drift * 0.08);
  }
  for (const haze of HOME_REFERENCE_NEBULA_LAYERS.haze) {
    drawGradientEllipse(context, haze, fade * haze.alpha, drift * 0.06);
  }
  for (const dust of HOME_REFERENCE_NEBULA_LAYERS.dustVeils) {
    drawGradientEllipse(context, dust, fade * dust.alpha, -drift * 0.07);
  }
  for (const core of HOME_REFERENCE_NEBULA_LAYERS.warmCores) {
    drawGradientEllipse(context, core, fade * core.alpha, -drift * 0.05);
  }

  context.restore();
}

function drawHomeParticleOverlay(context, timestamp, reveal, reducedMotion) {
  const fade = 1 - reveal * 0.92;
  if (fade <= 0.02) {
    return;
  }

  const drift = reducedMotion ? 0 : Math.sin(timestamp * 0.00009) * 2.2;

  context.save();
  context.globalCompositeOperation = "screen";

  for (const particle of HOME_REFERENCE_PARTICLE_OVERLAY) {
    const x = particle.x * VIEWBOX.width + drift * particle.driftX;
    const y = particle.y * VIEWBOX.height + drift * particle.driftY;
    const alpha = fade * particle.alpha * (particle.twinkle + Math.sin(timestamp * 0.00054 + particle.phase) * 0.08);

    if (particle.halo > 0.02) {
      context.fillStyle = particle.color;
      context.globalAlpha = alpha * (0.12 + particle.halo * 0.3);
      context.beginPath();
      context.arc(x, y, particle.radius * (1.2 + particle.halo * 1.6), 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = particle.color;
    context.globalAlpha = alpha;
    if (particle.radius <= 0.72) {
      const size = Math.max(0.34, particle.radius * 1.06);
      context.fillRect(x - size * 0.5, y - size * 0.5, size, size);
      continue;
    }

    context.beginPath();
    context.arc(x, y, particle.radius, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawNebulaClouds(context, galaxies, reveal, hoveredClusterId) {
  if (reveal <= 0.02) {
    return;
  }

  context.save();
  context.globalCompositeOperation = "screen";
  for (const galaxy of galaxies) {
    const hoverBoost = hoveredClusterId === galaxy.clusterId ? 0.18 : 0;
    for (const lobe of galaxy.lobes) {
      const gradient = context.createRadialGradient(
        galaxy.hierarchy.x + lobe.x,
        galaxy.hierarchy.y + lobe.y,
        0,
        galaxy.hierarchy.x + lobe.x,
        galaxy.hierarchy.y + lobe.y,
        Math.max(lobe.spreadX, lobe.spreadY) * 3.7,
      );
      gradient.addColorStop(0, hexToAlpha(galaxy.color, 0.16 * reveal + hoverBoost));
      gradient.addColorStop(0.44, hexToAlpha(galaxy.color, 0.06 * reveal + hoverBoost * 0.28));
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(
        galaxy.hierarchy.x + lobe.x,
        galaxy.hierarchy.y + lobe.y,
        lobe.spreadX * (2.5 + reveal * 0.38),
        lobe.spreadY * (2.2 + reveal * 0.42),
        0,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }
  context.restore();
}

function drawClusterPulse(context, phase, reveal) {
  if (phase !== "clustering-transition") {
    return;
  }

  const origin = HOME_SCENE.galaxyCloud.energyOrigin;
  const radius = 80 + reveal * 420;
  context.save();
  context.globalCompositeOperation = "screen";
  context.globalAlpha = 0.36 * (1 - reveal);
  context.strokeStyle = COLOR_SYSTEM.accentWarm;
  context.lineWidth = 3.4 - reveal * 1.2;
  context.beginPath();
  context.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
  context.stroke();

  const glow = context.createRadialGradient(origin.x, origin.y, 0, origin.x, origin.y, radius * 1.25);
  glow.addColorStop(0, "rgba(247, 196, 109, 0.12)");
  glow.addColorStop(0.36, `rgba(247, 196, 109, ${0.08 * (1 - reveal)})`);
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = glow;
  context.beginPath();
  context.arc(origin.x, origin.y, radius * 1.25, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawSemanticPoints(
  context,
  points,
  galaxies,
  timestamp,
  reveal,
  hoveredClusterId,
  reducedMotion,
  preserveHomePointAppearance,
) {
  const colors = new Map(galaxies.map((galaxy) => [galaxy.clusterId, galaxy.color]));
  const heroBlend = 1 - clamp(reveal / 0.2, 0, 1);
  const isClusterTransition = reveal > 0 && reveal < 1;
  const homeDetailBlend = preserveHomePointAppearance ? 1 : heroBlend;
  context.save();
  context.globalCompositeOperation = "screen";

  for (const point of points) {
    const clusterBaseColor = colors.get(point.clusterId) ?? "#8ea1b4";
    const clusterColor = point.isResidualGray && reveal > 0.92 ? "#8ea1b4" : clusterBaseColor;
    const transitionPosition = isClusterTransition
      ? getClusterTransitionPosition(point, reveal)
      : null;
    const x = transitionPosition?.x ?? lerp(point.freeX, point.clusteredX, reveal);
    const y = transitionPosition?.y ?? lerp(point.freeY, point.clusteredY, reveal);
    const driftScale = reducedMotion || preserveHomePointAppearance ? 0 : 0.3 + (1 - reveal) * 0.24;
    const driftX = point.isDynamic
      ? Math.cos(timestamp * 0.0007 * point.driftAxisX + point.phase) * point.driftRadius * driftScale
      : 0;
    const driftY = point.isDynamic
      ? Math.sin(timestamp * 0.0008 * point.driftAxisY + point.phase) * point.driftRadius * driftScale
      : 0;
    const pulse = reducedMotion || preserveHomePointAppearance
      ? 1
      : 0.8 + Math.sin(timestamp * point.pulseSpeed + point.pulsePhase) * point.pulseStrength * 0.07;
    const clusteredRadius = point.radius * pulse * (hoveredClusterId === point.clusterId ? 1.12 : 1);
    const homeRadius = point.radius * point.homeRadiusScale * pulse * 0.72;
    const radius = preserveHomePointAppearance ? homeRadius : lerp(clusteredRadius, homeRadius, heroBlend);
    const clusteredColor = mixHex("#f1d1a4", clusterColor, Math.min(1, reveal * 1.08));
    const clusteredAlpha = point.isResidualGray
      ? 0.18 + point.intensity * 0.24
      : 0.3 + point.intensity * 0.46 + (hoveredClusterId === point.clusterId ? 0.16 : 0);
    const fillStyle = preserveHomePointAppearance
      ? mixHex(point.homeColor ?? "#d9c19e", clusterColor, reveal)
      : mixHex(clusteredColor, point.homeColor ?? "#d9c19e", heroBlend * 0.92);
    const homeAlpha = clamp((point.homeAlpha ?? 0.2) * 1.08 + 0.035, 0, 0.96);
    const alpha = preserveHomePointAppearance ? homeAlpha : lerp(clusteredAlpha, homeAlpha, heroBlend);
    const homeGlowStrength = point.homeGlowStrength ?? 0;
    const homeSharpness = point.homeSharpness ?? 0.7;

    if (homeDetailBlend > 0.01 && homeGlowStrength > 0.44) {
      context.fillStyle = preserveHomePointAppearance
        ? mixHex(point.homeHaloColor ?? point.homeColor ?? "#d9c19e", clusterColor, reveal)
        : point.homeHaloColor ?? fillStyle;
      context.globalAlpha = alpha * (0.045 + homeGlowStrength * 0.105) * homeDetailBlend;
      context.beginPath();
      context.arc(x + driftX, y + driftY, radius * (0.92 + homeGlowStrength * 0.82), 0, Math.PI * 2);
      context.fill();
    }

    context.fillStyle = fillStyle;
    context.globalAlpha = alpha;
    if (radius <= 0.52) {
      const dotSize = homeDetailBlend > 0.01 ? Math.max(radius, 0.18) : Math.max(radius * 1.45, 0.64);
      const drawX = Math.round(x + driftX - dotSize * 0.5);
      const drawY = Math.round(y + driftY - dotSize * 0.5);
      context.fillRect(drawX, drawY, dotSize, dotSize);
    } else {
      context.beginPath();
      context.arc(x + driftX, y + driftY, radius, 0, Math.PI * 2);
      context.fill();
    }

    if (homeDetailBlend > 0.01) {
      const coreColor = preserveHomePointAppearance
        ? mixHex(point.homeCoreColor ?? point.homeColor ?? "#d9c19e", clusterColor, reveal)
        : point.homeCoreColor ?? mixHex(fillStyle, "#fff9ef", 0.22 + homeSharpness * 0.22);
      const coreRadius = Math.max(0.16, radius * (0.34 + homeSharpness * 0.12));
      context.fillStyle = coreColor;
      context.globalAlpha = clamp(alpha * (1.16 + homeSharpness * 0.42), 0, 1);
      context.beginPath();
      context.arc(x + driftX, y + driftY, coreRadius, 0, Math.PI * 2);
      context.fill();

      if ((point.homeSparkle ?? 0) > 0.76) {
        const sparkleAlpha = clamp(alpha * ((point.homeSparkle ?? 0) * 0.44), 0, 0.46);
        const sparkleLength = Math.max(0.46, radius * (0.46 + (point.homeSparkle ?? 0) * 0.2));
        context.fillStyle = preserveHomePointAppearance
          ? mixHex("#fffaf0", clusterColor, reveal * 0.64)
          : "#fffaf0";
        context.globalAlpha = sparkleAlpha;
        context.fillRect(x + driftX - sparkleLength, y + driftY - 0.25, sparkleLength * 2, 0.5);
        context.fillRect(x + driftX - 0.25, y + driftY - sparkleLength, 0.5, sparkleLength * 2);
      }
    }
  }

  context.restore();
}

function resolveGalaxyHit(galaxies, x, y) {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const galaxy of galaxies) {
    const centroidDistance = distance(x, y, galaxy.centroid.x, galaxy.centroid.y);
    if (centroidDistance <= galaxy.hitRadius && centroidDistance < bestDistance) {
      best = galaxy;
      bestDistance = centroidDistance;
      continue;
    }

    for (const lobe of galaxy.lobes) {
      const lobeX = galaxy.hierarchy.x + lobe.x;
      const lobeY = galaxy.hierarchy.y + lobe.y;
      const normalized =
        ((x - lobeX) / (lobe.spreadX * 2.1)) ** 2 +
        ((y - lobeY) / (lobe.spreadY * 2.2)) ** 2;
      if (normalized <= 1.08) {
        const lobeDistance = distance(x, y, lobeX, lobeY);
        if (lobeDistance < bestDistance) {
          best = galaxy;
          bestDistance = lobeDistance;
        }
      }
    }
  }

  return best;
}

function fitCanvas(canvas) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const targetWidth = Math.round(width * dpr);
  const targetHeight = Math.round(height * dpr);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }
}

function fitViewBox(width, height, viewWidth, viewHeight) {
  const scale = Math.max(width / viewWidth, height / viewHeight);
  return {
    scale,
    offsetX: (width - viewWidth * scale) * 0.5,
    offsetY: (height - viewHeight * scale) * 0.5,
  };
}

function localPoint(event, canvas) {
  const rect = canvas?.getBoundingClientRect();
  if (!rect) {
    return null;
  }
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}

function easeInOut(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - ((-2 * value + 2) ** 3) / 2;
}

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function mixHex(start, end, amount) {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  return `rgb(${Math.round(lerp(startRgb.r, endRgb.r, amount))}, ${Math.round(lerp(startRgb.g, endRgb.g, amount))}, ${Math.round(lerp(startRgb.b, endRgb.b, amount))})`;
}

function hexToRgb(value) {
  if (value.startsWith("rgb")) {
    const channels = value.match(/\d+/g)?.map((channel) => Number.parseInt(channel, 10)) ?? [0, 0, 0];
    return {
      r: channels[0] ?? 0,
      g: channels[1] ?? 0,
      b: channels[2] ?? 0,
    };
  }
  const hex = value.replace("#", "");
  const normalized = hex.length === 3 ? hex.split("").map((item) => item + item).join("") : hex;
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function hexToAlpha(value, alpha) {
  const { r, g, b } = hexToRgb(value);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawStarFlare(context, x, y, length, alpha, color = "#fffaf2") {
  context.save();
  context.fillStyle = color;
  context.globalAlpha = alpha;
  context.fillRect(x - length, y - 0.35, length * 2, 0.7);
  context.fillRect(x - 0.35, y - length, 0.7, length * 2);

  if (length > 2.2) {
    context.translate(x, y);
    context.rotate(Math.PI / 4);
    context.globalAlpha = alpha * 0.46;
    context.fillRect(-length * 0.58, -0.22, length * 1.16, 0.44);
    context.fillRect(-0.22, -length * 0.58, 0.44, length * 1.16);
  }

  context.restore();
}

function drawGradientEllipse(context, layer, alpha, drift) {
  const centerX = layer.x * VIEWBOX.width;
  const centerY = layer.y * VIEWBOX.height + drift;
  const radiusX = layer.rx * VIEWBOX.width;
  const radiusY = layer.ry * VIEWBOX.height;
  context.save();
  context.translate(centerX, centerY);
  context.rotate(layer.rotation ?? 0);
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, Math.max(radiusX, radiusY));
  gradient.addColorStop(0, hexToAlpha(layer.color, alpha));
  gradient.addColorStop(0.42, hexToAlpha(layer.color, alpha * 0.44));
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.beginPath();
  context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}
