import { DocumentData } from "firebase/firestore";

type Props = {
  message: DocumentData;
};

function Message({ message }: Props) {
  const isAiChatbot = message.user.name === "AIChatbot";

  return (
    <div className={`py-5 text-white w-100 ${isAiChatbot && "bg-[#434654]"}`}>
      <div className="flex space-x-5 px-10 max-w-5xl">
        <img
          src={`${
            isAiChatbot
              ? "https://ui-avatars.com/api/?name=aichatbot"
              : message.user.avatar
          }`}
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <p className="pt-1 text-[14]">{message.text}</p>
      </div>
    </div>
  );
}

export default Message;
