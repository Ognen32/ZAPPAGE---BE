import { DataTypes } from "sequelize"; // Imposting and using datatypes from sequelize
import { sequelize } from "../database/dbConnect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Defining the structure of the created user table in the DB

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      // String that's not allowed to be empty
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 15],
      },
    },
    surName: {
      // String that's not allowed to be empty
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 15],
      },
    },
    userName: {
      // String that must be unique or must not have a constant with the same value
      type: DataTypes.STRING,
      allowNull: false, // Not allowed to be empty and must have a length of 3 to 15
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 15],
      },
    },
    email: {
      // String that must be unique or must not have a constant with the same value
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        isGmail(value) {
          // Must end with one of the constant values in order for it to be accepted as an email
          const allowedDomains = [
            "@gmail.com",
            "@yahoo.com",
            "@hotmail.com",
            "@outlook.com",
          ];
          if (!allowedDomains.some((domain) => value.endsWith(domain))) {
            throw new Error(
              "Please provide a valid Gmail, Yahoo, or Outlook email address."
            );
          }
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isMacedonianNumber(value) {
          // Removes spaces and non numeric values from the phone number except for the '+'
          let cleanedValue = value
            .replace(/[\s()\-]/g, "")
            .replace(/[^0-9+]/g, "");
          if (cleanedValue.startsWith("07")) {
            // Must start with '07' or '+389 7'
            cleanedValue = `+389${cleanedValue.slice(1)}`;
          }
          const macedonianRegex = /^\+3897\d{7}$/;
          if (!macedonianRegex.test(cleanedValue)) {
            throw new Error(
              "Please provide a valid Macedonian phone number (e.g., +389 70 707 070 or 070 707 070)."
            );
          }
          this.phoneNumber = cleanedValue; // I doubt that this is supposed to be saved as an integer due to
        }, // The fact that when it gets saved as an integer in the DB it shows up as 70 707 070 instead of 070 707 070
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpire: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    createdAt: true,
    updatedAt: true,
  }
);

// Before creating a user this function hashes the password for security

User.beforeSave(async (user) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});



// Generates JWT token
User.prototype.getJWTToken = function () {
  return jwt.sign({ id: this.id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// Compares passwords
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.prototype.getResetPasswordToken = function () {
  // Generates a random reset password token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashes and sets the randomly generated reset password token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set the expiration time for the reset token (15 minutes)
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export default User;
