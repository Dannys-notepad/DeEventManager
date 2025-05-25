const { DataTypes } = require("sequelize");
const sequelize = require("./src/config/sequelize.db");

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STIRNG,
            unique: true,
            allowNull: false,
            validate: {isEmail: true}
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        twoFactorSecret: DataTypes.STRING,
        provider: DataTypes.ENUM('local', 'goolge'),
        socialId: DataTypes.STIRNG,
        
    })
}