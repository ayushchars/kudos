import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';

// Protected Route token based


export const requireSignin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {

      return res.status(401).send({
        success: false,
        message: "Jwt token missing"
    });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {

   
    return res.status(401).send({
      success: false,
      message: "Unauthorized Access."
  });
  }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found."
            });
        }

        if (user.role !== "ADMIN") {
            return res.status(403).send({
                success: false,
                message: "Unauthorized Access."
            });
        }

        // If the user is an admin, call the next middleware or route handler.
        next();

    } catch (error) {
        console.error("Error in isAdmin:", error);
        return res.status(500).send({
            success: false,
            message: "An error occurred while processing your request."
        });
    }
};
