"use client";
import React, { Suspense, useState } from "react";
import Sidebar from "@/components/chat/Sidebar";
import { sessionContext } from "@/lib/context/AgentContext";
import LoadingSpinner from "@/components/chat/LoadingSpinner";

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<string | null>(null);
    return (
        <div className="flex h-screen bg-[#F7F4F0] text-white">
            <sessionContext.Provider value={{ session, setSession }}>
                <Sidebar />
                {children}
            </sessionContext.Provider>
        </div>
    );
}
