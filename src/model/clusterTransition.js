export const CLUSTERING_TRANSITION_SECONDS = 2;
export const CLUSTERED_POINT_RADIUS_SCALE = 1.12;

export function getClusterTransitionPosition(point, progress) {
  const t = clamp(progress, 0, 1);
  const startX = point.freeX;
  const startY = point.freeY;
  const endX = point.clusteredX;
  const endY = point.clusteredY;

  if (t === 0) {
    return { x: startX, y: startY };
  }

  if (t === 1) {
    return { x: endX, y: endY };
  }

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.hypot(dx, dy) || 1;
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const pointSeed = (point.pointIndex ?? 0) + (point.clusterId ?? 0) * 17;
  const direction = pointSeed % 2 === 0 ? 1 : -1;
  const orbitBias = 0.72 + Math.abs(Math.sin((pointSeed + 1) * 1.618)) * 0.42;
  const bendStrength = clamp(distance * 0.11, 18, 92) * orbitBias * direction;
  const bend = Math.sin(Math.PI * t) * bendStrength;

  return {
    x: startX + dx * t + normalX * bend,
    y: startY + dy * t + normalY * bend,
  };
}

export function getClusteredPointMotion(point, timestamp, reducedMotion) {
  if (reducedMotion) {
    return {
      driftX: 0,
      driftY: 0,
      radiusScale: CLUSTERED_POINT_RADIUS_SCALE,
      alphaScale: 1,
    };
  }

  const seed = (point.pointIndex ?? 0) * 0.71 + (point.clusterId ?? 0) * 1.37;
  const driftRadius = Math.min(2.4, Math.max(0.55, (point.driftRadius ?? 1) * 0.11));
  const driftX = Math.cos(timestamp * 0.00023 + seed) * driftRadius;
  const driftY = Math.sin(timestamp * 0.00019 + seed * 1.21) * driftRadius * 0.78;
  const breath = Math.sin(timestamp * 0.00115 + seed * 0.83);

  return {
    driftX,
    driftY,
    radiusScale: CLUSTERED_POINT_RADIUS_SCALE + breath * 0.045,
    alphaScale: 1 + breath * 0.055,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
