import { NextApiRequest, NextApiResponse } from "next";
import query from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDB } from "../../firebaseAdmin";
import { Message } from "../../types/message";

type Data = {
  answer: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session, chatMessages } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "Please provide a prompt!" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID" });
    return;
  }

  // Create context from chat messages
  const context = chatMessages.map((message: Message) => `${message.user.name}: ${message.text}`).join("\n");

  try {
    const response = await query(prompt, chatId, model, context);

    const message: Message = {
      text: response || "AI Chatbot was unable to find the answer to that",
      createdAt: admin.firestore.Timestamp.now(),
      user: {
        _id: "AIChatbot",
        name: "AIChatbot",
        avatar: "/public/logo.svg",
      },
    };

    // Add message to chat history
    await adminDB
      .collection("users")
      .doc(session?.user?.email!)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(message);

    res.status(200).json({ answer: message.text });

  } catch (err: any) {
    // Handle errors
    console.error("Error:", err);
    res.status(500).json({ answer: "An error occurred while processing your request.", error: err.message });
  }
}
