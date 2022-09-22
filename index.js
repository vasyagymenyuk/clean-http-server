require("dotenv").config();
const http = require("node:http");

const port = process.env.PORT || 7000;
const host = process.env.HOST || "localhost";

const extendRequestAndResponse = require("./server/handlers/request-response-extend");
const generateRouter = require("./server/handlers/generate-router");

const router = generateRouter();

async function requestHandler(req, res) {
  extendRequestAndResponse(req, res);

  const handler = await router(req);

  return await handler(req, res);
}

const server = http.createServer(requestHandler);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
