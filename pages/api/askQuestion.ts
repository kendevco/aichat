// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// askQuestion.ts
import type { NextApiRequest, NextApiResponse } from "next";
import openaiQuery from "../../lib/queryApi";
import admin from "firebase-admin";
import { adminDB } from "../../firebaseAdmin";
import { query, collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

type Data = {
  answer: string;
  error?: string;
};

interface Message {
  text: string;
  createdAt: admin.firestore.Timestamp;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

async function fetchChatMessages(chatId: string, userEmail: string) {
  const messagesRef = collection(
    db,
    "users",
    userEmail,
    "chats",
    chatId,
    "messages"
  );
  const messagesQuery = query(messagesRef, orderBy("createdAt", "asc"));
  const messagesSnapshot = await getDocs(messagesQuery);

  const allMessages: { role: string; content: string }[] = [];

  messagesSnapshot.forEach((doc) => {
    const messageData = doc.data() as {
      text: string;
      createdAt: any;
      user: { _id: string; avatar: string };
    };
    const role = messageData.user._id === userEmail ? "user" : "assistant";
    allMessages.push({ role, content: messageData.text });
  });

  const lastMessages: { role: string; content: string }[] = [];
  let userCount = 0;
  let assistantCount = 0;

  for (let i = allMessages.length - 1; i >= 0; i--) {
    if (userCount < 5 && allMessages[i].role === "user") {
      lastMessages.unshift(allMessages[i]);
      userCount++;
    } else if (assistantCount < 5 && allMessages[i].role === "assistant") {
      lastMessages.unshift(allMessages[i]);
      assistantCount++;
    }

    if (userCount >= 5 && assistantCount >= 5) {
      break;
    }
  }

  return lastMessages;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { prompt, chatId, model, session } = req.body;

    if (!prompt) {
      throw new Error("Please provide a prompt!");
    }

    if (!chatId) {
      throw new Error("Please provide a valid chat ID");
    }

    const defaultPrompt =
      "AI Chatbot able to emulate whatever personality is appropriate for the situation. For example, 'I am a doctor' or 'I am a lawyer'";
    const chatMessages = await fetchChatMessages(chatId, session?.user?.email!);
    const messages = [
      { role: "system", content: defaultPrompt },
      ...chatMessages,
    ];

    const response = await openaiQuery(model, messages);

    const message: Message = {
      text:
        (response as string) ||
        "AI Chatbot was unable to find the answer to that",
      createdAt: admin.firestore.Timestamp.now(),
      user: {
        _id: "AIChatbot",
        name: "AIChatbot",
        avatar: "/public/logo.svg",
      },
    };

    await adminDB
      .collection("users")
      .doc(session?.user?.email!)
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(message);

    res.status(200).json({ answer: message.text });
  } catch (err: any) {
    console.error("Error:", err);
    res
      .status(500)
      .json({
        answer: "An error occurred while processing your request.",
        error: err.message,
      });
  }
}
