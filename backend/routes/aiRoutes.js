import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import { generateDescriptionController } from "../controllers/aiController.js";

const router = express.Router();

// Apply auth middleware to protect the AI generation endpoints
router.use(verifyAuth);

router.post("/generate-description", generateDescriptionController);

export default router;
