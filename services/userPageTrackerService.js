import {findUserPage, createUserPage, updateUserPage} from '../repositories/userPageTrackerRepository.js';
import {findComicBySlug} from '../repositories/comicRepository.js';
import {findComicPage} from '../repositories/comicPageRepository.js';


export const getUserPages = async (userId, slug) => {
  try {
    if (!userId || !slug) {
      throw new Error("Must include all fields!");
    }

    const userComicProgress = await findUserPage(userId, slug);
    console.log(userComicProgress)
    const response = {
      currentUserPage: 1,
      pages: [],
      totalPages: 0,
      comicTitle: "",
    };

    if (!userComicProgress) {
      const comic = await findComicBySlug(slug);
      response.totalPages = comic.page_count;
      response.comicTitle = comic.title;
      await createUserPage(userId, comic.id, 1);

      for (let i = 1; i < 3 && i <= comic.page_count; i++) {
        const page = await findComicPage(comic.id, i);
        if (page) {
          response.pages.push({
            page: page.page,
            pageUrl: page.pageUrl
          });
        }
      }

      return response;
    }

    // User progress exists, prepare sliding window pages

    response.currentUserPage = userComicProgress.currentPageNumber;
    response.totalPages = userComicProgress.Comic.page_count;
    response.comicTitle = userComicProgress.Comic.title;

    const currentPageNum = response.currentUserPage;
    const total = response.totalPages;

    // Determine which pages to fetch: prev, current, next within boundaries
    const pagesToFetch = [];

    if (currentPageNum > 1) pagesToFetch.push(currentPageNum - 1); // prev page
    pagesToFetch.push(currentPageNum);                              // current page
    if (currentPageNum < total) pagesToFetch.push(currentPageNum + 1); // next page

    // Fetch pages concurrently for efficiency
    const pages = await Promise.all(
      pagesToFetch.map(pageNum => findComicPage(userComicProgress.comicId, pageNum))
    );

    // Filter out any null results (in case a page is missing)
    pages.forEach(page => {
      if (page) {
        response.pages.push({
          page: page.page,
          pageUrl: page.pageUrl
        });
      }
    });

    return response;  

  } catch (err) {
    throw new Error(err.message);
  }
};


export const updateUserCurrentPage = async (userId, slug, newPageNumber) => {
  try {
    if (!userId || !slug || !newPageNumber) {
      throw new Error("Must include all fields!");
    }

    // Get the comic by slug
    const comic = await findComicBySlug(slug);
    console.log(comic)
    if (!comic) {
      throw new Error("Comic not found.");
    }

    if (newPageNumber < 1 || newPageNumber > comic.page_count) {
      throw new Error(`Page number must be between 1 and ${comic.page_count}.`);
    }

    // Update the user's page using comic.id
    const updatedCount = await updateUserPage(userId, comic.id, newPageNumber);

    if (updatedCount === 0) {
      throw new Error("User page progress not found or update failed.");
    }

    return { message: "User current page updated successfully." };
  } catch (err) {
    throw new Error(err.message);
  }
};
  