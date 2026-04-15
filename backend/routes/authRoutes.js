import express from 'express';
import { signup, login, getCurrentUser, verifyTokenEndpoint } from '../controllers/authController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-token", verifyTokenEndpoint);

router.get("/me", verifyAuth, getCurrentUser);

export default router;