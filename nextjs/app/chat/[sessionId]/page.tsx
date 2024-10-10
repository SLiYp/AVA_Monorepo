// ChatSessionPage.tsx

"use client";

import React, { useEffect } from "react";
import ChatComponent from "@/components/ChatComponent";
import { useSessionContext } from "@/lib/context/AgentContext";
import { useUser } from "@/lib/context/userContext";
import { useRouter } from "next/navigation"; // To enable client-side navigation

export default function ChatSessionPage({
    params,
}: {
    params: { sessionId: string };
}) {
    const { session, setSession } = useSessionContext();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        setSession(params.sessionId);
    }, [params.sessionId, setSession]);

    useEffect(() => {
        if (user && session) {
            const sessionExists = user.chatSessions?.some(
                (chatSession) => chatSession.sessionId === session
            );

            if (!sessionExists) {
                router.push("/chat");
            }
        }
    }, [user, session, router]);

    if (
        !session ||
        !user ||
        !user.chatSessions ||
        !user.chatSessions.some(
            (chatSession) => chatSession.sessionId === session
        )
    ) {
        return null;
    }

    return <ChatComponent sessionId={session} />;
}
