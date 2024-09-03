import React from "react";
import PulsatingDots from "./PulsatingDots";

interface BubbleProps {
    text: string;
    isUser: boolean;
    isloading: boolean;
}

const Bubble: React.FC<BubbleProps> = ({ text, isUser, isloading }) => {
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`relative flex ${
                    isUser ? "flex-row-reverse" : "flex-row"
                } max-w-[80%]`}
            >
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUser ? "bg-blue-500" : "bg-gray-600"
                    } ${isUser ? "ml-2" : "mr-2"}`}
                >
                    {isUser ? "👤" : "🤖"}
                </div>

                {isloading ? (
                    <PulsatingDots />
                ) : (
                    <div
                        className={`relative px-4 py-2 mt-3 rounded-[20px] ${
                            isUser ? "bg-[#5661F6] mr-1" : "bg-[#2B292E] ml-1"
                        }`}
                    >
                        <p className="text-sm px-1">{text}</p>
                        <div
                            className={`absolute top-0 ${
                                isUser ? "right-[-8px]" : "left-[-8px]"
                            }`}
                        >
                            {isUser ? (
                                <svg
                                    width="27"
                                    height="27"
                                    viewBox="0 0 27 27"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M27 0H9.81818H0V25.5L16.5 27C16.5 27 15.8496 17.4971 16.5 12C17.4008 4.38636 27 0 27 0Z"
                                        fill="#5661F6"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    width="27"
                                    height="27"
                                    viewBox="0 0 27 27"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M0 0H17.1818H27V25.5L10.5 27C10.5 27 11.1504 17.4971 10.5 12C9.59923 4.38636 0 0 0 0Z"
                                        fill="#2B292E"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bubble;
