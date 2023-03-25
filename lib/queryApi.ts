import openai from "./chatgpt";

const MAX_TOKENS = {
  "text-davinci-002": 2048,
  "text-davinci-003": 2048,
  "davinci-codex": 4096,
  // Add more models here
};

const defaultPrompt = "What follows is an ongoing conversation you've been having with your client. If they ask you for an email generate the email. Likewise if you are asked to analyze something do so to the fullest extent possible. Be thorough. You are a concise and to the point AI information technology assistant with a genius level IQ. After this initial prompt, the preceding messages up to ten of the current chat thread will be included in the prompt, the last message is the current prompt from the user. Your responses are prepended with nothing but if you must make it short and sweet with 'AI:'";

const query = async (prompt: string, chatId: string, model: string, context: string) => {
  const maxTokens = MAX_TOKENS[model] || 1000; // Default to 1000 if model not found
  const res = await openai
    .createCompletion({
      model,
      prompt: `${defaultPrompt}\n\n${context}\n\nUser: ${prompt}`,
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

export default query;
