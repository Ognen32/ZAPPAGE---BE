import cloudinary from '../config/cloudinarySetup.js'; // your configured cloudinary instance
import slugify from 'slugify'; // to make folder/comic titles URL-safe
import path from 'path';

export const uploadComicImages = async (comicTitle, { mainCoverPath, coverArtPath }) => {
  const comicSlug = slugify(comicTitle, { lower: true, strict: true });

  // Helper to check PNG format
  const checkIsPng = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.png') {
      throw new Error(`File ${filePath} must be a PNG image.`);
    }
  };

  const uploads = {};

  if (mainCoverPath) {
    checkIsPng(mainCoverPath);
    uploads.mainCover = await cloudinary.uploader.upload(mainCoverPath, {
      public_id: `Comics/${comicSlug}/mainCover`,
      folder: `Comics/${comicSlug}`,
    });
  }

  if (coverArtPath) {
    checkIsPng(coverArtPath);
    uploads.coverArt = await cloudinary.uploader.upload(coverArtPath, {
      public_id: `Comics/${comicSlug}/coverArt`,
      folder: `Comics/${comicSlug}`,
    });
  }

  return uploads; // contains URLs, public_ids, etc.
};
