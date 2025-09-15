import {
  toggleFavouriteComic,
  getFavouriteComics,
  getSortedFavourites,
  checkFavourite
} from "../services/favouritesService.js";


export const handleCheckFavouriteComic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { comicId } = req.body;

    const isFavourite = await checkFavourite(userId, comicId);

    res.status(200).json({ exists: isFavourite });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handletoggleFavouriteComic = async (req, res) => {
  const userId = req.body.userId;
  const comicId = req.body.comicId;
  const token_data = req.user;

  const favourite = await toggleFavouriteComic(req.user.id, comicId);

  res.status(201).json(favourite);
};

export const handleGetFavouriteComics = async (req, res) => {
  const token_data = req.user;
  const favourites = await getFavouriteComics(req.user.id);

  res.status(200).json(favourites);
};

export const getSortedFavouritesHanlder = async (req, res) => {
  const token_data = req.user;
  console.log(token_data);

  const favourites = await getSortedFavourites(req.user.id);

  res.status(200).json(favourites);
};
