"use client";
import { useUser } from "@/lib/context/userContext";
import { pjs } from "../fonts";
export default function ChatPage() {
    const { user } = useUser();
    return (
        <div className="flex flex-col flex-1 items-center">
            <div className="h-[10%] text-black"></div>
            <div className={`w-[90%] h-full flex flex-col justify-center ${pjs.className}`}>
                <h1 className="text-4xl font-semibold text-black dark:text-white">
                    Hey ! {user?.name}
                </h1>
                <p className="text-gray-500 text-4xl font-semibold">
                    Free to talk ? or anything you want to say?
                </p>
            </div>
        </div>
    );
}
