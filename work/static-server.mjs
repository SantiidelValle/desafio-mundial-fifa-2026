import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd(), "dist");
const port = Number(process.env.PORT ?? 4173);
const host = "127.0.0.1";

const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"]
]);

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${host}:${port}`);
    const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = path.resolve(root, `.${requestedPath}`);

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    try {
      const file = await readFile(filePath);
      response.writeHead(200, { "Content-Type": mime.get(path.extname(filePath)) ?? "application/octet-stream" });
      response.end(file);
    } catch {
      const fallback = await readFile(path.join(root, "index.html"));
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(fallback);
    }
  } catch (error) {
    response.writeHead(500);
    response.end(String(error));
  }
});

server.listen(port, host, () => {
  console.log(`Desafio Mundial FIFA 2026 listo en http://${host}:${port}/`);
});
