const controller = require("./scheduleController");

module.exports = [
  {
    groupUrl: "/schedule/",
    middleware: (req, res, next) => {},
    subRoutes: [
      {
        method: "GET",
        url: "/",
        controller: controller.index,
      },
      {
        method: "POST",
        url: "/create",
        controller: controller.create,
      },
    ],
  },
];
