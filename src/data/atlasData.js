import {
  PRIMARY_CLUSTERS as LEGACY_PRIMARY_CLUSTERS,
  PRIMARY_DIMENSIONS as LEGACY_PRIMARY_DIMENSIONS,
  SECONDARY_DETAILS as LEGACY_SECONDARY_DETAILS,
  SENTIMENT_VIEWS as LEGACY_SENTIMENT_VIEWS,
  TIME_BUCKETS as LEGACY_TIME_BUCKETS,
  TOP_PRIMARY_IDS,
  VIEWBOX,
} from "../../../frontend/src/data/modisData.js";

export const APP_META = {
  brandZh: "MODIS 语义宇宙",
  brandEn: "MODIS Semantic Cosmos",
  titleZh: "“MODIS”卫星文献挖掘：研究主题、趋势与情感分析",
  titleEn: "Literature Mining of MODIS Studies: Topics, Trends, and Sentiment",
  introZh:
    "以 2001 至 2025 年 MODIS 相关句子级语料为基础，将长期积累的研究知识组织成一张可航行的语义星图。",
  introEn:
    "A navigable semantic atlas built from sentence-level MODIS literature between 2001 and 2025.",
  pointBudget: 23000,
  corpusSentences: 231921,
  publicationCount: 13896,
};

export const FUTURE_MODULES = [
  {
    id: "trend",
    titleZh: "趋势航标",
    titleEn: "Trend Beacon",
    descriptionZh: "保留时序演化入口，作为 Phase 2 的远端航标。",
    path: "/trend",
  },
  {
    id: "sentiment",
    titleZh: "情感灯塔",
    titleEn: "Sentiment Beacon",
    descriptionZh: "保留评价性表达入口，作为 Phase 2 的低亮度预览。",
    path: "/sentiment",
  },
];

export const CLUSTER_ACTIONS = [
  { id: "themes", label: "主题发现" },
  { id: "trends", label: "趋势分析" },
  { id: "sentiment", label: "情感分析" },
];

