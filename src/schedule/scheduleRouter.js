const controller = require("./scheduleController");

module.exports = [
  {
    groupUrl: "/",
    subRoutes: [
      {
        method: "GET",
        url: "/",
        controller: controller.index,
      }
    ],
  },
  {
    groupUrl: "/schedule/",
    middleware: (req, res, next) => {},
    subRoutes: [
      {
        method: "POST",
        url: "/create",
        controller: controller.create,
      },
    ],
  },
];
