import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AtlasProvider } from "./model/AtlasContext.jsx";
import { AtlasRoute } from "./routes/AtlasRoute.jsx";
import { PreviewRoute } from "./routes/PreviewRoute.jsx";
import { SecondaryRoute } from "./routes/SecondaryRoute.jsx";

export default function App() {
  return (
    <AtlasProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AtlasRoute />} />
          <Route path="/atlas" element={<AtlasRoute />} />
          <Route path="/galaxy/:clusterId" element={<SecondaryRoute />} />
          <Route path="/trend" element={<PreviewRoute kind="trend" />} />
          <Route path="/sentiment" element={<PreviewRoute kind="sentiment" />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
    </AtlasProvider>
  );
}
