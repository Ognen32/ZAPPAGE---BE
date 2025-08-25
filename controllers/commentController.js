import {
  createComments,
  deleteComments,
  editComments,
  getAllCommentsByComic,
} from "../services/commentService.js";

export const handleCreateComment = async (req, res) => {
  const { comicId, text } = req.body;
  const currentUser = req.user;

  const newComment = await createComments(currentUser.id, comicId, text);

  res.status(201).json(newComment);
};

export const handleDeleteComment = async (req, res) => {
  try {
    const currentUser = req.user;
    const { commentId } = req.params;

    const deletedComment = await deleteComments(commentId, currentUser);

    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleEditComment = async (req, res) => {
  try {
    const currentUser = req.user;
    const { commentId } = req.params;
    const { text } = req.body;

    const editedComment = await editComments(commentId, currentUser, text);

    res.status(200).json(editedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleGetCommentsByComic = async (req, res) => {
  try {
    const { comicId } = req.params;

    const comments = await getAllCommentsByComic(comicId);

    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
