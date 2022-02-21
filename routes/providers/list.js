const Joi = require('joi');
const { Op } = require("sequelize");
const search_cols = ["name", "pseudonyms", "coverage", "description"];

module.exports = (models) => {
    let route_obj = {
        method: "GET", path: "/api", config: {
            auth: false, tags: ['api', 'providers'], validate: {
                headers: Joi.object().keys({
                    language: Joi.string().allow(null, ''),
                }).unknown(true),
                query: Joi.object({
                    limit: Joi.number().allow(null, ''),
                    offset: Joi.number().allow(null, ''),
                    sort: Joi.string().allow(null, ''),
                    direction: Joi.string().allow(null, ''),
                    search: Joi.string().allow(null, ''),
                    mode: Joi.number().allow(null, ''),
                })
            }
        },
        handler: async function (request, h) {
            let limit = request.query.limit ? request.query.limit : 100;
            let offset = request.query.offset ? request.query.offset : 0;
            let sort = request.query.sort ? [request.query.sort] : ['createdAt'];
            if (request.query.direction) {
                sort.push(request.query.direction);
            } else {
                sort.push('asc');
            }
            let where = {};
            if (request.query.search) {
                if (request.query.mode) {
                    where = {
                        code: request.query.search
                    }
                } else {
                    models.searchHistory.create({
                        text: request.query.search,
                        ip: request.info.remoteAddress
                    })
                    let wcodn = {};
                    search_cols.forEach(el => {
                        wcodn[el] = {
                            [Op.iLike]: `%${request.query.search}%`
                        }
                    })
                    where = {
                        [Op.or]: wcodn
                    }
                }
                
            }
            if (sort && sort.length > 0 && sort[0] == "priority") {
                sort.unshift({
                    model: models.marker
                })
            }
            let attrs = request.query.mode ? [
                'code', 'statusId'
            ] : undefined;
            let res = await models.provider.findAll({
                raw: true,
                nest: true,
                limit: limit,
                offset: offset,
                where: where,
                order: [sort],
                attributes: attrs,
                include: [
                    {
                        model: models.status
                    }, {
                        model: models.billing
                    }, {
                        model: models.marker,
                    }
                ]
            });
            if (res && res.length > 0) {
                res.forEach(element => {
                    element.logo = `https://api.providex.net/providers/public/${element.logo}`;
                });
            }
            return h.response({
                message: request.i18n.__('Success'), status: true, items: res
            });
        }
    }
    return route_obj;
};