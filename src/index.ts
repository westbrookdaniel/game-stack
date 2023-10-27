import path from "node:path";
import fs from "node:fs/promises";

const server = Bun.serve<{ username: string }>({
  async fetch(req) {
    // TEMPORARY IN HERE
    const client = await Bun.build({
      entrypoints: ["./src/client.ts"],
      outdir: "./build",
    });

    const clientFiles = client.outputs.map(
      (o) => `/${path.relative("./build", o.path)}`,
    );

    let html = await Bun.file("./index.html").text();
    html = html.replace(
      "<!--scripts-->",
      clientFiles
        .map((file) => `<script src="${file}" type="module"></script>`)
        .join("\n"),
    );

    const publicDir = await fs.readdir("./public");
    const publicFiles = publicDir.map((file) => `/${file}`);
    // TEMPORARY IN HERE

    const url = new URL(req.url);

    if (clientFiles.includes(url.pathname)) {
      return new Response(
        Bun.file(path.join("./build", url.pathname)).stream(),
      );
    }

    if (publicFiles.includes(url.pathname)) {
      return new Response(
        Bun.file(path.join("./public", url.pathname)).stream(),
      );
    }

    if (url.pathname === "/") {
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
