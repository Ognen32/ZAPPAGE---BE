import express from 'express';
import {handleUserPages, handleUpdateUserPage} from '../controllers/userPageTrackerController.js';
import { isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.get("/comicRead/:slug",isAuthenticated,handleUserPages);
router.post("/comicRead/:slug/updateCurrentPage",isAuthenticated,handleUpdateUserPage);


export default router;