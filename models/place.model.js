const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	let user = sequelize.define('place', {
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
        lat: {
			type: DataTypes.FLOAT,
		},
        lon: {
			type: DataTypes.FLOAT,
		},
        price: {
			type: DataTypes.STRING,
		},
        address: {
			type: DataTypes.STRING,
		},
        images: {
			type: DataTypes.JSON,
		},
        phone: {
			type: DataTypes.STRING,
		},
        description: {
			type: DataTypes.TEXT,
		},
	});
    model.belongsTo(sequelize.models.user, { foreignKey: { allowNull: true }});
    return user;
};