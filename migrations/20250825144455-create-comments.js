"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Comments", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    comicId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Comics",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    text: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn("NOW"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Comments");
}