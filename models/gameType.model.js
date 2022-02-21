const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	let user = sequelize.define('gameType', {
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
        icon: {
			type: DataTypes.STRING,
		},
        title: {
			type: DataTypes.STRING,
		},
        color: {
			type: DataTypes.STRING,
		},
	});
    return user;
};