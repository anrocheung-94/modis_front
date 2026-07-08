import { APP_META, HOME_SCENE, PRIMARY_CLUSTERS, TOP_PRIMARY_IDS, VIEWBOX, getPrimaryClusterById } from "../data/atlasData.js";
import { HOME_DEEP_SPACE_SLOT_CENTER, getHomeDeepSpaceSlots } from "../data/homeDeepSpaceLayout.js";

export const CORPUS_TOTAL_SAMPLES = 230000;
export const SCATTER_POINT_BUDGET = APP_META.pointBudget;
export const PRIMARY_CLUSTER_COUNT = PRIMARY_CLUSTERS.length;
const POINT_RADIUS_SCALE_MIN = 1.3;
const POINT_RADIUS_SCALE_MAX = 1.5;
const HOME_BRIGHT_STAR_ANCHORS = [
  { x: 0.18, y: 0.12, radius: 1.38, alpha: 0.82, halo: 0.4, flare: 0.78, toneBias: 0.18, depth: 0.98 },
  { x: 0.25, y: 0.22, radius: 1.08, alpha: 0.7, halo: 0.3, flare: 0.45, toneBias: 0.2, depth: 0.92 },
  { x: 0.4, y: 0.43, radius: 1.0, alpha: 0.68, halo: 0.28, flare: 0.32, toneBias: 0.72, depth: 0.9 },
  { x: 0.52, y: 0.42, radius: 1.24, alpha: 0.74, halo: 0.34, flare: 0.48, toneBias: 0.78, depth: 0.95 },
  { x: 0.72, y: 0.25, radius: 1.72, alpha: 0.88, halo: 0.48, flare: 0.84, toneBias: 0.34, depth: 1 },
  { x: 0.84, y: 0.14, radius: 1.08, alpha: 0.72, halo: 0.28, flare: 0.42, toneBias: 0.22, depth: 0.93 },
  { x: 0.86, y: 0.7, radius: 1.8, alpha: 0.9, halo: 0.52, flare: 0.86, toneBias: 0.16, depth: 1 },
  { x: 0.95, y: 0.67, radius: 1.2, alpha: 0.76, halo: 0.35, flare: 0.54, toneBias: 0.82, depth: 0.94 },
  { x: 0.6, y: 0.86, radius: 1.18, alpha: 0.72, halo: 0.32, flare: 0.5, toneBias: 0.78, depth: 0.94 },
  { x: 0.43, y: 0.58, radius: 1.0, alpha: 0.62, halo: 0.24, flare: 0.28, toneBias: 0.38, depth: 0.88 },
  { x: 0.76, y: 0.48, radius: 1.08, alpha: 0.7, halo: 0.28, flare: 0.36, toneBias: 0.78, depth: 0.92 },
  { x: 0.08, y: 0.71, radius: 1.04, alpha: 0.64, halo: 0.24, flare: 0.3, toneBias: 0.3, depth: 0.88 },
];

export function buildSemanticUniverse() {
  const points = [];
  const coreLayouts = new Map(PRIMARY_CLUSTERS.map((cluster) => [cluster.id, createSemanticCoreLayout(cluster)]));

  PRIMARY_CLUSTERS.forEach((cluster) => {
    const random = mulberry32(hashString(`cluster-${cluster.id}`));
    const count = Math.round((cluster.sampleSize / CORPUS_TOTAL_SAMPLES) * SCATTER_POINT_BUDGET);
    const assignments = buildClusterPointAssignments(count, coreLayouts.get(cluster.id).length, random);
    assignments.forEach((assignment, index) => {
      points.push(createSemanticPoint(cluster, assignment, random, false, points.length, coreLayouts.get(cluster.id)));
    });
  });

  const residualRandom = mulberry32(hashString("residual-gray-corpus"));
  const residualWeights = buildResidualClusterWeights();
  while (points.length < SCATTER_POINT_BUDGET) {
    const cluster = pickWeightedCluster(residualRandom, residualWeights);
    const assignment = chooseResidualAssignment(coreLayouts.get(cluster.id).length, residualRandom);
    points.push(createSemanticPoint(cluster, assignment, residualRandom, true, points.length, coreLayouts.get(cluster.id)));
  }

  applyHomeReferenceLayout(points);

  return {
    points,
    ambientStars: buildAmbientStars(),
  };
}

