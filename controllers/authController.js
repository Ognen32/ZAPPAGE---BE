import catchAsyncError from "../middlewares/catchAsyncError.js";
import {registerUserService} from '../services/authService.js';

export const registerUser = catchAsyncError(async (req, res, next) => {
    const {
        userName,
        email,
        phoneNumber,
        firstName,
        surName,
        password,
        role,
        dateOfBirth
      } = req.body;
    await registerUserService(req, res, next); // Calls the service to handle the registry
  });