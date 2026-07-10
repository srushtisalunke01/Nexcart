/**
 * @module routes/user.routes
 * @description User profile routes.
 */

import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  removeAvatar,
  deactivateAccount,
} from "../controllers/userController.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { updateProfileValidators, changePasswordValidators } from "../validators/userValidators.js";
import { uploadAvatar } from "../middlewares/uploadMiddleware.js";

const router = Router();

// All user routes require authentication
router.use(protect);

router.get("/me", getProfile);
router.put("/profile", updateProfileValidators, validate, updateProfile);
router.put("/password", changePasswordValidators, validate, changePassword);

// Avatar uploads
router.patch("/avatar", uploadAvatar, updateAvatar);
router.delete("/avatar", removeAvatar);

// Account management
router.delete("/", deactivateAccount);

export default router;
