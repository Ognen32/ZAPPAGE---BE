import { DataTypes } from "sequelize";
import { sequelize } from "../database/dbConnect.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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
    text: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 150],
      },
    },
  },
  { timestamps: true }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.User, { foreignKey: "userId" });
  Comment.belongsTo(models.Comic, { foreignKey: "comicId" });
};


export default Comment;
