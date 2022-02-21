let f_routes = ["add"]

module.exports = (models) => {
    let routes = [];
    f_routes.forEach(el => {
        routes.push(require(`./${el}`)(models))
    })
    return routes;
};