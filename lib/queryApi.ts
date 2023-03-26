import openai from "./chatgpt";
import { collection, getDocs, limit, orderBy, Query } from "firebase/firestore";
import { db } from "../firebase";

const MAX_TOKENS = {
  "text-davinci-002": 2048,
  "text-davinci-003": 2048,
  "davinci-codex": 4096,
  // Add more models here
};

const openaiQuery = async (prompt: string, chatId: string, model: string, userEmail: string, context: string) => {
  const maxTokens = MAX_TOKENS[model] || 1000; // Default to 1000 if model not found

  const res = await openai
    .createCompletion({
      model,
      prompt: `${context}\n\nUser: ${prompt}`,
      temperature: 0.9,
      top_p: 1,
      max_tokens: maxTokens,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) =>
        `AI Chatbot was unable to find the answer to that (Error: ${err.message})`
    );

  return res;
};

export default openaiQuery;