export function buildGalaxyMetrics(points) {
  return PRIMARY_CLUSTERS.map((cluster) => {
    const clusterPoints = points.filter((point) => point.clusterId === cluster.id);
    const count = clusterPoints.length;
    const sum = clusterPoints.reduce(
      (acc, point) => {
        acc.x += point.clusteredX;
        acc.y += point.clusteredY;
        acc.freeX += point.freeX;
        acc.freeY += point.freeY;
        return acc;
      },
      { x: 0, y: 0, freeX: 0, freeY: 0 },
    );

    const centroid = {
      x: sum.x / count,
      y: sum.y / count,
    };

    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let maxDistance = 0;

    clusterPoints.forEach((point) => {
      minX = Math.min(minX, point.clusteredX);
      minY = Math.min(minY, point.clusteredY);
      maxX = Math.max(maxX, point.clusteredX);
      maxY = Math.max(maxY, point.clusteredY);
      maxDistance = Math.max(maxDistance, distance(point.clusteredX, point.clusteredY, centroid.x, centroid.y));
    });

    return {
      clusterId: cluster.id,
      color: cluster.color,
      labelZh: cluster.labelZh,
      labelEn: cluster.labelEn,
      shortLabel: cluster.shortLabel,
      summary: cluster.summary,
      topFive: cluster.topFive,
      sampleSize: cluster.sampleSize,
      count,
      centroid,
      freeCentroid: {
        x: sum.freeX / count,
        y: sum.freeY / count,
      },
      bounds: {
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX,
        height: maxY - minY,
      },
      hitRadius: Math.max(26, maxDistance * 0.92),
      labelAnchor: {
        x: cluster.hierarchy.labelX,
        y: cluster.hierarchy.labelY,
      },
      lobes: cluster.hierarchy.lobes,
      hierarchy: cluster.hierarchy,
    };
  }).sort((left, right) => right.count - left.count);
}

function createSemanticPoint(cluster, assignment, random, isResidualGray, index, coreLayout) {
  const semantic = compactSemanticPosition(createSemanticPosition(cluster, assignment, random, coreLayout), cluster, assignment, index);
  const year = clamp(
    Math.round(cluster.timeCenter * 24 + 2001 + gaussian(random) * cluster.timeSpread * 9),
    2001,
    2025,
  );
  const intensity = random();
  const radiusScale = lerp(POINT_RADIUS_SCALE_MIN, POINT_RADIUS_SCALE_MAX, intensity);
  const baseRadius = cluster.topFive ? 0.82 + random() * 1.34 : 0.62 + random() * 0.92;
  const dynamicThreshold =
    assignment.role === "core"
      ? 0.84
      : assignment.role === "tail"
        ? 0.74
        : assignment.role === "fringe"
          ? 0.68
          : assignment.role === "bridge"
            ? 0.62
            : 0.56;

  return {
    clusterId: cluster.id,
    role: assignment.role,
    coreIndex: assignment.coreIndex ?? null,
    isResidualGray,
    year,
    radius: baseRadius * radiusScale,
    intensity,
    isDynamic: random() > dynamicThreshold + (isResidualGray ? 0.06 : 0),
    clusteredX: semantic.x,
    clusteredY: semantic.y,
    freeX: semantic.x,
    freeY: semantic.y,
    phase: random() * Math.PI * 2,
    drift: 0.72 + random() * 1.4,
    driftRadius: getSemanticDriftRadius(assignment.role, random),
    driftAxisX: 0.72 + random() * 0.86,
    driftAxisY: 0.68 + random() * 0.92,
    pulsePhase: random() * Math.PI * 2,
    pulseSpeed: 0.0008 + random() * 0.0014,
    pulseStrength: 0.16 + random() * 0.88,
    twinkleOffset: random(),
    pointIndex: index,
  };
}

