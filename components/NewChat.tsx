"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function NewChat() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log("NewChat: Current User: " + session?.user?.email);

  const createChat = async () => {
    try {
      const doc = await addDoc(
        collection(db, "users", session?.user?.email!, "chats"),
        {
          // messages: [],
          userId: session?.user?.email!,
          createdAt: serverTimestamp(),
        }
      );

      console.log("Doc: " + doc);

      router.push(`/chat/${doc.id}`);
    } catch (error) {
      console.error("Error connecting to Firebase:", error);
    }
  };

  return (
    <div onClick={createChat} className="border-gray-700 border chatRow">
      <PlusIcon className="h-4 w-4" />
      <p>New Chat</p>
    </div>
  );
}

export default NewChat;