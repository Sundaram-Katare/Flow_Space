import { generateTaskDescription } from "../services/geminiService.js";

/**
 * Controller to handle AI task description generation.
 * Route: POST /api/ai/generate-description
 */
export const generateDescriptionController = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required to generate description" });
    }

    const description = await generateTaskDescription(title);

    res.json({
      success: true,
      description
    });
  } catch (error) {
    console.error("Generate description controller error:", error);
    res.status(500).json({ error: error.message || "Failed to generate task description" });
  }
};
