import React from "react";
import { Mic, Send } from "lucide-react";
import { pjs } from "@/app/fonts";

interface TextInputProps {
    loading: boolean;
    handleSendMessage: () => void;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    setVoice: React.Dispatch<React.SetStateAction<boolean>>;
    inputMessage: string;
}

const TextInput = ({
    loading,
    handleSendMessage,
    setInputMessage,
    setVoice,
    inputMessage,
}: TextInputProps) => {
    return (
        <>
            <input
                type="text"
                placeholder="What's in your mind..."
                className={`flex-1 bg-transparent outline-none text-black placeholder:text-black dark:text-white placeholder:dark:text-white placeholder:text-sm placeholder:italic ${pjs.className}`}
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInputMessage(e.target.value)
                }
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    !loading && e.key === "Enter" && handleSendMessage()
                }
            />
            <div
                className={`w-8 h-8 mx-1 rounded-full flex flex-shrink-0 items-center justify-center bg-[#F7F4F0] cursor-pointer`}
                onClick={() => setVoice(true)}
            >
                <Mic className="text-black w-4" />
            </div>
            <div
                className={`w-8 h-8 mx-1 rounded-full flex flex-shrink-0 items-center justify-center ${
                    loading
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-[#F7F4F0] cursor-pointer"
                }`}
                onClick={() => !loading && handleSendMessage()}
            >
                <Send className="text-black w-4" />
            </div>
        </>
    );
};

export default TextInput;
