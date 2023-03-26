// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import openaiQuery from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDB } from "../../firebaseAdmin";
import { query, collection, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

type Data = {
  answer: string;
  error?: string; // Add the error property as optional
};

const defaultPrompt = "What follows is an ongoing conversation you've been having with your client. If they ask you for an email generate the email. "+
                    "Likewise if you are asked to analyze something do so to the fullest extent possible. Be thorough. You are a concise and to the point  "+
                    "AI information technology assistant with a genius level IQ. After this initial prompt, the preceding messages up to ten of the current  "+
                    "chat thread will be included in the prompt, the last message is the current prompt from the user. Your responses are prepended with  "+
                    "nothing but if you must make it short and sweet with 'AI:'";

async function fetchChatMessages(chatId: string, userEmail: string) {
  const messagesRef = collection(db, "users", userEmail, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(10));
  const messagesSnapshot = await getDocs(messagesQuery);

  const messages: { text: string; createdAt: any }[] = [];
  messagesSnapshot.forEach((doc) => {
    messages.unshift(doc.data() as { text: string; createdAt: any });
  });

  return messages;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, chatId, model, session } = req.body;

  if (!prompt) {
    res.status(400).json({ answer: "Please provide a prompt!" });
    return;
  }

  if (!chatId) {
    res.status(400).json({ answer: "Please provide a valid chat ID" });
    return;
  }

  // Create context from chat messages
  const chatMessages = await fetchChatMessages(chatId, session?.user?.email!);
  const context = chatMessages.map(message => message.text).join("\n\n");

  try {
    const response = await openaiQuery(prompt, chatId, model, session?.user?.email!, context);

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
