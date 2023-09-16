import { NextApiRequest, NextApiResponse } from "next";
import openai from "../../lib/chatgpt";

type Option = {
  value: string;
  label: string;
};

type Data = {
  modelOptions: Option[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const models = await openai.listModels().then((res) => res.data.data);

  const allowedModels = [
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-32k",
    "gpt-4-32k-0314",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0613",
    "gpt-4-0613",
  ];

  const modelOptions = models
    .filter((model) => allowedModels.includes(model.id))
    .map((model) => ({
      value: model.id,
        label: model.id,
    }));

  res.status(200).json({
    modelOptions,
  });
}