import express from "express";
import {
  register,
  login,
  logout,
  getUserDetails,
  refreshToken,
  changePassword,
  updateUserDetails,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/details", authenticateToken, getUserDetails);
router.put("/update", authenticateToken, updateUserDetails);
router.post("/refresh", refreshToken); // Remove authenticateToken from refresh
router.put("/change-password", authenticateToken, changePassword);

export default router;
