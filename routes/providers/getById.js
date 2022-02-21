const Joi = require('joi');

module.exports = (models) => {
    let route_obj = {
        method: "GET", path: "/api/{id}", config: {
            auth: false, tags: ['api', 'providers'], validate: {
                headers: Joi.object().keys({
                    language: Joi.string().allow(null, ''),
                }).unknown(true),
                params: Joi.object({
                    id: Joi.number()
                })
            }
        },
        handler: async function (request, h) {
            let res = await models.provider.findAll({
                raw: true,
                nest: true,
                where: {id: request.params.id},
                include: [
                    models.status, models.billing
                ]
            });
            if (res && res.length > 0) {
                res.forEach(element => {
                    element.logo = `api.providex.net/providers/public/${element.logo}`;
                });
            }
            return h.response({
                message: request.i18n.__('Success'), status: true, items: res
            });
        }
    }
    return route_obj;
};