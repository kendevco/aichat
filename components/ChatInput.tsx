"use client";
import { useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-hot-toast";
import ModelSelection from "./ModelSelection";
import useSWR from "swr";

type Props = {
  chatId: string;
};

function ChatInput({ chatId }: Props) {
  const [prompt, setPrompt] = useState("");
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-4",
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      const numRows = Math.min(textareaRef.current.scrollHeight / 20, 8);
      textareaRef.current.rows = numRows;
    }
  };

  const sendMessage = async () => {
    if (!prompt) return;

    const input = prompt.trim();
    setPrompt("");

    const message = {
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

    try {
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
        }),
      });

      console.log(input);
      toast.success("AI Chatbot has responded!", {
        id: notification,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }

    textareaRef.current?.focus();
    resizeTextarea();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const target = e.target as HTMLTextAreaElement;
    target.rows = 1;
    const numRows = Math.min(target.scrollHeight / 20, 8);
    target.rows = numRows;
  };

  return (
    <div className="bg-gray-700/50 text-gray-400 rounded-lg text-[16px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-5 space-x-5 flex"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Type your message here ..."
          className="bg-transparent focus:outline-none flex-1 disabled:cursor-not-allowed disabled:text-gray-300 resize-none"
          disabled={!session}
          value={prompt}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />

        <button
          title="Send Message"
          type="button"
          onClick={sendMessage}
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