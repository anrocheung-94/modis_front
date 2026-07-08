import { useNavigate } from "react-router-dom";

import { FUTURE_MODULES, SENTIMENT_VIEWS, TIME_BUCKETS } from "../data/atlasData.js";

export function PreviewRoute({ kind }) {
  const navigate = useNavigate();
  const module = FUTURE_MODULES.find((item) => item.id === kind);
  const cards =
    kind === "trend"
      ? TIME_BUCKETS.map((bucket) => ({
          id: bucket.id,
          title: bucket.stageLabel,
          subtitle: bucket.period,
          summary: bucket.summary,
          image: bucket.image,
        }))
      : Object.values(SENTIMENT_VIEWS).map((view) => ({
          id: view.clusterId,
          title: view.title,
          subtitle: `Cluster ${view.clusterId}`,
          summary: view.summary,
          image: view.positiveFigure,
        }));

  return (
    <main className="preview">
      <button type="button" className="secondary__back" onClick={() => navigate("/atlas")}>
        返回主星图
      </button>
      <header className="preview__header">
        <p className="eyebrow">远端航标 / Low-Emphasis Preview</p>
        <h1>{module?.titleZh}</h1>
        <p>
          {module?.descriptionZh}
          <span>{module?.titleEn}</span>
        </p>
      </header>
      <section className="preview__grid">
        {cards.map((card) => (
          <article key={card.id} className="preview-card">
            {card.image ? <img src={card.image} alt={card.title} /> : null}
            <div>
              <strong>{card.title}</strong>
              <span>{card.subtitle}</span>
              <p>{card.summary}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