export const HOME_SCENE = {
  brandLine: "MODIS RESEARCH ATLAS",
  homeHero: {
    title: "MODIS Research",
    titleClassName: "atlas__home-title--crimson",
    ctaZh: "开始探索",
    ctaEn: "Start Exploring",
    ariaLabel: "MODIS Research homepage",
    ctaAsset: "/assets/home-cta/start-explore-nasa-outline.png",
    ctaAlternates: [
      "/assets/home-cta/start-explore-apple-blue.png",
      "/assets/home-cta/start-explore-dark-pill.png",
    ],
  },
  titleZh: ["MODIS 卫星文献宇宙", "研究主题、趋势与情感分析"],
  subtitleEn: [
    "MODIS Satellite Literature Universe:",
    "Research Themes, Trends and Sentiment Analysis",
  ],
  descriptionZh: [
    "从海量文献中发现知识的星辰大海，",
    "连接研究主题、揭示趋势、洞察情感。",
  ],
  descriptionEn: [
    "Explore the vast knowledge universe from a sea of literature,",
    "connect research themes, reveal trends, and perceive sentiments.",
  ],
  galaxyCloud: {
    centerX: 520,
    centerY: 286,
    radiusX: 338,
    radiusY: 214,
    coreRadiusX: 156,
    coreRadiusY: 74,
    tilt: -0.24,
    bandShear: 22,
    energyOrigin: { x: 500, y: 592 },
  },
  observationConsole: {
    titleZh: "观测台",
    titleEn: "Observation Console",
    badgeZh: "真实字段",
    badgeEn: "Truth Anchored",
    rows: [
      {
        id: "corpus",
        labelZh: "语料总量",
        labelEn: "Semantic Corpus",
        value: APP_META.corpusSentences.toLocaleString(),
        captionZh: "句语义语料",
        captionEn: "sentence-level corpus",
      },
      {
        id: "publications",
        labelZh: "文献篇数",
        labelEn: "Publications",
        value: APP_META.publicationCount.toLocaleString(),
        captionZh: "篇出版物",
        captionEn: "publications",
      },
      {
        id: "timespan",
        labelZh: "时间跨度",
        labelEn: "Time Span",
        value: "2001-2025",
        captionZh: "句级语料观测区间",
        captionEn: "sentence-level archive window",
      },
      {
        id: "mode",
        labelZh: "星图模式",
        labelEn: "Atlas Mode",
        value: "Universe",
        captionZh: `${APP_META.pointBudget.toLocaleString()} semantic points`,
        captionEn: "23,000 semantic points",
      },
      {
        id: "clusters",
        labelZh: "聚类层级",
        labelEn: "Cluster Depth",
        value: `${LEGACY_PRIMARY_CLUSTERS.length}`,
        captionZh: "12 个一级主题簇",
        captionEn: "12 primary clusters",
      },
    ],
  },
  previewCards: [
    {
      id: "trend",
      titleZh: "趋势分析（预览）",
      titleEn: "Trend Analysis (Preview)",
      eyebrowZh: "远端预览",
      eyebrowEn: "Future Route",
      descriptionZh: "保留时序演化入口",
      descriptionEn: "Future temporal route",
      path: "/trend",
    },
    {
      id: "sentiment",
      titleZh: "情感分析（预览）",
      titleEn: "Sentiment Analysis (Preview)",
      eyebrowZh: "远端预览",
      eyebrowEn: "Future Route",
      descriptionZh: "保留评价表达入口",
      descriptionEn: "Future sentiment route",
      path: "/sentiment",
    },
  ],
  clusterConsole: {
    promptZh: "23,000 个语义散点正在形成银河云团，手动触发后显影 12 个一级主题簇。",
    promptEn: "23,000 semantic points are suspended in the nebula. Trigger clustering to reveal 12 primary galaxies.",
    actionZh: "开始一级聚类",
    actionEn: "Start Level-1 Clustering",
    idleZh: "发现主题星系",
    idleEn: "Discover Theme Galaxies",
    statusZh: "一级星系已展开",
    statusEn: "12 primary galaxies revealed",
    flankLeftZh: "发现主题星系",
    flankLeftEn: "Discover Theme Galaxies",
    flankRightZh: "揭示知识结构",
    flankRightEn: "Reveal Knowledge Structure",
  },
  hud: [
    {
      id: "points",
      labelZh: "语义规模",
      labelEn: "Semantic Scale",
      value: `${APP_META.pointBudget.toLocaleString()} points`,
    },
    {
      id: "mode",
      labelZh: "视图模式",
      labelEn: "View Mode",
      value: "Universe",
    },
    {
      id: "clusters",
      labelZh: "聚类层级",
      labelEn: "Cluster Depth",
      value: "12 primary clusters",
    },
    {
      id: "status",
      labelZh: "数据状态",
      labelEn: "Data Status",
      value: "语义星图已就绪",
    },
  ],
};

const DIMENSION_COPY = {
  observation: {
    labelZh: "观测识别",
    description: "环境对象、现象识别与监测产品。",
  },
  retrieval: {
    labelZh: "变量反演",
    description: "地球物理变量反演、校正与验证。",
  },
  application: {
    labelZh: "融合应用",
    description: "多源数据联合与综合场景应用。",
  },
};

