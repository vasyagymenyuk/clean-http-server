const controller = require("./scheduleController");

module.exports = [
  {
    groupUrl: "/",
    subRoutes: [
      {
        method: "GET",
        url: "/",
        middleware: [
          (req, res, next) => {
            req.user = {
              id: 1,
            };
            console.log("in middleware");

            next();
          },
        ],
        controller: controller.index,
      },
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
