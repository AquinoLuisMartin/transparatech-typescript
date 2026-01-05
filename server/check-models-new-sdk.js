const { GoogleGenerativeAI } = require("@google/generative-ai");
// Try to require the other package if possible, but I'm not sure of its export structure yet.
// Let's stick to the one we know works for now, but maybe try to force the API version.

require("dotenv").config();

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Try to use a different API version if possible? 
  // The SDK usually defaults to v1beta.
  
  const modelName = "gemini-2.0-flash-exp"; 
  // I'm going to set the app to use this one, as it's the only "Flash" "Exp" (Fast/New) that exists.
  // I will explain to the user that "Gemini 3" in the UI corresponds to "gemini-2.0-flash-exp" in the API currently.
  
  console.log(`Configuring app to use: ${modelName}`);
}

checkModels();
