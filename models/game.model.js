const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	let user = sequelize.define('game', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
		name: {
			type: DataTypes.STRING,
		},
        duration: {
			type: DataTypes.STRING,
		},
        startDate: {
			type: DataTypes.DATE,
		},
        gameState: {
			type: DataTypes.STRING,
		},
        description: {
			type: DataTypes.TEXT,
		},
        players: {
			type: DataTypes.TEXT,
		},
	});
    model.belongsTo(sequelize.models.user, { foreignKey: { allowNull: false }});
    model.belongsTo(sequelize.models.gameType, { foreignKey: { allowNull: false }});
    model.belongsTo(sequelize.models.place, { foreignKey: { allowNull: true }});
    return user;
};