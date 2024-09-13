"use client";
import { useUser } from "@/lib/context/userContext";
import { pjs } from "../fonts";
export default function ChatPage() {
    const { user } = useUser();
    return (
        <div className="w-4/5 h-screen relative">
            <div className="h-[10%] text-black">Ok</div>
            <div
                className={`w-[90%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${pjs.className}`}
            >
                <h1 className="text-4xl font-semibold text-black">
                    Hey ! {user?.name}
                </h1>
                <p className="text-gray-500 text-4xl font-semibold">
                    Free to talk ? or anything you want to say?
                </p>
            </div>
        </div>
    );
}
