let data_routes = require("./providers");
let new_data_routes = require("./newProviders");
const config = require("../config/default.json");

module.exports = (models) => {
    let routes = [];
    routes = routes.concat(data_routes(models));
    routes = routes.concat(new_data_routes(models));
    return routes;
};