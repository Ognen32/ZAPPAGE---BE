import {createComicInstance, findComicByTitle} from '../repositories/comicRepository.js';
import {findGenreByName} from '../repositories/genreRepository.js';
import { ErrorHandler } from '../middlewares/error.js';
import {capitalizeTrim} from '../utils/Capitalize_Trim.js';
import slug from 'slugify';
import {pageCounter} from '../utils/page_count.js';
import {uploadComicImages} from '../utils/uploadComicCovers.js';
import { comicPagesUploader } from '../utils/comicPagesUploader.js';
import { removeComicFromStorage } from '../utils/removeComic.js';




export const createComic = async (comicData, genres, mainCover, coverArt, zip) => {
  try{
  const requiredFields = [
    'title',
    'author',
    'shortDescription',
    'description',
    'releaseDate',
    'publisher',
  ];
  console.log(mainCover)

  // ✅ 1. Validate required fields
  const missingField = requiredFields.find(field => !comicData[field] || comicData[field].trim() === '');
  if (missingField) {
    throw new Error(`Missing or invalid value for required field: ${missingField}`);
  }

  // ✅ 2. Trim and capitalize string values
  for (let key in comicData) {
    if (typeof comicData[key] === 'string') {
      comicData[key] = capitalizeTrim(comicData[key]);
    }
  }

  // ✅ 3. Add slug and override page count
  comicData.slug = slug(comicData.title, { lower: true });
  
  // ✅ 4. Count the pages of the comic

  comicData.page_count = pageCounter(zip.path);
  console.log(comicData.page_count);

  // ✅ 5. Check for duplicate comic
  const existingComic = await findComicByTitle(comicData.title);
  if (existingComic) {
    throw new Error("Comic already exists with this exact title");
  }

  // ✅ 6. Check & Upload Cover Arts
  if (!mainCover || !coverArt) throw new Error("Must enter both cover Arts!");
  const comicCovers = await uploadComicImages(comicData.title, { mainCoverPath: mainCover.path, coverArtPath: coverArt.path });
  console.log(comicCovers);
  comicData.mainCover = comicCovers.mainCover.url;
  comicData.coverArt = comicCovers.coverArt.url;


  // ✅ 7. Create the comic
  const createdComic = await createComicInstance(comicData);
  console.log("Comic created:", createdComic);

  // ✅ 9. Upload comic pages (AFTER comic is created)
  await comicPagesUploader({
  comicId: createdComic.id,
  comicTitle: comicData.title,
  zipFilePath: zip.path,
});

  // ✅ 10. Handle genres (future expansion)
  if (genres) {
    const genreArray = Array.isArray(genres) ? genres : [genres];
    console.log("Genres:", genreArray);

    for (const genreName of genreArray) {
      const genre = await findGenreByName(genreName);
    
      if (!genre) {
        throw new Error(`Genre not found: ${genreName}`);
      }
    
      await createdComic.addGenre(genre); // Note: singular 'addGenre'
    }
  }

  // ✅ 11. Remove Stored Files
  removeComicFromStorage(mainCover, coverArt, zip)

  return createdComic;
} catch(err) {
  throw new Error(err)
}
};