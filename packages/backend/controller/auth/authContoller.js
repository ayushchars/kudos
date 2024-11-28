import userModel from "../../models/userModel.js";
import Jwt from "jsonwebtoken";
import {
  ErrorResponse,
  notFoundResponse,
  successResponseWithData
} from "../../helpers/apiResponse.js";
export const registerControllar = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return ErrorResponse(res, "Name and Email are required");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return ErrorResponse(res, "User already exists");
    }

    const user = await new userModel({ name, email }).save();

    return successResponseWithData(res, "User registered successfully", user);
  } catch (err) {
    console.error(err);
    return ErrorResponse(res, "Error while registering");
    
  }
};

export const loginControllar = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name) {
      return notFoundResponse(res, "Name is required");
    }
    const usersWithSameName = await userModel.find({ name });
    if (usersWithSameName.length === 0) {
      return notFoundResponse(res, "User not found");
    }
    let user;
    if (usersWithSameName.length === 1) {
      user = usersWithSameName[0];
    } else {
      if (!email) {
        return notFoundResponse(
          res,
          "Multiple users found with the same name. Email is required"
        );
      }
      user = usersWithSameName.find((u) => u.email === email);
      if (!user) {
        return notFoundResponse(
          res,
          "No user found with the provided name and email combination"
        );
      }
    }

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
    return ErrorResponse(res, "Error while login");
  }
};

export const getAllUsers = async (req, res) => {
  try {
   
    const loggedInUserId = req.user._id;

    const users = await userModel.find({ _id: { $ne: loggedInUserId } });

    if (users.length === 0) {
      return notFoundResponse(res, "No users found");
    }

    return successResponseWithData(res, "Users found successfully", users);
  } catch (error) {
    console.error(error);
    return ErrorResponse(res, "Error while feaching user detail");
 
  }
};
