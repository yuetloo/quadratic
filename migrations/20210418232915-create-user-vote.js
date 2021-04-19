'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Votes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      votedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate : Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Votes');
  }
};