import Comic from './comicModel.js';
import Comment from './commentsModel.js';
import User from './userModel.js';
import Genre from './genreModel.js';         // ← Add this
import ComicGenre from './comicGenre.js'; // ← And this
import ComicPage from './comicPageModel.js'; // Add this


// User and Comment
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

// Comic and Comment
Comic.hasMany(Comment, { foreignKey: "comicId" });
Comment.belongsTo(Comic, { foreignKey: "comicId" });

// Comic and Genre (Many-to-Many through ComicGenre)
Comic.belongsToMany(Genre, {
  through: ComicGenre,
  foreignKey: "comicId",
  otherKey: "genreId",
  as: "Genres",
});
Genre.belongsToMany(Comic, {
  through: ComicGenre,
  foreignKey: "genreId",
  otherKey: "comicId",
  as: "Comics",
});

// Comic and ComicPage
Comic.hasMany(ComicPage, { foreignKey: "comicId", as: "pages" });
ComicPage.belongsTo(Comic, { foreignKey: "comicId" });

export default { Comic, User, Comment, Genre, ComicGenre };
