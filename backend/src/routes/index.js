/**
 * @module routes/index
 * @description Root API router — mounts all domain-specific sub-routers.
 *
 * All API routes are versioned under /api/v1.
 * Adding a new domain in future phases means adding ONE line here.
 *
 * Current routes (Phase 1A):
 *   GET /api/v1/health
 *
 * Future routes (Phase 1B+):
 *   /api/v1/auth
 *   /api/v1/users
 *   /api/v1/products
 *   /api/v1/categories
 *   /api/v1/cart
 *   /api/v1/wishlist
 *   /api/v1/orders
 *   /api/v1/reviews
 *   /api/v1/admin
 *   /api/v1/sellers   (marketplace phase)
 */

import { Router } from "express";
import healthRouter from "./health.routes.js";

import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import addressRouter from './address.routes.js';

// ─── Phase 1C+ (uncomment as phases are implemented) ─────────────────────────
// import productRouter from './product.routes.js';
// import categoryRouter from './category.routes.js';
// import cartRouter from './cart.routes.js';
// import wishlistRouter from './wishlist.routes.js';
// import orderRouter from './order.routes.js';
// import reviewRouter from './review.routes.js';
// import adminRouter from './admin.routes.js';

const router = Router();

// ─── Mount Routers ────────────────────────────────────────────────────────────

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/addresses", addressRouter);

// ─── Phase 1C+ Mounts (uncomment as phases are implemented) ──────────────────
// router.use("/products",   productRouter);
// router.use("/categories", categoryRouter);
// router.use("/cart",       cartRouter);
// router.use("/wishlist",   wishlistRouter);
// router.use("/orders",     orderRouter);
// router.use("/reviews",    reviewRouter);
// router.use("/admin",      adminRouter);

export default router;
