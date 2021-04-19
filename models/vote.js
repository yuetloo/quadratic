'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Vote.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    votedBy: {
      type: DataTypes.STRING,
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
    modelName: 'Vote',
  });
  return Vote;
};