const CLUSTER_COPY = {
  1: {
    shortLabel: "气溶胶",
    labelZh: "气溶胶与气候研究",
    summary:
      "围绕 AOD 反演、AERONET 验证、区域偏差评估与气候效应分析展开，是 MODIS 大气遥感中最稳定的核心方向之一。",
  },
  2: {
    shortLabel: "融合",
    labelZh: "Landsat-MODIS 数据融合",
    summary:
      "聚焦时空融合、土地覆盖监测、作物物候分析与跨传感器协同，体现 MODIS 研究从单产品评估走向多源联合应用。",
  },
  3: {
    shortLabel: "LST",
    labelZh: "地表温度产品验证",
    summary:
      "围绕地表温度产品验证、发射率反演、尺度匹配与 ASTER 对比展开，是热红外反演研究中的高频主题。",
  },
  4: {
    shortLabel: "植被",
    labelZh: "蒸散发与植被监测",
    summary:
      "覆盖 LAI、GPP、FPAR、BRDF 校正与植被动态监测，代表 MODIS 在生态遥感中的长期应用脉络。",
  },
  5: {
    shortLabel: "野火",
    labelZh: "野火监测与过火区制图",
    summary:
      "围绕主动火点、过火区制图、云干扰控制与跨传感器协同展开，是应用导向最强的一级主题之一。",
  },
  6: {
    shortLabel: "油膜",
    labelZh: "油膜与环境变化监测",
    summary:
      "关注油膜识别、异常环境变化监测与事件响应中的反射率变化分析，规模较小但语义独立。",
  },
  7: {
    shortLabel: "反照率",
    labelZh: "反照率与辐射通量",
    summary:
      "聚焦反照率、辐射收支与地表能量平衡建模，是偏物理过程解释的长尾方向。",
  },
  8: {
    shortLabel: "云属性",
    labelZh: "云属性反演",
    summary:
      "围绕云顶高度、光学厚度与 CloudSat/CALIPSO 联合验证展开，是云产品侧的重要细分主题。",
  },
  9: {
    shortLabel: "蒸散发",
    labelZh: "地表辐射与蒸散发估算",
    summary:
      "围绕地表辐射与蒸散发估算展开，强调晴空与多云条件下的模型适配与能量平衡。",
  },
  10: {
    shortLabel: "土壤水分",
    labelZh: "土壤水分与水分胁迫",
    summary:
      "结合 LST、NDVI 与回归或机器学习模型估算土壤水分与干旱胁迫，偏向应用预测方向。",
  },
  11: {
    shortLabel: "空气质量",
    labelZh: "空气质量监测",
    summary:
      "利用 AOD 估算 PM2.5 并开展空间分布与政策支撑分析，方法链条清晰、应用目标明确。",
  },
  12: {
    shortLabel: "湖冰",
    labelZh: "湖冰与季节变化",
    summary:
      "围绕湖冰覆盖监测、季节变化与可见光-热红外联合识别展开，是规模较小但语义清晰的分支。",
  },
};

const SECONDARY_COPY = {
  1: {
    title: "二级星系 / 气溶胶与气候研究",
    overview:
      "二级层主要围绕 AERONET 验证、区域偏差修正、海陆差异与同化应用展开，展示气溶胶主题内部的成熟知识骨架。",
    takeaways: [
      "AERONET 仍是最稳定的外部验证基准。",
      "亮地表与区域偏差持续驱动算法修正。",
      "同化方法推动主题从产品评估走向预测应用。",
    ],
    challenges: [
      "高气溶胶负荷与亮地表条件下仍存在系统偏差。",
      "云污染与海洋场景会放大不确定性。",
      "不同气溶胶类型之间的泛化能力并不一致。",
    ],
  },
  2: {
    title: "二级星系 / Landsat-MODIS 数据融合",
    overview:
      "内部主要由时空融合、土地覆盖增强、作物物候监测与跨传感器协同组成，是从 MODIS 延展到多源观测的核心桥梁。",
    takeaways: [
      "STARFM 一类方法构成了融合叙事的核心骨架。",
      "融合不仅提升分辨率，也改善云遮挡与反射率约束。",
      "农业与生态监测是最稳定的落地方向。",
    ],
    challenges: [
      "空间分辨率与重访周期之间存在根本权衡。",
      "复杂下垫面与云污染显著影响融合精度。",
      "跨传感器定标误差会在时序应用中累积。",
    ],
  },
  3: {
    title: "二级星系 / 地表温度产品验证",
    overview:
      "二级结构围绕 LST 验证、发射率反演、尺度匹配与跨产品对比展开，强调热红外反演在复杂场景中的稳定性问题。",
    takeaways: [
      "地面观测与卫星交叉验证始终是主线。",
      "发射率、云污染与大气校正是关键误差源。",
      "更高空间分辨率需求持续推动融合与降尺度。",
    ],
    challenges: [
      "复杂地表与尺度错配会持续放大误差。",
      "大气状态差异直接影响模型稳定性。",
      "不同算法在不同生态区的泛化能力差异明显。",
    ],
  },
  4: {
    title: "二级星系 / 蒸散发与植被监测",
    overview:
      "内部聚焦 LAI、GPP、BRDF 与环境参数耦合，体现植被生态研究从产品应用走向过程建模与融合增强。",
    takeaways: [
      "LAI 与 GPP 是本簇最稳定的语义核心。",
      "BRDF 与几何校正决定长期序列一致性的上限。",
      "数据融合让植被监测逐步接近高分辨率业务需求。",
    ],
    challenges: [
      "稀疏与高密植被条件下都可能出现系统偏差。",
      "角度效应与混合像元会削弱时序稳定性。",
      "GPP 与 LAI 模型对输入参数高度敏感。",
    ],
  },
  5: {
    title: "二级星系 / 野火监测与过火区制图",
    overview:
      "内部围绕火点检测、过火区制图、云影响控制与偏差校正展开，体现 MODIS 在灾害响应中的高压应用场景。",
    takeaways: [
      "主动火点与过火区制图构成双主轴。",
      "云检测与地表反射率改进直接影响火情产品可信度。",
      "该主题天然连接多传感器协同与灾后评估任务。",
    ],
    challenges: [
      "卷云与高亮地表容易造成假阳性。",
      "空间分辨率不足限制了小尺度火点识别。",
      "长期产品一致性需要持续维护与偏差校正。",
    ],
  },
};

