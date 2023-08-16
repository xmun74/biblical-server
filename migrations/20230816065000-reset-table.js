"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // meetings 테이블에 tags 컬럼 추가
    return queryInterface.addColumn("meetings", "tags", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("meetings", "tags");
  },
};
