const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testModel() {
  try {
    console.log('Testing Gemini 3.0 Flash...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });
    const result = await model.generateContent("Hello");
    const response = await result.response;
    console.log('Success:', response.text());
  } catch (error) {
    console.error('Error with gemini-3.0-flash:', error.message);
    
    try {
        console.log('Testing Gemini 2.0 Flash Exp...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log('Success with 2.0:', response.text());
    } catch (err2) {
        console.error('Error with gemini-2.0-flash-exp:', err2.message);
    }
  }
}

testModel();
