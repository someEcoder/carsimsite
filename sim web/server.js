// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === "/") pathname = "/index.html";

    let filePath = path.join(__dirname, pathname);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
    }

    const ext = path.extname(filePath);

    const headers = {};

    // 🔑 Unity WebGL Brotli fix
    if (filePath.endsWith(".br")) {
        headers["Content-Encoding"] = "br";

        // Correct MIME type underneath the compression
        if (filePath.includes(".js.br")) headers["Content-Type"] = "application/javascript";
        if (filePath.includes(".wasm.br")) headers["Content-Type"] = "application/wasm";
        if (filePath.includes(".data.br")) headers["Content-Type"] = "application/octet-stream";
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            return res.end("Not found");
        }

        res.writeHead(200, headers);
        res.end(content);
    });
});

server.listen(3000, () => {
    console.log("Unity WebGL server running at http://localhost:3000");
});
