import {createGenres, getAllGenres} from '../services/genreService.js';

export const handleCreateGenre = async (req, res) => {
  const name = req.body.name;
  const newGenre = await createGenres(name);

  res.status(201).json(newGenre);
};

export const handleGetGenres = async (req, res) => {
  const genres = await getAllGenres(req);

  res.status(200).json(genres);
};