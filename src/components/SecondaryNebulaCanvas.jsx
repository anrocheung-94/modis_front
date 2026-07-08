import { useEffect, useMemo, useRef, useState } from "react";

import { VIEWBOX } from "../data/atlasData.js";

export function SecondaryNebulaCanvas({ cluster, focusedNodeId, nodes, points, reducedMotion, onFocusNode }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const clusterPoints = useMemo(() => points.filter((point) => point.clusterId === cluster.id), [cluster.id, points]);
  const hoveredNode = nodes.find((node) => node.id === hoveredNodeId) ?? null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    let frameId = 0;
    const context = canvas.getContext("2d");
    const centroid = computeCentroid(clusterPoints);
    const animate = !reducedMotion;

    const render = (timestamp = 0) => {
      fitCanvas(canvas);
      const fit = fitViewBox(canvas.width, canvas.height, VIEWBOX.width, VIEWBOX.height);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "rgba(2, 8, 22, 1)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.translate(fit.offsetX, fit.offsetY);
      context.scale(fit.scale, fit.scale);

      drawSecondaryMist(context, cluster, timestamp);
      drawClusterInterior(context, cluster, clusterPoints, centroid, timestamp, reducedMotion);
      drawSecondaryNodes(context, nodes, focusedNodeId, hoveredNodeId);

      if (animate) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    render();

    return () => window.cancelAnimationFrame(frameId);
  }, [cluster, clusterPoints, focusedNodeId, hoveredNodeId, nodes, reducedMotion]);

  const handlePointerMove = (event) => {
    const point = localPoint(event, canvasRef.current);
    if (!point) {
      return;
    }
    const fit = fitViewBox(canvasRef.current.width, canvasRef.current.height, VIEWBOX.width, VIEWBOX.height);
    const local = {
      x: (point.x - fit.offsetX) / fit.scale,
      y: (point.y - fit.offsetY) / fit.scale,
    };
    const node = resolveNodeHit(nodes, local.x, local.y);
    setHoveredNodeId(node?.id ?? null);
  };

  return (
    <div className="secondary-nebula" ref={hostRef}>
      <canvas
        ref={canvasRef}
        aria-label={`${cluster.labelZh} secondary nebula`}
        onClick={() => {
          if (hoveredNodeId) {
            onFocusNode(hoveredNodeId);
          }
        }}
        onPointerLeave={() => setHoveredNodeId(null)}
        onPointerMove={handlePointerMove}
      />
      {hoveredNode ? (
        <div className="secondary-nebula__hover" style={{ left: `${hoveredNode.x / 10}%`, top: `${hoveredNode.y / 7}%` }}>
          <strong>{hoveredNode.title}</strong>
          <span>{hoveredNode.sampleSize.toLocaleString()} sentences</span>
        </div>
      ) : null}
    </div>
  );
}

function drawSecondaryMist(context, cluster, timestamp) {
  const gradient = context.createRadialGradient(460, 330, 40, 460, 330, 460);
  gradient.addColorStop(0, `${cluster.color}55`);
  gradient.addColorStop(0.45, `${cluster.color}18`);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, VIEWBOX.width, VIEWBOX.height);

  context.globalAlpha = 0.18;
  context.fillStyle = cluster.color;
  context.beginPath();
  context.ellipse(430, 320, 260 + Math.sin(timestamp * 0.0004) * 12, 140, -0.18, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawClusterInterior(context, cluster, clusterPoints, centroid, timestamp, reducedMotion) {
  context.save();
  context.globalCompositeOperation = "screen";
  context.fillStyle = cluster.color;
  for (const point of clusterPoints) {
    const jitterX = reducedMotion ? 0 : Math.cos(timestamp * 0.0007 + point.phase) * point.driftRadius * 0.18;
    const jitterY = reducedMotion ? 0 : Math.sin(timestamp * 0.0008 + point.phase) * point.driftRadius * 0.16;
    const x = 420 + (point.clusteredX - centroid.x) * 1.86 + jitterX;
    const y = 320 + (point.clusteredY - centroid.y) * 1.84 + jitterY;
    const radius = point.radius * 1.18;
    context.globalAlpha = point.isResidualGray ? 0.18 : 0.18 + point.intensity * 0.42;
    if (radius <= 1.4) {
      context.fillRect(x, y, radius * 2, radius * 2);
    } else {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function drawSecondaryNodes(context, nodes, focusedNodeId, hoveredNodeId) {
  for (const node of nodes) {
    const active = node.id === focusedNodeId || node.id === hoveredNodeId;
    context.save();
    context.globalCompositeOperation = "screen";
    const glow = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 3.6);
    glow.addColorStop(0, `${node.color}${active ? "cc" : "88"}`);
    glow.addColorStop(0.5, `${node.color}26`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(node.x, node.y, node.size * 3.6, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = active ? "#f5fbff" : node.color;
    context.globalAlpha = active ? 1 : 0.86;
    context.beginPath();
    context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

function resolveNodeHit(nodes, x, y) {
  let winner = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const node of nodes) {
    const currentDistance = Math.hypot(node.x - x, node.y - y);
    if (currentDistance <= node.size * 1.9 && currentDistance < bestDistance) {
      winner = node;
      bestDistance = currentDistance;
    }
  }
  return winner;
}

function computeCentroid(points) {
  const total = points.reduce(
    (acc, point) => {
      acc.x += point.clusteredX;
      acc.y += point.clusteredY;
      return acc;
    },
    { x: 0, y: 0 },
  );
  return {
    x: total.x / points.length,
    y: total.y / points.length,
  };
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
  const scale = Math.min(width / viewWidth, height / viewHeight);
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
