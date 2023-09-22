"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("meetings", "hostId", {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("meetings", "hostId", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
