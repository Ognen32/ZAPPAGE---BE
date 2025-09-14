import catchAsyncError from "../middlewares/catchAsyncError.js";
import {createComic} from '../services/comicService.js';
import fs from 'fs';

export const handleCreateComic = async (req, res) => {
    try{
        const {
            title,
            author,
            shortDescription,
            description,
            releaseDate,
            publisher,
            page_count,
        } = req.body;

        const comicData = {
            title,
            author,
            shortDescription,
            description,
            releaseDate,
            publisher,
            page_count,
        };
          const genres = req.body.genre;
          const mainCover = req.files.mainCover[0];
          const coverArt = req.files.coverArt[0];
          const zip = req.files.comicZip[0];
        //   fs.unlinkSync(req.files.mainCover[0].path);
        //   fs.unlinkSync(req.files.coverArt[0].path);
          
    const comic = await createComic(comicData, genres, mainCover, coverArt, zip )

    res.status(201).json({msg: comic})
        
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}