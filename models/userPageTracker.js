import { DataTypes } from "sequelize";
import { sequelize } from "../database/dbConnect.js";

const UserPageTracker = sequelize.define("UserPageTracker", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id",
        },
        onDelete: "CASCADE"
    },
    comicId: {  // fixed typo from 'comidId'
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Comics",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    currentPageNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ["userId", "comicId"]
        }
    ]
});


export default UserPageTracker