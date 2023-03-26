import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export const getEngines = async () => {
  try {
    const { data } = await openai.listModels();
    return data;
  } catch (error) {
    throw error;
  }
};

const createCompletion = async (params) => {
  try {
    const { data } = await openai.createCompletion(params);
    return data;
  } catch (error) {
    throw error;
  }
};

const createChatCompletion = async (params) => {
  try {
    const { data } = await openai.createCompletion(params);
    return data;
  } catch (error) {
    throw error;
  }
};

export default {
  ...openai,
  getEngines,
  createCompletion,
  createChatCompletion,
};
