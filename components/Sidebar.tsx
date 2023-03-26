"use client";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { getFirestore, collection, query, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import NewChat from "./NewChat";
import { db } from "../firebase";
import ChatRow from "./ChatRow";
import ModelSelection from "./ModelSelection";

function Sidebar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger icon for mobile */}
      <div
        className="md:hidden fixed top-0 right-0 z-50 mr-3 mt-3"
        onClick={toggleSidebar}
      >
        <div className="w-6 h-6 relative">
          <span className="bg-white absolute left-0 top-0 w-full h-0.5"></span>
          <span className="bg-white absolute left-0 top-1/2 w-full h-0.5"></span>
          <span className="bg-white absolute left-0 bottom-0 w-full h-0.5"></span>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed inset-y-0 left-0 z-40 transition duration-300 ease-in-out bg-[#202123] text-white w-72 overflow-y-auto md:static md:h-screen md:w-64`}
      >
        <div className="p-2 flex flex-col h-screen">
          <div className="flex-1">
            <div>
              <NewChat />

              <div className="hidden sm:inline">
                <ModelSelection />
              </div>

              <div className="flex flex-col space-y-2 my-2">
                {loading && (
                  <div className="animate-pulse text-center text-white">
                    <p>Loading Chats...</p>
                  </div>
                )}

                {chats?.docs.map((chat) => (
                  <ChatRow key={chat.id} id={chat.id} />
                ))}
              </div>
            </div>
          </div>

          {session && (
            <div className="flex items-center justify-start gap-2">
              <img
                src={session.user?.image!}
                alt="User Image"
                className="h-10 w-10 rounded-full cursor-pointer transition-all duration-200 hover:opacity-50"
              />

              <button
                onClick={() => signOut()}
                className="text-white hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
