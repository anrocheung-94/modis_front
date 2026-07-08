export const SPACE_MOTION_SCENES = {
  home: {
    id: "home",
    loop: true,
    poster: "/assets/space-motion/home-slow-voyage-poster.png",
    sources: [
      { src: "/assets/space-motion/home-slow-voyage.webm", type: "video/webm" },
      { src: "/assets/space-motion/home-slow-voyage.mp4", type: "video/mp4" },
    ],
  },
  clusterTransition: {
    id: "clusterTransition",
    loop: false,
    poster: "/assets/space-motion/home-slow-voyage-poster.png",
    sources: [
      { src: "/assets/space-motion/cluster-perspective-shift.webm", type: "video/webm" },
      { src: "/assets/space-motion/cluster-perspective-shift.mp4", type: "video/mp4" },
    ],
  },
};
