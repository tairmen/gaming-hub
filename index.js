"use strict";
const fs = require('fs')
fs.rmSync('./.adminbro', { recursive: true, force: true })
const config = require("./config/default.json");
const Hapi = require("@hapi/hapi");
const Boom = require("@hapi/boom");
const Inert = require("@hapi/inert");
const Path = require('path');
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Pack = require("./package");
const db = require("./models");
const routes = require("./routes");
const models = db.models;
const AdminBro = require('admin-bro');
const AdminBroPlugin = require('@admin-bro/hapi');
const AdminBroSequelize = require('@admin-bro/sequelize');
const uploadFeature = require('@admin-bro/upload')
AdminBro.registerAdapter(AdminBroSequelize);

const { ACTIONS } = require('admin-bro');

const launchServer = async function () {
  const server = Hapi.Server({
    port: config.app.port,
    routes: {
      cors: {
        origin: ["*"], // an array of origins or 'ignore'
        credentials: true, // boolean - 'Access-Control-Allow-Credentials'
      },
      files: {
        relativeTo: Path.join(__dirname, `public`)
      }
    }
  });

  console.log("--- DB SYNC START ----");
  await db.sync({ force: config.app.force_sync, alter: config.app.alter_sync });
  console.log("--- DB SYNC END ----");

  const swaggerOptions = {
    info: {
      title: "API Documentation",
      version: Pack.version,
    },
    jsonPath: `/api/swagger.json`,
    documentationPath: `/api/documentation`,
    swaggerUIPath: `/api/swaggerui/`,
    schemes: ["https", "http"],
    grouping: "tags",
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  await server.register({
    plugin: require("hapi-i18n"),
    options: {
      locales: ["ua", "en", "ru"],
      directory: __dirname + "/locales",
      languageHeaderField: "language",
      defaultLocale: config.app.language,
    },
  });

  const createUpdatedfield = async (request, context) => {
    // checking if object doesn't have any errors or is a delete action
    if("userId" in request.payload) {
      request.payload.userId = context.currentAdmin.id;
    }
    return request;
  }

  ACTIONS.edit.before = createUpdatedfield;
  ACTIONS.new.before = createUpdatedfield;

  let resources = [];

  let no_update_models = [];

  for (let [key, model] of Object.entries(models)) {
    let res = {};
    res.resource = model;
    let fnd_m = no_update_models.find(el => el == key);
    let actions = {
        new: {isAccessible: ({ currentAdmin }) => {
          return currentAdmin && currentAdmin.role == 'admin' && !fnd_m ? true : false;
        }},
        edit: {isAccessible: ({ currentAdmin }) => {
          return currentAdmin && currentAdmin.role == 'admin' && !fnd_m ? true : false;
        }},
        delete: {isAccessible: ({ currentAdmin }) => {
          return currentAdmin && currentAdmin.role == 'admin' && !fnd_m ? true : false;
        }}
    };

    if (key == 'provider') {
      const createLog = async (originalResponse, request, context) => {
        // checking if object doesn't have any errors
        if (request.method === 'post' && originalResponse.record && !Object.keys(originalResponse.record.errors).length) {
          let fnd = await models.history.findAll({
            where: { providerId: context.record.params.id },
            limit: 1,
            order: [['createdAt', 'DESC']]
          });
          if (!fnd || fnd.length == 0 || fnd[0].statusId != context.record.params.statusId) {
            await models.history.create({
              providerId: context.record.params.id,
              userId: context.currentAdmin.id,
              statusId: context.record.params.statusId,
            })
          }
        }
        return originalResponse
      }
      actions.new.after = createLog;
      actions.edit.after = createLog;
    }

    let prpts = {};

    for (let pr in model.rawAttributes) {
        let type = model.rawAttributes[pr].type.key;
        if (type == "TEXT") {
            prpts[pr] = { type: 'textarea' };
        }
    }

    res.options = {
      actions: actions,
      properties: prpts
    }

    if (key == 'provider') {
      res.features = [uploadFeature({
        provider: { local: { bucket: `public` } },
        properties: {
          key: 'logo'
        }
      })]
    }

    resources.push(res);
  }

  const adminBroOptions = {
    resources: resources,
    rootPath: `/admin`,
    loginPath: `/admin/login`,
    logoutPath: `/admin/logout`,
    dashboard: {
      component: AdminBro.bundle('./plugins/dashboard')
    },
    auth: {
      authenticate: async (email, password) => {
        let res = await models.user.findAll({
          raw: true,
          nest: true,
          where: {
            email: email,
            password: password
          }
        });
        if (res && res.length > 0) {
          return res[0];
        }
        return null
      },
      strategy: 'session',
      cookieName: 'adminBroCookie',
      cookiePassword: config.app.cookiePassword,
    }
  }
  await server.register({
    plugin: AdminBroPlugin,
    options: adminBroOptions,
  });

  let rts = routes(models);

  rts.push({
    method: 'GET',
    path: `/public/{filename}`,
    handler: {
      file: function (request) {
        return request.params.filename;
      }
    }
  })

  server.route(rts);

  await server.start();
  console.log(`Server started at ${server.info.uri}`);
};

launchServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
