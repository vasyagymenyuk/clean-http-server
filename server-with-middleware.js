const http = require("http");
const middlewares = [];

function isError(error) {
  switch (Object.prototype.toString.call(error)) {
    case "[object Error]":
      return true;
    case "[object Object]":
      return (
        error.message &&
        typeof error.message === "string" &&
        error.stack &&
        typeof error.stack === "string"
      );
  }

  return false;
}

/**
 * Основной обработчик HTTP-запросов
 *
 * @param {IncomingMessage} request
 * @param {ServerResponse} response
 * @return {Promise<void>}
 */
async function requestListener(request, response) {
  response.isFinished = false;
  response.on("finish", () => (response.isFinished = true));
  response.on("close", () => (response.isFinished = true));

  let result;
  try {
    result = await middlewares.reduce(
      (/**Promise*/ promise, middleware) =>
        promise.then((result) => {
          if (isError(result)) {
            return Promise.reject(result);
          }

          return new Promise((next, reject) => {
            Promise.resolve(middleware(request, response, next)).catch(reject);
          });
        }),
      Promise.resolve()
    );

    if (isError(result)) {
      throw result;
    }
  } catch (e) {
    response.statusCode = 500;

    result = "Error";
  }

  if (response.isFinished) {
    return;
  }

  response.end(result);
}

/*
 * Функция-регистратор middleware-кода
 */
function registerMiddleware(callback) {
  if (typeof callback !== "function") {
    return;
  }

  middlewares.push(callback);
}

const server = http.createServer(requestListener);

server.use = registerMiddleware;

const cookieParser = require("cookie-parser");
server.use(cookieParser());

server.use((request, response) => {
  if (request.cookies["SSID"]) {
    return "Your session id is " + request.cookies["SSID"];
  }

  return "No session detected";
});

server.listen(12345, "localhost", () => {
  console.log("Started http");
});
