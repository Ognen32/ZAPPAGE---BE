import User from "../models/userModel.js";
import { Op } from "sequelize";

export const findUserById = async function (userid) {
  try {
    return await User.findOne({
      where: { id: userid },
      attributes: [
        "id",
        "firstName",
        "surName",
        "userName",
        "avatar",
        "email",
        "phoneNumber",
        "dateOfBirth",
        "role",
        "createdAt",
      ],
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

export const findUserByUserName = async (userName) => {
  try {
    return await User.findOne({ where: { userName } }); // Checks if the username already exists
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByEmail = async (email) => {
  // Checks if the email already exists if it does it checks for their existing attributes
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findUserByPhoneNumber = async (phoneNumber) => {
  // Checks if the phone number already exists if it does it checks for their existing attributes
  try {
    return await User.findOne({ where: { phoneNumber } });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createUser = async (userData) => {
  // Creates and stores the new user in the DB
  try {
    return await User.create(userData);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateUserById = async (id, updatedData) => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(updatedData);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteUser = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    await user.destroy();
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const AllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "resetPasswordToken", "resetPasswordExpire"] },
      where: {
        role: {
          [Op.not]: "admin" // враќа сите кои не се admin
        }
      }
    });
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
};