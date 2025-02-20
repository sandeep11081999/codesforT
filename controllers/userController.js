import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


import { ResponseMessage } from "../utils/ResponseMessage.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: StatusCodes.CONFLICT,
        message: ResponseMessage.USER_ALREADY_EXIST,
        data: [],
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      status: StatusCodes.CREATED,
      message: ResponseMessage.USER_REGISTER_SUCCESSFULLY,
      data: newUser,
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: error,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        status: StatusCodes.NOT_FOUND,
        message: ResponseMessage.USER_NOT_FOUND,
        data: [],
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        status: StatusCodes.UNAUTHORIZED,
        message: ResponseMessage.INVALID_CREDENTIALS,
        data: [],
      });
    }

    const token = jwt.sign(
      { user: { id: existingUser._id } },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    activeSessions.set(email, token);

    return res.status(200).json({
      status: StatusCodes.OK,
      message: ResponseMessage.LOGIN_SUCCESSFUL,
      data: { ...existingUser._doc, token },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ResponseMessage.INTERNAL_SERVER_ERROR,
      data: error,
    });
  }
};

export const logoutUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.token = null;
    await user.save();
  }
  res.clearCookie("jwt").json({ message: "Logged out successfully" });
};
