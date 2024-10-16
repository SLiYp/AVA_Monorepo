"use client";

import React, { useEffect, useRef, useState } from "react";
import { Prompt } from "@/lib/interfaces";
import Bubble from "./chat/Bubble";
import { chatComplition, getSession } from "@/lib/services/chatService";
import PulsatingDots from "./chat/PulsatingDots";
import TextInput from "./chat/TextInput";
import VoiceInput from "./chat/VoiceInput";

interface ChatComponentProps {
    sessionId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ sessionId }) => {
    const [inputMessage, setInputMessage] = useState<string>("");
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [voice, setVoice] = useState<boolean>(false);

    const scrollableContentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getSession(sessionId);
                setPrompts(data.prompts);
                console.log(data);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }
        fetchData();
    }, [sessionId]);

    useEffect(() => {
        if (scrollableContentRef.current) {
            scrollableContentRef.current.scrollTop =
                scrollableContentRef.current.scrollHeight;
        }
    }, [prompts]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;
        setLoading(true);

        const newPrompt: Prompt = {
            promptId: prompts.length + 1,
            prompt: inputMessage,
            responses: [],
        };

        setPrompts((prevPrompts) => [
            ...prevPrompts,
            { ...newPrompt, responses: [""] },
        ]);
        setInputMessage("");

        try {
            const res = await chatComplition({
                sessionId: sessionId,
                id: newPrompt.promptId,
                text: newPrompt.prompt,
            });

            setPrompts((prevPrompts) =>
                prevPrompts.map((prompt) =>
                    prompt.promptId === newPrompt.promptId
                        ? {
                              ...prompt,
                              responses: [
                                  ...prompt.responses.slice(0, -1),
                                  res
                                      ? res
                                      : "Server Error",
                              ],
                          }
                        : prompt
                )
            );

            setLoading(false);
        } catch (error) {
            console.error("Error sending message:", error);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center flex-1">
            <div className="h-[10%] text-black"></div>
            <div
                className="flex-1 flex p-4 overflow-y-auto justify-center custom-scrollbar w-full"
                ref={scrollableContentRef}
            >
                <div className="space-y-4 w-4/5">
                    {prompts.map((message, index) => (
                        <div key={index}>
                            <Bubble
                                text={message.prompt}
                                isUser={true}
                                isloading={false}
                            />
                            {message.responses.map((response, idx) => (
                                <Bubble
                                    key={`${index}-${idx}`}
                                    text={response}
                                    isUser={false}
                                    isloading={response === ""}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 w-4/5 flex justify-center">
                <div className="flex items-center bg-[#B0CBC9] dark:bg-black rounded-2xl px-4 py-2 w-full">
                    {voice ? (
                        <VoiceInput setVoice={setVoice} />
                    ) : (
                        <TextInput
                            loading={loading}
                            handleSendMessage={handleSendMessage}
                            setInputMessage={setInputMessage}
                            setVoice={setVoice}
                            inputMessage={inputMessage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
