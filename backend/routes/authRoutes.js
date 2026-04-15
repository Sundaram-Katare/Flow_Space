const express = require('express');
const {signup, login, getCurrentUser, verifyTokenEndpoint } = require('../controllers/authController');
const { verifyAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-token", verifyTokenEndpoint);

router.get("/me", verifyAuth, getCurrentUser);

export default router;