const TIME_BUCKET_COPY = {
  "2001-2005": {
    stageLabel: "基础反演与产品验证期",
    summary: "早期研究以产品定标、区域验证和误差识别为主。",
  },
  "2006-2010": {
    stageLabel: "验证走向应用扩展期",
    summary: "研究开始从产品验证扩展到跨产品比较与应用评估。",
  },
  "2011-2015": {
    stageLabel: "多源融合与精度优化期",
    summary: "复杂场景下的数据质量控制与精度优化成为重点。",
  },
  "2016-2020": {
    stageLabel: "高精度协同应用期",
    summary: "多源协同与尺度-精度一体化分析明显增强。",
  },
  "2021-2025": {
    stageLabel: "多任务并行与传承期",
    summary: "多主题并行推进，跨产品与跨传感器验证更加常见。",
  },
};

const SENTIMENT_COPY = {
  1: {
    title: "气溶胶簇情感剖面",
    summary:
      "正向表达多来自验证体系完善与同化能力增强，负向表达集中在亮地表、云污染与区域偏差。",
    negativeKeywords: ["亮地表偏差", "区域误差", "云污染", "反演不确定性"],
    positiveKeywords: ["AERONET", "Collection 改进", "全球监测", "AOD 同化"],
  },
  2: {
    title: "数据融合簇情感剖面",
    summary:
      "正向表达集中于时空互补与物候监测增强，负向表达主要与尺度失配、云偏差和混合像元有关。",
    negativeKeywords: ["尺度失配", "云偏差", "混合像元", "验证缺口"],
    positiveKeywords: ["时空融合", "作物物候", "土地覆盖", "STARFM"],
  },
  3: {
    title: "LST 簇情感剖面",
    summary:
      "正向表达集中在长期验证、算法迭代与跨产品连续性，负向表达则聚焦发射率、云干扰与尺度错配。",
    negativeKeywords: ["发射率误差", "尺度错配", "云干扰", "系统偏差"],
    positiveKeywords: ["长期验证", "算法迭代", "ASTER 对比", "数据连续性"],
  },
  4: {
    title: "植被监测簇情感剖面",
    summary:
      "正向表达多来自 GPP 优化、BRDF 校正与大范围监测能力，负向表达主要落在 LAI 低估和参数敏感上。",
    negativeKeywords: ["LAI 低估", "角度效应", "异质冠层", "参数敏感"],
    positiveKeywords: ["GPP 优化", "BRDF 校正", "大尺度监测", "产品一致性"],
  },
  5: {
    title: "野火监测簇情感剖面",
    summary:
      "正向表达集中于快速响应与全球制图，负向表达主要来自云层干扰、粗分辨率与火点误判。",
    negativeKeywords: ["云层干扰", "粗分辨率", "火点误差", "反演偏差"],
    positiveKeywords: ["快速探测", "全球制图", "多传感器协同", "灾后评估"],
  },
};

