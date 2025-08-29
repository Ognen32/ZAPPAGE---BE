import {
  createComment,
  deleteComment,
  editComment,
  findAllCommentsByComic,
  findCommentById,
} from "../repositories/commentRepository.js";
import { ValidationError } from "../utils/error.js";

export const createComments = async function (userId, comicId, commentText) {
  if (!commentText || commentText.length < 1) {
    throw new ValidationError("Comment can't be empty");
  }

  if (commentText.length > 150) {
    throw new ValidationError("Comment can't be over 150 characters");
  }

  return createComment(userId, comicId, commentText);
};

export const deleteComments = async function (commentId, currentUser) {
  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new ValidationError("Comment not found");
  }

  if (comment.userId !== currentUser.id && currentUser.role !== "admin") {
    throw new ValidationError("You cannot delete this comment");
  }

  return deleteComment(commentId);
};

export const editComments = async function (
  commentId,
  currentUser,
  editedText
) {
  const comment = await findCommentById(commentId);

  if (!comment) {
    throw new ValidationError("Comment not found");
  }

  if (comment.userId !== currentUser.id) {
    throw new ValidationError("You cannot edit this comment");
  }

  return editComment(commentId, editedText);
};

export const getAllCommentsByComic = async function (comicId) {
  const allComments = await findAllCommentsByComic(comicId);

  if (!allComments.length) {
    throw new ValidationError("No comments yet"); //or return [];
  }

  return allComments;
};
