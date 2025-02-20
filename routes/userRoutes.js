import express from "express";
import { registerUser, loginUser,userDetails, logoutUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-fetch/:id", authMiddleware, userDetails);
router.post("/logout", authMiddleware, logoutUser);

export default router;
