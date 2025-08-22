import "dotenv/config"; 
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres', 
});


export default sequelize;
const connectDB = async () => {
  try {
    await sequelize.authenticate(); 
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

export { sequelize, connectDB };