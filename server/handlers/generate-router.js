const allRoutes = require("../../src/routes/all-routes");
const httpMethods = require("../common/http-methods");

module.exports = function () {
  const routesMap = getRoutesMap(allRoutes);

  return async function (req, res) {
    let url = normalizeIncomingUrl(req.url);

    const handler = routesMap.get(`${req.method.toLowerCase()}-${url}`);

    if (!handler)
      return {
        error: {
          status: 404,
          message: `Invalid or not found url or/and method`,
        },
      };

    return handler;
  };
};

/**
 *
 * @param url{string}
 * @returns {string}
 */
function normalizeIncomingUrl(url) {
  if (url === "/") return url;

  if (!url.endsWith("/")) return url;

  if (url.endsWith("/")) return url.slice(0, url.lastIndexOf("/")); // TODO: должно обрезаться любое количество слешей в конце, а не только последний
}

/**
 * Generating map of routes by following pattern {"httpMethod-requestUrl": async (req,res)=> any}
 * @param allRoutes{object}
 * @returns {Map<string, (req,res)=>any>}
 */
function getRoutesMap(allRoutes) {
  const routesMap = new Map();

  for (const routeGroupKey in allRoutes) {
    if (!Object.hasOwn(allRoutes, routeGroupKey)) continue;

    const router = allRoutes[routeGroupKey];

    const groupsOrRoutes = [];

    const conditions = {
      isArray: Array.isArray(router),
      isObject:
        typeof router === "object" && !Array.isArray(router) && router !== null,
    };

    if (conditions.isArray) {
      groupsOrRoutes.push(...router);
    } else if (conditions.isObject) {
      groupsOrRoutes.push(router);
    }

    for (const groupOrRoute of groupsOrRoutes) {
      if (groupOrRoute.groupUrl) {
        const parentUrl = groupOrRoute.groupUrl;

        for (const subRoute of groupOrRoute.subRoutes) {
          const { method, url, controller, middleware } = subRoute;

          if (method && httpMethods.includes(method) && url && controller) {
            const composedUrl = parseAndJoinUrl(parentUrl, url);

            const middlewares = [];

            if (middleware) {
              if (Array.isArray(middleware)) middlewares.push(...middleware);

              if (typeof middleware === "function")
                middlewares.push(middleware);
            }

            middlewares.push(controller);

            routesMap.set(
              `${method.toLowerCase()}-${composedUrl}`,
              middlewares
            );
          } else {
            throw new Error(
              `[${routeGroupKey}] Invalid method, not existing url string or controller handler. Check your route description`
            );
          }
        }
      } else
        throw new Error(`[${routeGroupKey}]There is no groupUrl in router`);
    }
  }

  return routesMap;
}

/**
 * Parse and join parent url with his subUrl
 * @param parentUrl
 * @param url
 */
function parseAndJoinUrl(parentUrl, url) {
  let fullUrl = "";

  if (parentUrl.startsWith("/")) {
    fullUrl += `${parentUrl}`;
  } else fullUrl += `/${parentUrl}`;

  if (url === "/") return fullUrl;

  if (fullUrl.endsWith("/")) {
    if (url.startsWith("/")) {
      fullUrl += url.slice(1);
    } else {
      fullUrl += url;
    }
  } else {
    if (url.startsWith("/")) {
      fullUrl += url;
    } else {
      fullUrl += `/${url}`;
    }
  }

  if (fullUrl.endsWith("/")) fullUrl = fullUrl.slice(0, fullUrl.length - 1);

  return fullUrl;
}