function compactSemanticPosition(point, cluster, assignment, index) {
  const centerX = VIEWBOX.width * 0.5;
  const centerY = VIEWBOX.height * 0.5;
  const dx = point.x - centerX;
  const dy = point.y - centerY;
  const angle = Math.atan2(dy, dx);
  const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
  const seeded = mulberry32(hashString(`compact-${cluster.id}-${assignment.role}-${assignment.coreIndex ?? 0}-${index}`));
  const radialScale =
    lerp(0.76, 0.82, seeded()) *
    (1 + Math.sin(angle * 3.2 + cluster.id * 0.71) * 0.045 + Math.cos(angle * 5.1 + cluster.id) * 0.026);
  const edgeFactor = clamp(distanceToCenter / 430, 0, 1) ** 1.2;
  const rippleX = Math.cos(angle * 2.4 + cluster.id * 0.83) * 16 * edgeFactor + (seeded() - 0.5) * 10 * edgeFactor;
  const rippleY = Math.sin(angle * 2.8 + cluster.id * 0.61) * 13 * edgeFactor + (seeded() - 0.5) * 8 * edgeFactor;

  return {
    x: softClamp(centerX + dx * radialScale * 0.99 + rippleX, 54, VIEWBOX.width - 54),
    y: softClamp(centerY + dy * radialScale * 1.01 + rippleY, 48, VIEWBOX.height - 48),
  };
}

function getSemanticDriftRadius(role, random) {
  if (role === "core") {
    return 0.72 + random() * 1.65;
  }
  if (role === "tail") {
    return 1.08 + random() * 2.6;
  }
  if (role === "bridge") {
    return 1.32 + random() * 3.1;
  }
  if (role === "outlier") {
    return 1.72 + random() * 3.8;
  }
  return 1.14 + random() * 2.8;
}

function createSemanticCoreLayout(cluster) {
  const random = mulberry32(hashString(`semantic-cores-${cluster.id}`));
  const coreCount = pickSemanticCoreCount(cluster, random);
  const lobes = [...cluster.hierarchy.lobes].sort((left, right) => right.weight - left.weight);
  const baseAngle = Math.atan2(cluster.hierarchy.y - VIEWBOX.height / 2, cluster.hierarchy.x - VIEWBOX.width / 2);

  return Array.from({ length: coreCount }, (_, index) => {
    const lobe = lobes[index % lobes.length] ?? { x: 0, y: 0, spreadX: 22, spreadY: 18 };
    const side = index - (coreCount - 1) / 2;
    const bridgeTarget = getPrimaryClusterById(cluster.bridgeTargets?.[index % (cluster.bridgeTargets?.length || 1)] ?? cluster.id);
    const lobeAngle = lobe.x || lobe.y ? Math.atan2(lobe.y, lobe.x) : baseAngle + side * 0.78;
    const bridgeAngle = Math.atan2(bridgeTarget.hierarchy.y - cluster.hierarchy.y, bridgeTarget.hierarchy.x - cluster.hierarchy.x);
    const angle = (index % 2 === 0 ? lobeAngle : bridgeAngle) + side * (0.26 + random() * 0.2) + gaussian(random) * 0.22;
    const radialDistance = coreCount === 1 ? 0 : cluster.topFive ? 58 + random() * 44 : 32 + random() * 26;
    const spreadScale = cluster.topFive ? (coreCount === 1 ? 0.6 : 0.56) : 0.78;

    return {
      x: softClamp(
        cluster.hierarchy.x + lobe.x * (coreCount === 1 ? 0.38 : 0.9) + Math.cos(angle) * radialDistance + gaussian(random) * 10,
        34,
        VIEWBOX.width - 34,
      ),
      y: softClamp(
        cluster.hierarchy.y + lobe.y * (coreCount === 1 ? 0.38 : 0.9) + Math.sin(angle) * radialDistance * 0.86 + gaussian(random) * 9,
        32,
        VIEWBOX.height - 32,
      ),
      angle,
      spreadX: Math.max(10, lobe.spreadX * spreadScale),
      spreadY: Math.max(9, lobe.spreadY * spreadScale),
    };
  });
}

