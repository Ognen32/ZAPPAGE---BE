import { DataTypes } from "sequelize";
import { sequelize } from "../database/dbConnect.js";

const ComicGenre = sequelize.define(
  "ComicGenre",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Genres", // ✅ matches your table name
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
        fields: ['comicId', 'genreId'], // ✅ Ensures no duplicate comic-genre pairs
      },
    ],
  }
);

export default ComicGenre;
