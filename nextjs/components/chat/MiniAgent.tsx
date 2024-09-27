import { useSessionContext } from "@/lib/context/AgentContext";
import { getSession } from "@/lib/services/chatService";
import React, { useEffect, useState } from "react";

interface MiniAgentProps {
    chat_id: string;
    image: string;
    onClick?: () => void;
}

const MiniAgent = ({ chat_id, image, onClick }: MiniAgentProps) => {
    const { session, setSession } = useSessionContext();

    const style = {
        backgroundColor: image,
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`cursor-pointer hover:bg-[#9CBEBC] p-2 rounded-full ${
                    session == chat_id ? "bg-[#9CBEBC]" : "bg-inherit"
                }`}
                onClick={onClick}
            >
                <div
                    className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden bg-white`}
                    style={style}
                ><img src={image} alt='Profile Pic' /></div>
            </div>
        </div>
    );
};

export default MiniAgent;
