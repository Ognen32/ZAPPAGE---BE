import { DataTypes } from 'sequelize'; // Importing and using datatypes from sequelize
import { sequelize } from '../database/dbConnect.js';


const Comic = sequelize.define("Comic", {
    id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            len: {
                args: [3,100],
                msg: "Title must be between 3 and 100 characters."
            }
        }
    },
    slug: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: {
                args: [3,100],
                msg: "Author must be between 3 and 100 characters."
            }
        }
    },
    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [50,250],
                msg: "Short description must be between 50 and 250 characters long."
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: {
                args: [50,1000],
                msg: "Description must be between 50 and 1000 characters long."
            }
        }
    },

    releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                args: true,
                msg: "Release date must be a valid date."
            },
            isInPast(value) {
                if (new Date(value) > new Date()) {
                    throw new Error("Release date cannot be in the future.");
                }
            }
        }
    },

    publisher: {
        type: DataTypes.ENUM("Marvel", "DC Comics"),
        allowNull: false,
        defaultValue: 'Marvel',
    },

    mainCover: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coverArt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    page_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalViewed: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    }
}, {timestamps:true})