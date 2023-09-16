import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

const MAX_TOKENS = {
  "text-davinci-002": 2048,
  "text-davinci-003": 2048,
  "davinci-codex": 4096,
  "gpt-3.5-turbo": 4096,
  "gpt-4": 8192,
  "gpt-4-0314": 8192,
  "gpt-4-32k": 32768,
  "gpt-4-32k-0314": 32768,
};

const openaiQuery = async (model: string, messages: any[]) => {
  const maxTokens = MAX_TOKENS[model] || 1000; // Default to 1000 if model not found

  try {
    const response = await openai.createChatCompletion({
      model,
      messages: messages,
    });

    return response.data.choices[0]?.message?.content || "AI Chatbot was unable to find the answer to that";

  } catch (err) {
    console.error("Error in openaiQuery:", err);

    // Check if err is an instance of Error before accessing the message property
    if (err instanceof Error) {
      return `AI Chatbot was unable to find the answer to that (Error: ${err.message})`;
    } else {
      return "AI Chatbot was unable to find the answer to that (Unknown error)";
    }
  }
};

export default openaiQuery;
