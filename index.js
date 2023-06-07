const fs = require("fs");
const path = require("path");
const http = require("http");

const PORT = process.env.PORT | 5000;
let contentType = "text/html";

const server = http.createServer((req, res) => {
  let filePath = path.join(
    __dirname,
    "/src",
    req.url === "/" ? "html/index.html" : req.url
  );
  let requestedFileExtension = path.extname(filePath);
  switch (requestedFileExtension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".html":
      contentType = "text/html";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        // page not found
        fs.readFile(
          path.join(__dirname, "/src/html", "404.html"),
          (error, errorContent) => {
            if (error) throw error;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(errorContent, "utf8");
          }
        );
      } else {
        // if some server error
        res.writeHead(500);
        res.end(`server erro : ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

server.listen(PORT, console.log(`server running on port:${PORT}`));
