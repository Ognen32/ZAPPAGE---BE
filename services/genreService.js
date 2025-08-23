import {createGenre, findGenreByName, findAllGenres} from '../repositories/genreRepository.js';
import {capitalizeTrim} from '../utils/Capitalize_Trim.js';
import {ValidationError} from '../utils/error.js';

export const createGenres = async function (name) {
  if (!name) {
    throw new ValidationError("Name must be entered");
  }

  const trimmedName = capitalizeTrim(name);
  const existingGenre = await findGenreByName(trimmedName);

  if (existingGenre) {
    throw new ValidationError("Genre already exists");
  }

  return createGenre(trimmedName);
};

export const getAllGenres = async function () {
  const allGenres = await findAllGenres();
  
  if (!allGenres.length) {
    throw new ValidationError("No genres found");
  }

  return allGenres;
};