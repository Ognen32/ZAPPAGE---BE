import catchAsyncError from "../middlewares/catchAsyncError.js";
import {createComic, trendingComics, lookUpAComic, updateComics, getLatestComics} from '../services/comicService.js';
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
};

export const updateComicHandler = async (req, res) => {
  try{
    const comicId = req.params.id; 
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

   const mainCover = req.files?.mainCover?.[0] || null;
const coverArt = req.files?.coverArt?.[0] || null;
const zip = req.files?.comicZip?.[0] || null;

    const updatedComic = await updateComics(
      comicId,
      comicData,
      genres,
      mainCover,
      coverArt,
      zip
    );

    res.status(200).json({ msg: updatedComic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//landing page
export const getTrendingComicsHandler = async (req, res) => {
  try {
    const data = await trendingComics();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const lookUpAComicHandler = async (req, res) => {
  try {
    const search = req.query.search || req.body.search;
    const genres = req.body.genre;
    const data = await lookUpAComic(search, genres);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//user view latest comics
export const getLatestComicsHandler = async (req, res) => {
  try {
    const data = await getLatestComics();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};