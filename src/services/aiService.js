import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeReport = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      Analyze this city infrastructure issue: "${description}".
      Categorize it STRICTLY into one of these exact words: ["Roads", "Electricity", "Sewage", "Trash"]. If it doesn't fit, use "Roads".
      Assign a priority STRICTLY into one of these exact words: ["High", "Medium", "Low"].
      Respond ONLY with a valid JSON object in this exact format: {"category": "...", "priority": "..."}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json|```/g, '').trim(); // Clean markdown formatting
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("[AI Error]:", error);
    // Fallback if AI fails so the app doesn't crash during demo
    return { category: "Roads", priority: "Medium" };
  }
};