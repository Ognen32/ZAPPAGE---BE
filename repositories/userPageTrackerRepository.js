import UserPageTracker from '../models/userPageTracker.js';
import Comic from '../models/comicModel.js';


export const createUserPage = async (userId, comicId, currentPageNumber) => {
    try {
      return await UserPageTracker.create({
        userId,
        comicId,
        currentPageNumber,
      });
    } catch (err) {
      throw new Error(err.message);
    }
  };



export const findUserPage = async function (userId, slug) {
    try {
      const userPage = await UserPageTracker.findOne({
        where: { userId},
        include: [
          {
            model: Comic,
            attributes: ['page_count', 'slug'],
            as: "Comic",
            where: {
                slug:slug
            }
          }
        ],
        attributes: ["comicId", "currentPageNumber"]
      });
  
      return userPage;
    } catch (err) {
      throw new Error(err.message);
    }
  };


  export const updateUserPage = async (userId, comicId, newPageNumber) => {
    try {
      return await UserPageTracker.update(
        { currentPageNumber: newPageNumber },
        { where: { userId, comicId } }
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  
  