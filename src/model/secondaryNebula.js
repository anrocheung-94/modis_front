import { getPrimaryClusterById, getSecondaryDetail } from "../data/atlasData.js";
import { hashString, mulberry32 } from "./semanticUniverse.js";

export function buildSecondaryNodes(clusterId) {
  const detail = getSecondaryDetail(clusterId);
  if (!detail?.subclusters?.length) {
    return [];
  }

  const random = mulberry32(hashString(`secondary-${clusterId}`));
  const baseRadius = 110;
  const orbitStep = Math.PI / Math.max(4, detail.subclusters.length);

  return detail.subclusters.map((subcluster, index) => {
    const angle = -Math.PI * 0.7 + orbitStep * index + random() * 0.28;
    const radius = baseRadius + (index % 3) * 46 + random() * 38;
    const size = 12 + Math.sqrt(subcluster.size) * 0.18;
    const cluster = getPrimaryClusterById(clusterId);
    return {
      id: `secondary-${clusterId}-${index + 1}`,
      title: subcluster.titleEn ?? subcluster.title,
      sampleSize: subcluster.size,
      x: 500 + Math.cos(angle) * radius,
      y: 340 + Math.sin(angle) * radius * 0.72,
      size,
      color: cluster.color,
      accentOpacity: 0.28 + random() * 0.36,
      description:
        subcluster.titleEn ?? subcluster.title ?? `${cluster.labelZh} 子主题 ${String(index + 1).padStart(2, "0")}`,
    };
  });
}
