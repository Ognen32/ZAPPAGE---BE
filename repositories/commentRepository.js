import Comment from '../models/commentsModel.js';
import User from '../models/userModel.js';

export const createComment = async function (userId, comicId, commentText) {
  try {
    const comment = await Comment.create({
      userId,
      comicId,
      text: commentText,
    });
    return comment;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const deleteComment = async function (commentId) {
  try {
    return await Comment.destroy({ where: { id: commentId } });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const editComment = async function (commentId, updatedText) {
  try {
    return await Comment.update(
      { text: updatedText },
      { where: { id: commentId }, returning: true }
    );
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findAllCommentsByComic = async function (comicId) {
  try {
    return await Comment.findAll({
      where: { comicId },
      include: [
        {
          model: User,
          attributes: ["id", "userName", "avatar"],
        },
      ],
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findCommentById = async function (commentId) {
  try {
    return await Comment.findOne({
      where: { id: commentId },
      attributes: ["id", "userId", "comicId", "text"],
    });
  } catch (err) {
    throw new Error(err.message);
  }
};