function pickSemanticCoreCount(cluster, random) {
  const roll = random();
  if (cluster.topFive) {
    return roll < 0.28 ? 1 : roll < 0.68 ? 2 : 3;
  }
  return roll < 0.56 ? 1 : roll < 0.84 ? 2 : 3;
}

function buildClusterPointAssignments(count, coreCount, random) {
  const assignments = [];
  const coreShare = coreCount === 1 ? 0.44 + random() * 0.12 : 0.5 + random() * 0.16;
  const coreTotalLimit = Math.floor(count * (coreCount === 1 ? 0.6 : 0.7));
  const coreEachLimit = Math.floor(count * (coreCount === 1 ? 0.6 : 0.4));
  const coreCounts = distributeCappedCount(Math.min(Math.round(count * coreShare), coreTotalLimit), coreCount, coreEachLimit, random);

  coreCounts.forEach((coreCountForAnchor, coreIndex) => {
    for (let index = 0; index < coreCountForAnchor; index += 1) {
      assignments.push({ role: "core", coreIndex });
    }
  });

  const remaining = Math.max(0, count - assignments.length);
  const tailCount = Math.round(remaining * (0.34 + random() * 0.1));
  const bridgeCount = Math.round(remaining * (0.24 + random() * 0.08));
  const outlierCount = Math.round(remaining * (0.12 + random() * 0.06));
  const fringeCount = Math.max(0, remaining - tailCount - bridgeCount - outlierCount);
  pushAssignments(assignments, "tail", tailCount, coreCount, random);
  pushAssignments(assignments, "bridge", bridgeCount, coreCount, random);
  pushAssignments(assignments, "fringe", fringeCount, coreCount, random);
  pushAssignments(assignments, "outlier", Math.max(0, count - assignments.length), coreCount, random);

  return shuffleAssignments(assignments, random);
}

function distributeCappedCount(total, bucketCount, maxEach, random) {
  const weights = Array.from({ length: bucketCount }, () => 0.72 + random() * 0.56);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const counts = weights.map((weight) => Math.min(maxEach, Math.floor((total * weight) / weightTotal)));
  let assigned = counts.reduce((sum, count) => sum + count, 0);
  let cursor = 0;

  while (assigned < total && cursor < total + bucketCount * 4) {
    const index = cursor % bucketCount;
    if (counts[index] < maxEach) {
      counts[index] += 1;
      assigned += 1;
    }
    cursor += 1;
  }

  return counts;
}

function pushAssignments(assignments, role, count, coreCount, random) {
  for (let index = 0; index < count; index += 1) {
    assignments.push({ role, coreIndex: Math.floor(random() * coreCount) });
  }
}

function shuffleAssignments(assignments, random) {
  for (let index = assignments.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [assignments[index], assignments[swapIndex]] = [assignments[swapIndex], assignments[index]];
  }
  return assignments;
}

function chooseResidualAssignment(coreCount, random) {
  const roll = random();
  if (roll < 0.18) {
    return { role: "tail", coreIndex: Math.floor(random() * coreCount) };
  }
  if (roll < 0.48) {
    return { role: "bridge", coreIndex: Math.floor(random() * coreCount) };
  }
  if (roll < 0.82) {
    return { role: "fringe", coreIndex: Math.floor(random() * coreCount) };
  }
  return { role: "outlier", coreIndex: Math.floor(random() * coreCount) };
}

function buildResidualClusterWeights() {
  let cumulative = 0;
  return PRIMARY_CLUSTERS.map((cluster) => {
    cumulative += Math.sqrt(cluster.sampleSize);
    return { cluster, cumulative };
  });
}

function pickWeightedCluster(random, weightedClusters) {
  const roll = random() * weightedClusters[weightedClusters.length - 1].cumulative;
  return weightedClusters.find((item) => roll <= item.cumulative)?.cluster ?? PRIMARY_CLUSTERS[0];
}

