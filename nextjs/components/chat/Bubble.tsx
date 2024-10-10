import React, { useState, useEffect } from "react";
import Image from "next/image";
import PulsatingDots from "./PulsatingDots";
import { useUser } from "@/lib/context/userContext";
import { useSessionContext } from "@/lib/context/AgentContext";
import { getSession } from "@/lib/services/chatService";
import UserMessageTail from "../icons/UserMessageTail";
import AgentMessageTail from "../icons/AgentMessageTail";
import ReactMarkdown from "react-markdown";

interface BubbleProps {
    text: string;
    isUser: boolean;
    isloading: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ text, isUser, isloading }) => {
    const { user } = useUser();
    const [image, setImage] = useState<string>("");
    const { session, setSession } = useSessionContext();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSession(session);
                setImage(data.image);
                console.log(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
        fetchData();
    }, [session]);

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative flex ${
                    isUser ? "flex-row-reverse" : "flex-row"
                } max-w-[80%]`}
            >
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${
                        isUser
                            ? "bg-[#9CBEBC] dark:bg-[#5661F6]"
                            : "bg-gray-600"
                    } ${isUser ? "ml-2" : "mr-2"}`}
                >
                    {isUser ? (
                        <Image
                        src={user ? user.image : "/profile.png"}
                        alt="Profile Pic"
                        width={32}
                        height={32}
                    />
                    ) : (
                        <Image width={32} height={32} src={image} alt='Profile Pic' />
                    )}
                </div>

                {isloading ? (
                    <PulsatingDots />
                ) : (
                    <div
                        className={`relative px-4 py-2 mt-3 rounded-[20px] ${
                            isUser
                                ? "bg-[#9CBEBC] dark:bg-[#5661F6] mr-1"
                                : "bg-[#2B292E] ml-1"
                        }`}
                    >
                        <ReactMarkdown className="text-sm px-1">{text}</ReactMarkdown>
                        <div
                            className={`absolute top-0 ${
                                isUser ? "right-[-8px]" : "left-[-8px]"
                            }`}
                        >
                            {isUser ? (
                                <UserMessageTail />
                            ) : (
                                <AgentMessageTail />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bubble;
