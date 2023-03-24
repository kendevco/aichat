"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { serverTimestamp, addDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";

type Props = {
  chatId: string;
};

async function fetchChatMessages(chatId: string, userEmail: string) {
  const messagesRef = collection(db, "users", userEmail, "chats", chatId, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"), limit(5));
  const messagesSnapshot = await getDocs(messagesQuery);

  const messages: { text: string; createdAt: any }[] = [];
  messagesSnapshot.forEach((doc) => {
    messages.unshift(doc.data() as { text: string; createdAt: any });
  });

  return messages;
}


function ChatInput({ chatId }: Props) {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();

  const { data: model } = useSWR("model", {
    fallbackData: "text-davinci-003",
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    const message: Message = {
      text: input,
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          `https://ui-avatars.com/api/?name=${session?.user?.name}`,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    const chatMessages = await fetchChatMessages(chatId, session?.user?.email!);

    const notification = toast.loading("Please wait...");

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
        chatMessages,
      }),
    }).then(() => {
      console.log(input);
      toast.success("AI Chatbot has responded!", {
        id: notification,
      });
    });
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-[16px]">
      <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
        <input
          type="text"
          placeholder="Type your message here ..."
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300"
          disabled={!session}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          type="submit"
          disabled={!prompt || !session}
          className="bg-[#11A37F] hover:opacity-50 text-white font-bold px-4 py-2 rounded cursor-pointer text-[16px] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-[#11A37F]"
          >
            <PaperAirplaneIcon className="h-4 w-4 -rotate-45" />
          </button>
        </form>
      
        <div className="md:hidden">
          <ModelSelection />
        </div>
      </div>
      
  );
}
export default ChatInput;