/**
 * @module routes/address.routes
 * @description Address management routes.
 */

import { Router } from "express";
import {
  getAllAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import { addressValidators } from "../validators/addressValidators.js";
import { mongoIdParam } from "../validators/commonValidators.js";

const router = Router();

// All address routes require authentication
router.use(protect);

router.get("/", getAllAddresses);
router.post("/", addressValidators, validate, addAddress);
router.put("/:id", mongoIdParam("id"), addressValidators, validate, updateAddress);
router.delete("/:id", mongoIdParam("id"), validate, removeAddress);
router.patch("/:id/default", mongoIdParam("id"), validate, setDefaultAddress);

export default router;
