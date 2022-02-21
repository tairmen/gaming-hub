const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	let model = sequelize.define('device', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        fcmToken: {
			type: DataTypes.STRING,
		},
	});
    model.belongsTo(sequelize.models.user, { foreignKey: { allowNull: false }});
    return model;
};