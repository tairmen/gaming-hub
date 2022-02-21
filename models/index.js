const config = require("../config/default.json");
const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

let sequelize = new Sequelize(config.postgres.database, config.postgres.user, config.postgres.password, {
    dialect: 'postgres',
    host: config.postgres.host,
    port: config.postgres.port
})

const modelDefiners = [
    require('./user.model'),
    require('./device.model'),
    require('./gameType.model'),
    require('./place.model'),
    require('./game.model')
];

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

sequelize.models.device.belongsToMany(sequelize.models.place, { through: 'place_gameType' });
sequelize.models.abonent.belongsToMany(sequelize.models.gameType, { through: 'place_gameType' });

module.exports = sequelize;