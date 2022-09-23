const controller = require('./userController')

module.exports = {
        groupUrl: "/users",
        subRoutes: [
            {
                url: "/",
                method: "GET",
                controller: controller.index
            }
        ],

    }
