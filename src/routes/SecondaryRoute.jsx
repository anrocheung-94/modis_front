import { useEffect, useMemo, startTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SecondaryNebulaCanvas } from "../components/SecondaryNebulaCanvas.jsx";
import { COLOR_SYSTEM, getPrimaryClusterById, getSecondaryDetail } from "../data/atlasData.js";
import { useAtlas } from "../model/AtlasContext.jsx";
import { buildSecondaryNodes } from "../model/secondaryNebula.js";

export function SecondaryRoute() {
  const navigate = useNavigate();
  const { clusterId } = useParams();
  const numericClusterId = Number(clusterId);
  const {
    dispatch,
    reducedMotion,
    state,
    universe,
  } = useAtlas();

  const cluster = getPrimaryClusterById(numericClusterId);
  const detail = getSecondaryDetail(numericClusterId);
  const nodes = useMemo(() => buildSecondaryNodes(numericClusterId), [numericClusterId]);
  const focusedNode = nodes.find((node) => node.id === state.focusedNodeId) ?? nodes[0] ?? null;

  useEffect(() => {
    if (!cluster?.id) {
      navigate("/atlas", { replace: true });
      return;
    }
    dispatch({ type: "ENTER_SECONDARY", clusterId: cluster.id });
  }, [cluster?.id, dispatch, navigate]);

  const handleBack = () => {
    dispatch({ type: "EXIT_SECONDARY" });
    startTransition(() => navigate("/atlas"));
  };

  return (
    <main className="secondary" style={{ "--cluster-glow": cluster.color, "--panel-glow": `${cluster.color}33`, color: COLOR_SYSTEM.textMain }}>
      <button type="button" className="secondary__back" onClick={handleBack}>
        返回主星图
      </button>
      <section className="secondary__viewport">
        <header className="secondary__header">
          <p className="eyebrow">进入星系 / Enter Galaxy</p>
          <h1>{cluster.labelZh}</h1>
          <p>
            {cluster.summary}
            <span>{cluster.labelEn}</span>
          </p>
        </header>
        <SecondaryNebulaCanvas
          cluster={cluster}
          focusedNodeId={state.focusedNodeId}
          nodes={nodes}
          points={universe.points}
          reducedMotion={reducedMotion}
          onFocusNode={(nodeId) => dispatch({ type: "FOCUS_NODE", nodeId })}
        />
      </section>

      <aside className="secondary__panel">
        <div className="secondary__panel-head">
          <p>右侧光面板 / Light Panel</p>
          <strong>{detail?.title ?? `${cluster.labelZh} 一级摘要层`}</strong>
        </div>

        <div className="secondary__panel-block">
          <h2>研究概览</h2>
          <p>{detail?.overview ?? cluster.summary}</p>
        </div>

        {focusedNode ? (
          <div className="secondary__panel-block">
            <h2>当前焦点</h2>
            <strong>{focusedNode.title}</strong>
            <p>{focusedNode.sampleSize.toLocaleString()} 句语义样本</p>
          </div>
        ) : null}

        {detail ? (
          <>
            <div className="secondary__panel-block">
              <h2>关键判断</h2>
              <ul>
                {detail.takeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="secondary__panel-block">
              <h2>持续挑战</h2>
              <ul>
                {detail.challenges.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="secondary__figure-grid">
              {detail.figure ? <img src={detail.figure} alt={`${cluster.labelZh} 二级聚类图`} /> : null}
              {detail.wordCloudFigure ? <img src={detail.wordCloudFigure} alt={`${cluster.labelZh} 词云`} /> : null}
            </div>
          </>
        ) : (
          <div className="secondary__panel-block secondary__panel-block--muted">
            <h2>当前状态</h2>
            <p>该一级簇在现有系统中没有现成的二级聚类成果，当前先保留一级摘要层与空间进入体验。</p>
          </div>
        )}
      </aside>
    </main>
  );
}