function createSemanticPosition(cluster, assignment, random, coreLayout) {
  const core = coreLayout[assignment.coreIndex % coreLayout.length] ?? coreLayout[0];
  const role = assignment.role;

  if (role === "core") {
    const tangent = core.angle + Math.PI / 2;
    return {
      x: softClamp(
        core.x + gaussian(random) * core.spreadX * 1.08 + Math.cos(tangent) * gaussian(random) * core.spreadX * 0.32,
        30,
        VIEWBOX.width - 30,
      ),
      y: softClamp(
        core.y + gaussian(random) * core.spreadY * 1.08 + Math.sin(tangent) * gaussian(random) * core.spreadY * 0.28,
        28,
        VIEWBOX.height - 28,
      ),
    };
  }

  if (role === "tail") {
    const target = random() < 0.56 ? getBridgeTargetCluster(cluster, random) : null;
    const angle = target
      ? Math.atan2(target.hierarchy.y - core.y, target.hierarchy.x - core.x) + gaussian(random) * 0.5
      : core.angle + gaussian(random) * 0.9 + (random() > 0.5 ? 1 : -1) * (0.18 + random() * 0.58);
    const radialDistance = 34 + random() * (cluster.topFive ? 190 : 118);
    const bend = gaussian(random) * (cluster.topFive ? 78 : 36);
    return {
      x: softClamp(core.x + Math.cos(angle) * radialDistance + Math.cos(angle + Math.PI / 2) * bend, 24, VIEWBOX.width - 24),
      y: softClamp(core.y + Math.sin(angle) * radialDistance * 0.82 + Math.sin(angle + Math.PI / 2) * bend, 24, VIEWBOX.height - 24),
    };
  }

  if (role === "bridge") {
    const target = getBridgeTargetCluster(cluster, random);
    const weight = 0.16 + random() * 0.62;
    const angle = Math.atan2(target.hierarchy.y - cluster.hierarchy.y, target.hierarchy.x - cluster.hierarchy.x);
    const jitter = gaussian(random) * (cluster.topFive ? 88 : 42);
    const along = gaussian(random) * (cluster.topFive ? 34 : 18);
    return {
      x: softClamp(
        lerp(cluster.hierarchy.x, target.hierarchy.x, weight) + Math.cos(angle) * along + Math.cos(angle + Math.PI / 2) * jitter,
        28,
        VIEWBOX.width - 28,
      ),
      y: softClamp(
        lerp(cluster.hierarchy.y, target.hierarchy.y, weight) + Math.sin(angle) * along + Math.sin(angle + Math.PI / 2) * jitter,
        26,
        VIEWBOX.height - 26,
      ),
    };
  }

  if (role === "outlier") {
    const modeRoll = random();
    if (modeRoll < 0.22) {
      const anchor = getOutlierIslandAnchor(cluster, random);
      return {
        x: softClamp(anchor.x + gaussian(random) * (cluster.topFive ? 40 : 24), 22, VIEWBOX.width - 22),
        y: softClamp(anchor.y + gaussian(random) * (cluster.topFive ? 34 : 20), 20, VIEWBOX.height - 20),
      };
    }

    if (modeRoll < 0.48) {
      const satelliteAngle = random() * Math.PI * 2;
      const satelliteDistance = cluster.topFive ? 150 + random() * 250 : 104 + random() * 160;
      return {
        x: softClamp(core.x + Math.cos(satelliteAngle) * satelliteDistance, 22, VIEWBOX.width - 22),
        y: softClamp(core.y + Math.sin(satelliteAngle) * satelliteDistance * (0.68 + random() * 0.38), 20, VIEWBOX.height - 20),
      };
    }

    if (modeRoll < 0.82) {
      const target = getBridgeTargetCluster(cluster, random);
      const angle = Math.atan2(target.hierarchy.y - cluster.hierarchy.y, target.hierarchy.x - cluster.hierarchy.x);
      const weight = 0.38 + random() * 0.48;
      const edgeJitter = gaussian(random) * (cluster.topFive ? 126 : 68);
      return {
        x: softClamp(
          lerp(cluster.hierarchy.x, target.hierarchy.x, weight) + Math.cos(angle + Math.PI / 2) * edgeJitter,
          22,
          VIEWBOX.width - 22,
        ),
        y: softClamp(
          lerp(cluster.hierarchy.y, target.hierarchy.y, weight) + Math.sin(angle + Math.PI / 2) * edgeJitter * 0.8,
          20,
          VIEWBOX.height - 20,
        ),
      };
    }

    const baseAngle = Math.atan2(cluster.hierarchy.y - VIEWBOX.height / 2, cluster.hierarchy.x - VIEWBOX.width / 2);
    const angle = baseAngle + gaussian(random) * 2.4 + (random() > 0.5 ? 1 : -1) * (0.72 + random() * 1.8);
    const radialDistance = 130 + random() * (cluster.topFive ? 310 : 190);
    return {
      x: softClamp(cluster.hierarchy.x + Math.cos(angle) * radialDistance * (0.84 + random() * 0.62), 22, VIEWBOX.width - 22),
      y: softClamp(cluster.hierarchy.y + Math.sin(angle) * radialDistance * (0.62 + random() * 0.5), 20, VIEWBOX.height - 20),
    };
  }

  const lobe = pickLobe(random, cluster.hierarchy.lobes);
  const tangent = Math.atan2(lobe.y || 1, lobe.x || 1) + Math.PI / 2;
  const spread = cluster.topFive ? 1.72 + random() * 0.68 : 1.34 + random() * 0.44;
  const shear = gaussian(random) * (cluster.topFive ? 88 : 34);
  return {
    x: softClamp(
      cluster.hierarchy.x + lobe.x * 0.78 + gaussian(random) * lobe.spreadX * spread + Math.cos(tangent) * shear,
      28,
      VIEWBOX.width - 28,
    ),
    y: softClamp(
      cluster.hierarchy.y + lobe.y * 0.78 + gaussian(random) * lobe.spreadY * spread + Math.sin(tangent) * shear * 0.74,
      26,
      VIEWBOX.height - 26,
    ),
  };
}

