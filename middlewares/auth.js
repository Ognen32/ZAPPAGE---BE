import { verifyToken } from '../utils/jwtToken.js';
import {ErrorHandler} from '../middlewares/error.js';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token; // Requests the token form the cookies
 // If there is no token, return an error message that requires authentication

  if (!token) {
    return next(new ErrorHandler('Authentication required. Please log in.', 401));
  }

// Verifying the token using the verifyToken function

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Requests the user information
    next();
  } catch (error) { // If the token is invalid or expired it'll return an error message
    return next(new ErrorHandler('Invalid or expired token', 401));
  }
};

export const isAuthorized = (...roles) => { // Checks if the user's role is allowed to the particular resource
  return (req, res, next) => {              // Something for allowing certain roles to certain recourses later on
      if (!roles.includes(req.user.role)) {
          return next(
              new ErrorHandler(
                  `User with this role(${req.user.role}) is not allowed to access this resource`
              )
          );
      }
      next();
  };
};