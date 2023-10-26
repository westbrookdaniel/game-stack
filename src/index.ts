import path from "node:path";

let html = await Bun.file("./index.html").text();

const client = await Bun.build({
  entrypoints: ["./src/client.tsx"],
  outdir: "./build",
});

const clientFiles = client.outputs.map(
  (o) => `/${path.relative("./build", o.path)}`,
);

html = html.replace(
  "<!--scripts-->",
  clientFiles
    .map((file) => `<script src="${file}" type="module"></script>`)
    .join("\n"),
);

const server = Bun.serve<{ username: string }>({
  async fetch(req) {
    const url = new URL(req.url);

    if (clientFiles.includes(url.pathname)) {
      return new Response(
        Bun.file(path.join("./build", url.pathname)).stream(),
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
