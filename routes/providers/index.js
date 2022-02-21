let f_routes = ["getById", "list"]

module.exports = (models) => {
    let routes = [];
    f_routes.forEach(el => {
        routes.push(require(`./${el}`)(models))
    })
    return routes;
};