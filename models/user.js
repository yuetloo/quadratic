'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  User.init({
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    optout: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate : DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
  });

  return User;
};