function getBridgeTargetCluster(cluster, random) {
  const targets = cluster.bridgeTargets?.length ? cluster.bridgeTargets : TOP_PRIMARY_IDS;
  return getPrimaryClusterById(targets[Math.floor(random() * targets.length)]);
}

function getOutlierIslandAnchor(cluster, random) {
  const islandRandom = mulberry32(hashString(`semantic-outlier-islands-${cluster.id}`));
  const anchors = Array.from({ length: cluster.topFive ? 4 : 3 }, (_, index) => {
    const targetId = cluster.bridgeTargets?.[index % (cluster.bridgeTargets?.length || 1)];
    const target = targetId ? getPrimaryClusterById(targetId) : null;
    const targetAngle = target
      ? Math.atan2(target.hierarchy.y - cluster.hierarchy.y, target.hierarchy.x - cluster.hierarchy.x)
      : (index / 3) * Math.PI * 2;
    const angle = targetAngle + gaussian(islandRandom) * 0.72 + (index % 2 === 0 ? 1 : -1) * (0.54 + islandRandom() * 1.1);
    const radialDistance = cluster.topFive ? 260 + islandRandom() * 290 : 170 + islandRandom() * 190;
    return {
      x: softClamp(cluster.hierarchy.x + Math.cos(angle) * radialDistance, 24, VIEWBOX.width - 24),
      y: softClamp(cluster.hierarchy.y + Math.sin(angle) * radialDistance * (0.68 + islandRandom() * 0.38), 22, VIEWBOX.height - 22),
    };
  });

  return anchors[Math.floor(random() * anchors.length)] ?? anchors[0];
}

