const Joi = require('joi');

module.exports = (models) => {
    let route_obj = {
        method: "POST", path: "/api/new", config: {
            auth: false, tags: ['api', 'new'], validate: {
                headers: Joi.object().keys({
                    language: Joi.string().allow(null, ''),
                }).unknown(true),
                payload: Joi.object({
                    name: Joi.string(),
                    city: Joi.string()
                })
            }
        },
        handler: async function (request, h) {
            let res = await models.newProvider.create({
                name: request.payload.name,
                city: request.payload.city
            });
            return h.response({
                message: request.i18n.__('Success'), status: true, items: res
            });
        }
    }
    return route_obj;
};