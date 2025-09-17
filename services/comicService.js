import {
  createComicInstance,
  updateComic,
  findComicByTitle,
  findTrendingComicsLandingPage,
  findComicsSearchLandingPage,
  findComicsSearchOnlyLanding,
  findComicsByGenresOnlyLanding,
  findComicsBySearchAndGenresLanding,
  findLatestAddedComics,
  findComicsSearch,
  findComicsSearchWithGenre, 
  findComicBySlug
} from "../repositories/comicRepository.js";
import { findGenreByName } from "../repositories/genreRepository.js";
import { ErrorHandler } from "../middlewares/error.js";
import { capitalizeTrim } from "../utils/Capitalize_Trim.js";
import slug from "slugify";
import { pageCounter } from "../utils/page_count.js";
import { uploadComicImages } from "../utils/uploadComicCovers.js";
import { comicPagesUploader } from "../utils/comicPagesUploader.js";
import { removeComicFromStorage } from "../utils/removeComic.js";

export const createComic = async (
  comicData,
  genres,
  mainCover,
  coverArt,
  zip
) => {
  try {
    const requiredFields = [
      "title",
      "author",
      "shortDescription",
      "description",
      "releaseDate",
      "publisher",
    ];
    console.log(mainCover);

    // ✅ 1. Validate required fields
    const missingField = requiredFields.find(
      (field) => !comicData[field] || comicData[field].trim() === ""
    );
    if (missingField) {
      throw new Error(
        `Missing or invalid value for required field: ${missingField}`
      );
    }

    // ✅ 2. Trim and capitalize string values
    for (let key in comicData) {
      if (typeof comicData[key] === "string" && comicData[key] !== comicData.publisher) {
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
    const comicCovers = await uploadComicImages(comicData.title, {
      mainCoverPath: mainCover.path,
      coverArtPath: coverArt.path,
    });
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
    removeComicFromStorage(mainCover, coverArt, zip);

    return createdComic;
  } catch (err) {
    throw new Error(err);
  }
};

export const updateComics = async (
  comicId,
  comicData,
  genres,
  mainCover,
  coverArt,
  zip
) => {
  try {
    for (let key in comicData) {
      if (typeof comicData[key] === "string" && key !== "publisher") {
        comicData[key] = capitalizeTrim(comicData[key]);
      }
    }

    if (comicData.title) {
      comicData.slug = slug(comicData.title, { lower: true });
    }

    if (zip) {
      comicData.page_count = pageCounter(zip.path);
    }

    if (mainCover || coverArt) {
      const comicCovers = await uploadComicImages(comicData.title, {
        mainCoverPath: mainCover?.path,
        coverArtPath: coverArt?.path,
      });

      if (mainCover) comicData.mainCover = comicCovers.mainCover.url;
      if (coverArt) comicData.coverArt = comicCovers.coverArt.url;
    }

    const updatedComic = await updateComic(comicId, comicData);

    if (zip) {
      await comicPagesUploader({
        comicId: updatedComic.id,
        comicTitle: comicData.title,
        zipFilePath: zip.path,
      });
    }

    if (genres) {
      const genreArray = Array.isArray(genres) ? genres : [genres];

      await updatedComic.setGenres([]); 

      for (const genreName of genreArray) {
        const genre = await findGenreByName(genreName);
        if (!genre) throw new Error(`Genre not found: ${genreName}`);
        await updatedComic.addGenre(genre);
      }
    }

    if (mainCover || coverArt || zip) {
      removeComicFromStorage(
        mainCover || undefined,
        coverArt || undefined,
        zip || undefined
      );
    }

    return updatedComic;
  } catch (err) {
    throw new Error(err.message);
  }
};


//landing page
export const trendingComics = async () => {
  try {
    const comics = await findTrendingComicsLandingPage();
    if (!comics || comics.length === 0) {
      throw new Error("No comics found");
    }
    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const lookUpAComic = async (search, genres) => {
  try {
    if (search && search.trim() != "") {
      search = search.trim();
    }
    if (!genres) {
      genres = [];
    } else if (!Array.isArray(genres)) {
      genres = [genres];
    }

    if (search && search.trim() !== "" && genres && genres.length > 0) {
      const comics = await findComicsBySearchAndGenresLanding(search, genres);

      const filteredComics = comics.filter((comic) => {
        const comicGenres = comic.Genres.map((g) => g.genre);
        return genres.every((g) => comicGenres.includes(g));
      });

      if (!filteredComics || filteredComics.length === 0) {
        throw new Error("No comics found with the given search and genres.");
      }

      return filteredComics;
    } else if (search && search.trim() !== "") {
      const comics = await findComicsSearchOnlyLanding(search);
      if (!comics || comics.length === 0) {
        throw new Error("No comics found with the given search.");
      }
      return comics;
    } else if (genres && genres.length > 0) {
      const comics = await findComicsByGenresOnlyLanding(genres);

      if (!comics || comics.length === 0) {
        throw new Error("No comics found with the given genres.");
      }
      return comics;
    } else {
      const comic_search = await findComicsSearchLandingPage();
      return comic_search;
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

//user view latest comics
export const getLatestComics = async () => {
  try{
    const latestComics = await findLatestAddedComics();
    console.log(latestComics);
    if (!latestComics || latestComics.length === 0) {
      throw new Error("No comics found");
    }
    return latestComics;
  } catch (err) {
    throw new Error("No comics found");
  }
};

//user view search
export const getComics = async (search, genres, pageNum) => {
  try {
    if (!search) {
      throw new Error("Enter Search");
    }
    console.log(pageNum);
    if (!genres) {
      genres = []; 
    } else if (!Array.isArray(genres)) {
      genres = [genres]; 
    }
    console.log(genres);
    const limit = 12;

    if (
      search &&
      search.trim() !== "" &&
      genres &&
      genres.length > 0 &&
      pageNum
    ) {
      const comics = await findComicsSearchWithGenre(
        search,
        limit,
        pageNum,
        genres
      );
      const filteredComics = comics.filter((comic) => {
        const comicGenres = comic.Genres.map((g) => g.genre);
        return genres.every((g) => comicGenres.includes(g));
      });

      if (!filteredComics || filteredComics.length === 0) {
        throw new Error("No comics found with the given search and genres.");
      }

      return filteredComics;
    }

    if (search && genres.length > 0 && !pageNum) {
      const comics = await findComicsSearchWithGenre(search, limit, 1, genres); 
      const filteredComics = comics.filter((comic) => {
        const comicGenres = comic.Genres.map((g) => g.genre);
        return genres.every((g) => comicGenres.includes(g));
      });

      if (!filteredComics || filteredComics.length === 0) {
        throw new Error("No comics found with the given search and genres.");
      }

      return filteredComics;
    }

    if (search && genres.length === 0 && pageNum) {
      const comics = await findComicsSearch(search, limit, pageNum);

      if (!comics || comics.length === 0) {
        throw new Error("No comics found with the given search.");
      }

      return comics;
    }

    const comics = await findComicsSearch(search, limit, 1); 
    if (!comics || comics.length === 0) {
      throw new Error("No comics found with the given search.");
    }

    return comics;
  } catch (err) {
    throw new Error(err.message);
  }
};

//comic view
export const getComicBySlug = async (slug) => {
  try {
    if (!slug) {
      throw new Error("Cannot access comic"); 
    }
    const comic = await findComicBySlug(slug);
    if (!comic) {
      throw new Error("Comic does not exist."); 
    }
    return comic;
  } catch (err) {
    throw new Error(err.message);
  }
};