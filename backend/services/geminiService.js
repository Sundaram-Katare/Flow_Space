import axios from 'axios';

/**
 * Generate a task description based on the task title using Gemini API.
 * @param {string} title 
 * @returns {Promise<string>}
 */
export const generateTaskDescription = async (title) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("⚠️ GEMINI_API_KEY is not set. Using fallback mock description.");
    // Simulate API delay for a realistic loading feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `AI Suggested Description: Action items related to "${title}". Review current requirements, align with team members, and document findings to resolve this task successfully.`;
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate a concise, professional task description (1-3 sentences) based on the task title: "${title}". Respond ONLY with the description text itself. Do not include any introductory remarks, conversational responses, conversational fillers (such as "Here is a task description:", "Sure, here is...", etc.), headers, bullet points, or markdown formatting.`
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Invalid response structure from Gemini API");
    }
    return text.trim();
  } catch (error) {
    console.error("Gemini API call failed:", error.response?.data || error.message);
    throw new Error("Failed to generate description with Gemini API: " + (error.response?.data?.error?.message || error.message));
  }
};
