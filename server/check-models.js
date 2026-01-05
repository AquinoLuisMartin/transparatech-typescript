const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init to get client
    // There isn't a direct "listModels" on the client instance in some versions, 
    // but let's try the standard way if available or just test common names.
    
    // Actually, the SDK doesn't always expose listModels easily without the admin SDK.
    // Instead, let's test a few specific variations of "Gemini 3" to see which one hits.
    
    const candidates = [
      "gemini-3.0-flash",
      "gemini-3.0-flash-001",
      "gemini-3.0-pro",
      "gemini-3.0-flash-exp",
      "gemini-exp-1206", // Sometimes new models have date-based names
      "gemini-2.0-flash-exp"
    ];

    console.log("Testing model availability...");
    
    for (const modelName of candidates) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello");
        console.log(`✅ ${modelName}: AVAILABLE`);
      } catch (error) {
        if (error.message.includes("404") || error.message.includes("not found")) {
          console.log(`❌ ${modelName}: Not Found (404)`);
        } else if (error.message.includes("429")) {
          console.log(`⚠️ ${modelName}: Rate Limited (429) - But it exists!`);
        } else {
          console.log(`❓ ${modelName}: Error - ${error.message}`);
        }
      }
    }
    
  } catch (error) {
    console.error("Fatal error:", error);
  }
}

listModels();
