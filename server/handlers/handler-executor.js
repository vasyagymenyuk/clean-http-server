module.exports = async function (handlersArray, req, res) {
  for (const handler of handlersArray) {
    const handlerResult = await handler(req, res, next);

    if (handlerResult !== true) {
      throw new Error("There is no next() function in a middleware");
    }
  }
};

function next() {
  return true;
}
