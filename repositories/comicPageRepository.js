import ComicPage from '../models/comicPageModel.js';
import Comic from '../models/comicModel.js';

export const createComicPage = async (comicId, page, pageUrl) => {
  try {
    return await ComicPage.create({ comicId, page, pageUrl });
  } catch (err) {
    console.error("Error creating comic page:", err.message);
    throw new Error("Failed to create comic page.");
  }
};

export const findComicPage = async (comicId, pageNum) => {
  try {
    return await ComicPage.findOne({
      where: { comicId: comicId, page: pageNum },
      attributes: ["page", "pageUrl"],
      include: { 
        model: Comic,
        attributes: ["page_count"] },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};