module.exports = function (req, res) {
  // Method helping return JSON data to client
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(jsonStringify(data));
  };

  // Method helping handle and return error to client
  res.error = (error) => {
    const status = error.status || 400;
    const message = error.message || "Bad request";

    res.setHeader("Content-Type", "application/json");
    res.writeHead(status);

    res.end(
      jsonStringify({
        message,
        status,
      })
    );
  };
};

/**
 * Simplify JSON.stringify function
 * @param object{any}
 * @returns {string}
 */
function jsonStringify(object) {
  return JSON.stringify(object, null, 3);
}
