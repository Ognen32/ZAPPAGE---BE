import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import authRoutes from "./routes/authRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import comicRoutes from './routes/comicRoutes.js';
import favouritesRoutes from './routes/favouritesRoutes.js';
import userPageTrackerRoutes from './routes/userPageTracker.js';
// import transcationRoutes from './routes/transcationRoutes.js';
// import cartRoutes from './routes/cartRoutes.js';
// import transcationItemRoutes from './routes/transcationItemRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import { connectDB } from "./database/dbConnect.js";
import bodyParser from 'body-parser';
import './models/associations.js'; // Ќоке се користи релациони бази мора вака да се направи нов фајл кај шо ќе ги поврзи. еднаш мора да се вчиат па да се напрај relationship

dotenv.config({ path: './config/config.env' });

const app = express();

// app.use(cors()); // For cross origin requests
app.use(cors({
    origin: 'http://localhost:5173', // e.g., http://localhost:5173 for Vite
    credentials: true
  }));
app.use(express.json()); // For parsing incoming json requests
app.use(cookieParser()); // For parsing cookies incoming json requests
app.use(express.urlencoded({ extended: true })); // For parsing url encoded data
//app.use(bodyParser.urlencoded({ extended: false }))

// Defining routes and giving them a path to connect to the routes
app.use('/api', authRoutes);
app.use('/api', genreRoutes);
app.use('/api', comicRoutes);
app.use('/api', favouritesRoutes);
app.use('/api', userPageTrackerRoutes);
// app.use("/api", transcationRoutes);
// app.use("/api", cartRoutes);
// app.use("/api", transcationItemRoutes);
app.use("/api", commentRoutes);

app.use(errorMiddleware);

connectDB();

export default app;