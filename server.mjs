import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./dist", import.meta.url));
const port = Number(process.env.PORT || 4276);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function resolveFile(urlPath) {
  const cleanPath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
  const candidate = normalize(join(root, cleanPath));
  if (candidate.startsWith(normalize(root)) && existsSync(candidate) && !statSync(candidate).isDirectory()) {
    return candidate;
  }
  return normalize(join(root, "index.html"));
}

createServer((request, response) => {
  const filePath = resolveFile(new URL(request.url, `http://${request.headers.host}`).pathname);
  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": "no-cache",
  });
  createReadStream(filePath).pipe(response);
}).listen(port, () => {
  console.log(`MODIS cosmic atlas available at http://127.0.0.1:${port}`);
});
