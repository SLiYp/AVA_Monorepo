"use client";
import React, { useEffect } from "react";
import ChatComponent from "@/components/ChatComponent";
import { useSessionContext } from "@/lib/context/AgentContext";

export default function ChatSessionPage({
    params,
}: {
    params: { sessionId: string };
}) {
    const { session, setSession } = useSessionContext();

    useEffect(() => {
        setSession(params.sessionId);
    }, [params.sessionId, setSession]);

    if (!session) {
        return null;
    }

    return <ChatComponent sessionId={session} />;
}
