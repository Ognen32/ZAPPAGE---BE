import {findUserByUserName, findUserByEmail, findUserByPhoneNumber, createUser } from "../repositories/authRepos.js"
import { sendToken } from '../utils/jwtToken.js';
import { ErrorHandler } from '../middlewares/error.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import { ValidationError } from "../utils/error.js";


export const registerUserService = async (req, res, next) => {
    try {
      const userData = req.body; // Defining required field data
      const requiredFields = ['userName', 'email', 'phoneNumber', 'firstName', 'surName', 'password', 'role', 'dateOfBirth', 'city', 'address'];
  
      if (requiredFields.some(field => !userData[field])) { // Checks if all fields are filled
        return next(new ErrorHandler('All fields are required.', 400));
      }
  
      // Checks if username, email or phone number already exist in the DB
      const checks = [
        { fn: findUserByUserName, msg: 'Username is already taken. Please choose another one.' },
        { fn: findUserByEmail, msg: 'User already exists with this email.' },
        { fn: findUserByPhoneNumber, msg: 'User already exists with this phone number.' }
      ];
  
      for (const { fn, msg } of checks) {
        if (await fn(userData[fn.name.includes('UserName') ? 'userName' : fn.name.includes('Email') ? 'email' : 'phoneNumber'])) {
          return next(new ErrorHandler(msg, 400)); // Returns an error message that one of the checked constants already exists
        }
      }
  
      if (!['user', 'admin'].includes(userData.role)) { // Checks for the role type but defaults to user as via the model
        return next(new ErrorHandler('Invalid role. Only "user" and "admin" are allowed.', 400));
      } // Otherwise checks if the role exists as per postman testing
  
      const user = await createUser(userData); // If everything is okay it takes the data and creates a new user in the DB
      sendToken(user, 201, 'User registered successfully', res);
    } catch (error) {
      next(error);
    }
  };