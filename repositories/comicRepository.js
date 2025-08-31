import Comic from "../models/comicModel.js";

export const createComicInstance = async function (comicData) {
  try {
    const comic = await Comic.create({
      title: comicData.title,
      slug: comicData.slug,
      author: comicData.author,
      shortDescription: comicData.shortDescription,
      description: comicData.description,
      releaseDate: comicData.releaseDate,
      publisher: comicData.publisher,
      mainCover: comicData.mainCover,
      coverArt: comicData.coverArt,
      page_count: comicData.page_count,
      totalViewed: comicData.totalViewed,
    });
    return comic;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findComicByTitle = async function (title) {
  try {
    const comic = await Comic.findOne({where: {title: title} })
    return comic
  } catch (err) {
    throw new Error(err.message);
  }
}
