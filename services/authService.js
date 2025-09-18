import {
  findUserByUserName,
  findUserByEmail,
  findUserByPhoneNumber,
  createUser,
  findUserById,
  updateUserById,
  deleteUser,
  AllUsers,
} from "../repositories/authRepos.js";
import { sendToken } from "../utils/jwtToken.js";
import { ErrorHandler } from "../middlewares/error.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import { ValidationError } from "../utils/error.js";

export const registerUserService = async (req, res, next) => {
  try {
    const userData = req.body; // Defining required field data
    const requiredFields = [
      "userName",
      "email",
      "phoneNumber",
      "firstName",
      "surName",
      "password",
      "role",
      "dateOfBirth",
    ];

    if (requiredFields.some((field) => !userData[field])) {
      // Checks if all fields are filled
      return next(new ErrorHandler("All fields are required.", 400));
    }

    // Checks if username, email or phone number already exist in the DB
    const checks = [
      {
        fn: findUserByUserName,
        msg: "Username is already taken. Please choose another one.",
      },
      { fn: findUserByEmail, msg: "User already exists with this email." },
      {
        fn: findUserByPhoneNumber,
        msg: "User already exists with this phone number.",
      },
    ];

    for (const { fn, msg } of checks) {
      if (
        await fn(
          userData[
            fn.name.includes("UserName")
              ? "userName"
              : fn.name.includes("Email")
              ? "email"
              : "phoneNumber"
          ]
        )
      ) {
        return next(new ErrorHandler(msg, 400)); // Returns an error message that one of the checked constants already exists
      }
    }

    if (!["user", "admin"].includes(userData.role)) {
      // Checks for the role type but defaults to user as via the model
      return next(
        new ErrorHandler(
          'Invalid role. Only "user" and "admin" are allowed.',
          400
        )
      );
    } // Otherwise checks if the role exists as per postman testing

    const user = await createUser(userData); // If everything is okay it takes the data and creates a new user in the DB
    sendToken(user, 201, "User registered successfully", res);
  } catch (error) {
    next(error);
  }
};

export const loginUserService = async (req, res, next) => {
  try {
    
    const { email, password } = req.body;
    
    if (!email || !password)
      return next(new ErrorHandler("All fields are required.", 400));

    const user = await findUserByEmail(email);
    if (!user || !(await user.matchPassword(password))) {
      return next(new ErrorHandler("Invalid credentials.", 401));
    }

    sendToken(user, 200, "Login successful", res);
  } catch (error) {
    next(error);
  }
};

export const logoutUserService = async (_req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully." });
};

export const getUserByIDHeader = async (userid) => {
  try {
    if (!userid) {
      throw new ValidationError("Must Enter userid!");
    }
    const user = await findUserById(userid);
    if (!user) {
      throw new ValidationError("User has not been found!");
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const updateUserService = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Ensure we don’t allow role or password changes here (optional)
    const disallowedFields = ["role", "password"];
    disallowedFields.forEach((field) => delete updatedData[field]);

    const user = await updateUserById(userId, updatedData);

    if (!user) {
      return next(new ErrorHandler("User not found.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (userId) => {
  try {
    if (!userId) {
      throw new ValidationError("Must enter userId!");
    }

    const user = await findUserById(userId);
    if (!user) {
      throw new ValidationError("User has not been found!");
    }

    await deleteUser(userId);

    return { message: `User has been successfully removed.` };
  } catch (err) {
    throw new Error(err.message);
  }
};


export const getAllUsers = async () => {
  const users = await AllUsers();

  if (!users || users.length === 0) {
    throw new Error("No users found");
  }

  return users;
};