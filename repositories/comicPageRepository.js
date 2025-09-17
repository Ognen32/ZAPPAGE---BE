import ComicPage from '../models/comicPageModel.js';
import { v2 as cloudinary } from "cloudinary";

export const createComicPage = async (comicId, page, pageUrl) => {
  try {
    return await ComicPage.create({ comicId, page, pageUrl });
  } catch (err) {
    console.error("Error creating comic page:", err.message);
    throw new Error("Failed to create comic page.");
  }
};

export const deleteComicPages = async (comicId) => {
  try {
    const pages = await ComicPage.findAll({ where: { comicId } });

    for (const page of pages) {
      if (page.url) {
        const publicId = extractPublicIdFromUrl(page.url);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await ComicPage.destroy({ where: { comicId } });

    console.log(`✅ Deleted old pages for comicId=${comicId}`);
  } catch (err) {
    console.error("❌ Error deleting comic pages:", err);
    throw new Error("Failed to delete old comic pages");
  }
};

const extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const fileWithExt = parts[parts.length - 1];
    const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf(".")); 
    return publicId ? `${parts.slice(-2, -1)[0]}/${publicId}` : null;
  } catch {
    return null;
  }
};
