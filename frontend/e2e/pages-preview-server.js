import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const root = resolve(process.cwd(), "dist");
const basePath = "/ITEducation";
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function send(response, status, body, contentType) {
  response.writeHead(status, {
    "Content-Type": contentType || "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(body);
}

const server = createServer(async function (request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    send(response, 405, "Method Not Allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  } catch {
    send(response, 400, "Bad Request");
    return;
  }

  if (pathname === basePath) pathname += "/";
  if (!pathname.startsWith(basePath + "/")) {
    send(response, 404, "Not Found");
    return;
  }

  const relativePath = pathname.slice(basePath.length + 1) || "index.html";
  const filePath = resolve(root, relativePath);

  if (filePath !== root && !filePath.startsWith(root + sep)) {
    send(response, 403, "Forbidden");
    return;
  }

  let resolvedPath = filePath;
  try {
    const info = await stat(resolvedPath);
    if (info.isDirectory()) resolvedPath = join(resolvedPath, "index.html");
  } catch {
    if (extname(relativePath)) {
      send(response, 404, "Not Found");
      return;
    }
    resolvedPath = join(root, "index.html");
  }

  try {
    const body = await readFile(resolvedPath);
    const type = contentTypes[extname(resolvedPath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": type,
      "Content-Length": body.length,
      "Cache-Control": "no-store"
    });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch {
    send(response, 404, "Not Found");
  }
});

server.listen(port, "127.0.0.1", function () {
  process.stdout.write("GitHub Pages preview listening at http://127.0.0.1:" + port + basePath + "/\\n");
});
