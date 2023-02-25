require("dotenv").config();
const http = require("node:http");

const port = process.env.PORT || 7000;
const host = process.env.HOST || "localhost";

const extendRequestAndResponse = require("./server/handlers/request-response-extend");
const generateRouter = require("./server/handlers/generate-router");
const handlerExecutor = require("./server/handlers/handler-executor");

const router = generateRouter();

async function requestHandler(req, res) {
  extendRequestAndResponse(req, res);

  const handlersArray = await router(req, res);

  if (handlersArray.error) return res.error(handlersArray.error);

  return await handlerExecutor(handlersArray, req, res);
}

const server = http.createServer(requestHandler);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
