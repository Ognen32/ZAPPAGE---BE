import { DataTypes } from "sequelize"; 
import { sequelize } from "../database/dbConnect.js";

const Favourite = sequelize.define(
  "Favourite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    comicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Comics",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "comicId"],
      },
    ],
  }
);

export default Favourite;
