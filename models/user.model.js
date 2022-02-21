const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	let user = sequelize.define('user', {
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
        email: {
			type: DataTypes.STRING,
            unique: true
		},
        password: {
			type: DataTypes.STRING,
		},
        birthDate: {
			type: DataTypes.DATE,
		},
        nickname: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING,
        }
	});
    return user;
};