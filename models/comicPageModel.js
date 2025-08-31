import { DataTypes } from 'sequelize';
import { sequelize } from '../database/dbConnect.js';

const ComicPage = sequelize.define("ComicPage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  comicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Comics",
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  page: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['comicId', 'page'], // prevent duplicates for same comic
    },
  ],
});

export default ComicPage;
