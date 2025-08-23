import { DataTypes } from "sequelize";
import { sequelize } from "../database/dbConnect.js";

const Genre = sequelize.define(
  "Genre",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    genre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [3, 20],
          msg: "Genre name must be between 3 to 20 characters.",
        },
      },
    },
  },
  { timestamps: true }
);
export default Genre;
