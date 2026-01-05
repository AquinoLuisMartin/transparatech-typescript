const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelName = "gemini-3-flash-preview";
  
  console.log(`Testing model: ${modelName}`);
  
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello, are you there?");
    const response = await result.response;
    console.log("✅ Success! Response:", response.text());
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

testModel();