function buildAmbientStars() {
  const random = mulberry32(hashString("ambient-stars"));
  return Array.from({ length: 2360 }, (_, index) => {
    const anchor = HOME_BRIGHT_STAR_ANCHORS[index];
    if (anchor) {
      return {
        id: index,
        x: anchor.x * VIEWBOX.width,
        y: anchor.y * VIEWBOX.height,
        radius: anchor.radius,
        alpha: anchor.alpha,
        depth: anchor.depth,
        phase: random() * Math.PI * 2,
        halo: anchor.halo,
        flare: anchor.flare,
        toneBias: anchor.toneBias,
      };
    }

    const bright = random() > 0.918;
    const flare = bright && random() > 0.84 ? 0.28 + random() * 0.56 : 0;
    const radius = bright
      ? 0.24 + random() * 1.32
      : 0.16 + random() * (random() > 0.92 ? 0.9 : 0.72);
    const alpha = bright ? 0.22 + random() * 0.54 : 0.1 + random() * 0.56;

    return {
      id: index,
      x: 8 + random() * (VIEWBOX.width - 16),
      y: 8 + random() * (VIEWBOX.height - 16),
      radius,
      alpha,
      depth: 0.28 + random() * 0.72,
      phase: random() * Math.PI * 2,
      halo: bright ? 0.1 + random() * 0.34 : 0,
      flare,
      toneBias: random(),
    };
  });
}

function pickLobe(random, lobes) {
  const total = lobes.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * total;
  for (const lobe of lobes) {
    roll -= lobe.weight;
    if (roll <= 0) {
      return lobe;
    }
  }
  return lobes[lobes.length - 1];
}

function rotatePoint(x, y, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function softClamp(value, min, max) {
  if (value < min) {
    return min + Math.min(max - min, Math.sqrt(min - value) * 5.2);
  }
  if (value > max) {
    return max - Math.min(max - min, Math.sqrt(value - max) * 5.2);
  }
  return value;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

export function mulberry32(seed) {
  let value = seed >>> 0;
  return function random() {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function gaussian(random) {
  const u = Math.max(random(), Number.EPSILON);
  const v = Math.max(random(), Number.EPSILON);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function applyHomeReferenceLayout(points) {
  const slots = getHomeDeepSpaceSlots(points.length);
  const clusteredOrder = points
    .map((point, index) => ({
      point,
      index,
      angle: normalizeAngle(Math.atan2(point.clusteredY - VIEWBOX.height * 0.5, point.clusteredX - VIEWBOX.width * 0.5)),
      radius: distance(point.clusteredX, point.clusteredY, VIEWBOX.width * 0.5, VIEWBOX.height * 0.5),
    }))
    .sort(comparePolarRank);
  const slotOrder = slots
    .map((slot, index) => ({
      slot,
      index,
      angle: normalizeAngle(Math.atan2(slot.y - HOME_DEEP_SPACE_SLOT_CENTER.y, slot.x - HOME_DEEP_SPACE_SLOT_CENTER.x)),
      radius: distance(slot.x, slot.y, HOME_DEEP_SPACE_SLOT_CENTER.x, HOME_DEEP_SPACE_SLOT_CENTER.y),
    }))
    .sort(comparePolarRank);

  clusteredOrder.forEach((entry, index) => {
    const slot = slotOrder[index]?.slot ?? slotOrder[slotOrder.length - 1]?.slot;
    if (!slot) {
      return;
    }
    entry.point.freeX = slot.x;
    entry.point.freeY = slot.y;
    entry.point.homeColor = slot.homeColor;
    entry.point.homeCoreColor = slot.homeCoreColor;
    entry.point.homeHaloColor = slot.homeHaloColor;
    entry.point.homeAlpha = slot.homeAlpha;
    entry.point.homeRadiusScale = slot.homeRadiusScale;
    entry.point.homeGlowStrength = slot.homeGlowStrength;
    entry.point.homeSharpness = slot.homeSharpness;
    entry.point.homeSparkle = slot.homeSparkle;
  });
}

function comparePolarRank(left, right) {
  return left.angle - right.angle || left.radius - right.radius || left.index - right.index;
}

function normalizeAngle(value) {
  return (value + Math.PI * 2) % (Math.PI * 2);
}
