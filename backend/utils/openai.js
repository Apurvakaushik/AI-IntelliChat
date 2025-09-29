
import "dotenv/config";
import fetch from "node-fetch"; 

export const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
       model: "x-ai/grok-4-fast:free",
      messages: [{ role: "user", content: message }],
    }),
  };

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
    const data = await response.json();

    // ✅ Safe check
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      console.error("OpenRouter returned invalid response:", data);
      return "Sorry, I couldn't get a response from AI.";
    }
  } catch (err) {
    console.error("OpenRouter API call failed:", err);
    return "Sorry, something went wrong while contacting AI.";
  }
};
export default getOpenAIAPIResponse;


