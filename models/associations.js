import Comic from './comicModel.js';
import Comment from './commentsModel.js';
import User from './userModel.js';

  // User and Comment
  User.hasMany(Comment, { foreignKey: "userId" });
  Comment.belongsTo(User, { foreignKey: "userId" });

  // Comic and Comment
  Comic.hasMany(Comment, { foreignKey: "comicId" });
  Comment.belongsTo(Comic, { foreignKey: "comicId" });

export default { Comic, User, Comment };