function cleanFigurePath(path) {
  return path?.replace(/\.png$/, "-clean.png") ?? "";
}

export const PRIMARY_DIMENSIONS = LEGACY_PRIMARY_DIMENSIONS.map((dimension) => ({
  ...dimension,
  labelZh: DIMENSION_COPY[dimension.id]?.labelZh ?? dimension.labelEn,
  description: DIMENSION_COPY[dimension.id]?.description ?? dimension.description,
}));

export const PRIMARY_CLUSTERS = LEGACY_PRIMARY_CLUSTERS.map((cluster) => ({
  ...cluster,
  shortLabel: CLUSTER_COPY[cluster.id]?.shortLabel ?? cluster.shortLabel,
  labelZh: CLUSTER_COPY[cluster.id]?.labelZh ?? cluster.labelEn,
  summary: CLUSTER_COPY[cluster.id]?.summary ?? cluster.summary,
}));

export const SECONDARY_DETAILS = Object.fromEntries(
  TOP_PRIMARY_IDS.map((clusterId) => {
    const legacy = LEGACY_SECONDARY_DETAILS[clusterId];
    const copy = SECONDARY_COPY[clusterId];
    return [
      clusterId,
      {
        clusterId,
        title: copy?.title ?? legacy?.title ?? getPrimaryClusterById(clusterId).labelZh,
        overview: copy?.overview ?? getPrimaryClusterById(clusterId).summary,
        takeaways: copy?.takeaways ?? [],
        challenges: copy?.challenges ?? [],
        figure: cleanFigurePath(legacy?.figure),
        wordCloudFigure: legacy?.wordCloudFigure ?? "",
        subclusters: legacy?.subclusters ?? [],
      },
    ];
  }),
);

export const TIME_BUCKETS = LEGACY_TIME_BUCKETS.map((bucket) => ({
  ...bucket,
  stageLabel: TIME_BUCKET_COPY[bucket.id]?.stageLabel ?? bucket.stageLabel,
  summary: TIME_BUCKET_COPY[bucket.id]?.summary ?? bucket.summary,
  image: cleanFigurePath(bucket.image),
}));

export const SENTIMENT_VIEWS = Object.fromEntries(
  TOP_PRIMARY_IDS.map((clusterId) => {
    const legacy = LEGACY_SENTIMENT_VIEWS[clusterId];
    const copy = SENTIMENT_COPY[clusterId];
    return [
      clusterId,
      {
        clusterId,
        title: copy?.title ?? legacy?.title ?? getPrimaryClusterById(clusterId).labelZh,
        summary: copy?.summary ?? legacy?.summary ?? "",
        negativeFigure: cleanFigurePath(legacy?.negativeFigure),
        positiveFigure: cleanFigurePath(legacy?.positiveFigure),
        negativeKeywords: copy?.negativeKeywords ?? [],
        positiveKeywords: copy?.positiveKeywords ?? [],
      },
    ];
  }),
);

export const COLOR_SYSTEM = {
  deepSpace: "#030714",
  deepSpaceBlue: "#0b1838",
  cabinEdge: "#10213f",
  glassGlow: "#86c9ff",
  textMain: "#ecf6ff",
  textMuted: "#95aeca",
  accentWarm: "#f7c46d",
  accentCool: "#77b7ff",
};

export function getPrimaryClusterById(clusterId) {
  return PRIMARY_CLUSTERS.find((cluster) => cluster.id === Number(clusterId)) ?? PRIMARY_CLUSTERS[0];
}

export function getPrimaryDimensionById(dimensionId) {
  return PRIMARY_DIMENSIONS.find((dimension) => dimension.id === dimensionId) ?? PRIMARY_DIMENSIONS[0];
}

export function getSecondaryDetail(clusterId) {
  return SECONDARY_DETAILS[clusterId] ?? null;
}

export function getTimeBuckets() {
  return TIME_BUCKETS;
}

export function getSentimentView(clusterId) {
  return SENTIMENT_VIEWS[clusterId] ?? null;
}

export { TOP_PRIMARY_IDS, VIEWBOX };
