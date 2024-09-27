import { useSessionContext } from "@/lib/context/AgentContext";
import { getSession } from "@/lib/services/chatService";
import React, { useEffect, useState } from "react";

interface AgentProps {
    chat_id: string;
    name: string;
    image: string;
    category: string;
    onClick?: () => void;
}

const Agent = ({ chat_id, name, image, category, onClick }: AgentProps) => {
    const { session, setSession } = useSessionContext();
    const [datetime, setDatetime] = useState("");
    const [text, setText] = useState("");
    useEffect(() => {
        async function fetchData() {
            if (chat_id) {
                try {
                    const data = await getSession(chat_id);

                    if (data.prompts && data.prompts.length > 0) {
                        const lastPrompt =
                            data.prompts[data.prompts.length - 1];

                        const lastMessage =
                            lastPrompt.responses &&
                            lastPrompt.responses.length > 0
                                ? lastPrompt.responses[
                                      lastPrompt.responses.length - 1
                                  ]
                                : "";

                        setText(lastMessage);
                    } else {
                        setText("");
                    }

                    const formattedTime = new Date(
                        data.createdAt
                    ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                    });
                    setDatetime(formattedTime);
                    console.log(data);
                } catch (error) {
                    console.error("Error fetching data", error);
                }
            }
        }
        fetchData();
    }, []);

    const style = {
        backgroundColor: image,
    };

    return (
        <div
            className={`flex justify-start space-x-2 cursor-pointer hover:bg-[#9CBEBC] dark:hover:bg-[#9747FF] px-2 py-3 rounded-2xl ${
                session == chat_id ? "bg-[#9CBEBC] dark:bg-[#9747FF]" : "bg-inherit"
            }`}
            onClick={onClick}
        >
            <div
                className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-white`}
                style={style}
            ><img src={image} alt='Profile Pic' /></div>
            <div className="flex flex-row w-full items-start overflow-hidden">
                <div className="flex flex-col h-full w-[70%] lg:w-[75%] xl:w-[80%] overflow-hidden justify-center">
                    <span className="text-black dark:text-white font-semibold text-md leading-none">
                        {name}
                    </span>
                    <span className="text-xs text-[#2D3339] dark:text-[#D9D9D9] align-text-top text-clip overflow-hidden whitespace-nowrap leading-none">
                        {text}
                    </span>
                </div>
                <div className="justify-start flex-shrink-0 w-[30%] lg:w-[25%] xl:w-[20%] text-center">
                    <span className="text-xs text-[#2D3339] dark:text-[#5661F6] align-top">{datetime}</span>
                </div>
            </div>
        </div>
    );
};

export default Agent;
