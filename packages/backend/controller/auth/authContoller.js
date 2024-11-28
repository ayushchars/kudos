import { compairPassword, hashPassword } from "../../helpers/authHelper.js";
import userModel from "../../models/userModel.js";
import Jwt from "jsonwebtoken";
import {
  ErrorResponse,
  successResponse,
  notFoundResponse,
  successResponseWithData
} from "../../helpers/apiResponse.js";
export const registerControllar = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return ErrorResponse(res, "Name and Email are required");
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return ErrorResponse(res, "User already exists");
    }

    // Save the user
    const user = await new userModel({ name, email }).save();

    return successResponseWithData(res, "User registered successfully", user);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      success: false,
      message: "Error while registering",
      err,
    });
  }
};


export const loginControllar = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return notFoundResponse(res, "Name or Email is required");
    }

    // Find user by name or email
    const user = await userModel.findOne({ $or: [{ name }, { email }] });

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    // Generate token
    const additionalData = {
      role: user.role,
      email: user.email,
      name: user.name,
    };

    const jwtPayload = { _id: user._id, ...additionalData };

    const token = Jwt.sign(jwtPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return successResponseWithData(res, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error while logging in",
    });
  }
};
export const getUser = async (req, res) => {
  try {
    const { id, name, email } = req.query; 

    if (!id && !name && !email) {
      return notFoundResponse(res, "At least one of ID, Name, or Email is required");
    }

    // Find user by id, name, or email
    const user = await userModel.findOne({
      $or: [{ _id: id }, { name }, { email }],
    });

    if (!user) {
      return notFoundResponse(res, "User not found");
    }

    return successResponseWithData(res, "User fetched successfully", user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching user",
      error,
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(); 
    if (!users || users.length === 0) {
      return notFoundResponse(res, "No users found");
    }

    return successResponseWithData(res, "Users fetched successfully", users);
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};