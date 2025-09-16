import Comic from './comicModel.js';
import Comment from './commentsModel.js';
import User from './userModel.js';
import Genre from './genreModel.js';         
import ComicGenre from './comicGenre.js'; 
import ComicPage from './comicPageModel.js'; 
import Favourite from './favoritesModel.js';
import UserPageTracker from './userPageTracker.js';


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

//Favorite and Comic
Favourite.belongsTo(Comic, { foreignKey: "comicId", as: "Comic" });
Comic.hasMany(Favourite, { foreignKey: "comicId", as: "Favourites" });

// Favourite and User
Favourite.belongsTo(User, { foreignKey: "userId", as: "User" });
User.hasMany(Favourite, { foreignKey: "userId", as: "Favourites" });

// User and UserPageTracker
User.hasMany(UserPageTracker, { foreignKey: "userId", as: "PageTrackers", onDelete: "CASCADE" });
UserPageTracker.belongsTo(User, { foreignKey: "userId", as: "User" });

// Comic and UserPageTracker
Comic.hasMany(UserPageTracker, { foreignKey: "comicId", as: "PageTrackers", onDelete: "CASCADE" });
UserPageTracker.belongsTo(Comic, { foreignKey: "comicId", as: "Comic" });



export default { Comic, User, Comment, Genre, ComicGenre, UserPageTracker };
