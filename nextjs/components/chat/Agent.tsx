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

const Agent = ({ chat_id,name,image, category, onClick }: AgentProps) => {
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
            className={`flex items-center space-x-2 cursor-pointer -mx-4 hover:bg-gray-800 p-2 rounded-md ${
                session == chat_id ? "bg-gray-800" : "bg-inherit"
            }`}
            onClick={onClick}
        >
            <div className={`w-8 h-8 rounded-full flex-shrink-0`} style={style}></div>
            <div className="flex flex-col w-full overflow-hidden"> 
                <div className="flex flex-row justify-between items-center">
                    <span>{name}</span>
                    <span className="font-thin text-xs text-[#5661F6]">{datetime}</span>
                </div>
                <span className="font-thin text-xs text-[#CBCBCB] truncate">{text}</span>
            </div>
        </div>
    );
};

export default Agent;
