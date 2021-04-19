'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('Users', {
      username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      credits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      votes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      optout: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.dropTable('Users');
  }
};