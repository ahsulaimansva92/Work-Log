import { GoogleGenAI } from "@google/genai";
import { WorkItem, Category } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateWeeklySummary = async (
  workItems: WorkItem[],
  categories: Category[]
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare data for the model
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));
  
  const summaryData = workItems.map(item => ({
    caseId: item.caseId,
    description: item.description,
    category: categoryMap.get(item.categoryId) || 'Unknown',
    date: new Date(item.timestamp).toDateString()
  }));

  const prompt = `
    Analyze the following work log for this week. 
    Provide a professional, concise summary of the key accomplishments, 
    grouping work by category where appropriate. 
    Highlight any major cases worked on.
    
    Work Log Data:
    ${JSON.stringify(summaryData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary.");
  }
};
