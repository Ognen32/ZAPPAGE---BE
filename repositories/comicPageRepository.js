import ComicPage from '../models/comicPageModel.js';

export const createComicPage = async (comicId, page, pageUrl) => {
  try {
    return await ComicPage.create({ comicId, page, pageUrl });
  } catch (err) {
    console.error("Error creating comic page:", err.message);
    throw new Error("Failed to create comic page.");
  }
};
