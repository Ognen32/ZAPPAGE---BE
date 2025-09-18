import catchAsyncError from "../middlewares/catchAsyncError.js";
import {
  registerUserService,
  getUserByIDHeader,
  loginUserService,
  logoutUserService,
  updateUserService,
  removeUser,
  getAllUsers
} from "../services/authService.js";

export const registerUser = catchAsyncError(async (req, res, next) => {
  const {
    userName,
    email,
    phoneNumber,
    firstName,
    surName,
    password,
    role,
    dateOfBirth,
  } = req.body;
  await registerUserService(req, res, next);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  await loginUserService(req, res, next);
});

export const logoutUser = catchAsyncError(async (_req, res) => {
  await logoutUserService(_req, res);
});

export const hanldeGetUserByIDHeader = async (req, res) => {
  try {
    const userid = req.user.id;
    // const useridtemp = 2;
    const user = await getUserByIDHeader(userid);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUser = catchAsyncError(async (req, res, next) => {
  await updateUserService(req, res, next);
});

export const handleRemoveUser = async (req, res) => {
  try {
    const userId = req.params.id; 
    const result = await removeUser(userId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const hanldeGetUserByID = async (req, res) => {
   try {
    const userId = req.params.id; 
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await getUserByIDHeader(userId); 
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const handleGetAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};