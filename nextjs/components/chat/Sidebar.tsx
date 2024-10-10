import React, { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import Agent from "./Agent";
import Dropdown from "./Dropdown";
import { useSessionContext } from "@/lib/context/AgentContext";
import { getCurrentUser } from "@/lib/services/authService";
import { createSession } from "@/lib/services/chatService";
import {
    getRandomCategory,
    getRandomHexColor,
    getRandomName,
} from "@/lib/chatFunctions";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/context/userContext";
import MiniAgent from "./MiniAgent";
import SidebarIcon from "../icons/SidebarIcon";
import { pjs, urbanist } from "@/app/fonts";
import ThemeSwitcher from "./ThemeSwitcher";

const AddModal = React.lazy(() => import("./AddModal"));

interface Agent {
    chatSessionId: string;
    name: string;
    image: string;
    category: string;
}

const Sidebar = () => {
    const [chats, setChats] = useState<string[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [min, setMin] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { session, setSession } = useSessionContext();
    const router = useRouter();
    const { user, logout } = useUser();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getCurrentUser();
                const chatSessions = data.chatSessions.reverse();
                setChats([
                    ...chatSessions.map((session: any) => {
                        return session.sessionId;
                    }),
                ]);
                const agentsData = chatSessions.map((chat: any) => ({
                    chatSessionId: chat.sessionId,
                    name: chat.name,
                    image: chat.image,
                    category: getRandomCategory(),
                }));
                setAgents(agentsData);
            } catch (error) {
                console.error("Error fetching chats:", error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleAddNewAgent = () => {
        setModalOpen(true);
        setDropdownVisible(false);
    };

    const signOut = () => {
        logout();
        router.push("/");
    };

    const handleAddAgent = async (
        name: string,
        image: string,
        category: string
    ) => {
        try {
            const chatSessionId = await createSession({ name, image, category });
            console.log(chatSessionId);
            if (chatSessionId) {
                const newAgent = {
                    chatSessionId,
                    name,
                    image,
                    category,
                };
                setChats((prevChats) => [chatSessionId, ...prevChats]);
                setAgents((prevAgents) => [newAgent, ...prevAgents]);
                alert("Agent added successfully!");
            }
        } catch (error) {
            console.error("Error adding agent:", error);
            alert("An error occurred while adding the agent.");
        }
    };

    return (
        <div
            className={`h-dvh relative ${
                min ? "w-24" : "w-1/5 min-w-[13rem]"
            } bg-[#B0CBC9] dark:bg-black px-4 py-8 flex flex-col justify-between rounded-r-xl ${
                pjs.className
            } text-black dark:text-white`}
            // transition-all duration-300 ease-in-out
        >
            <div className="mb-2">
                <div
                    className={`flex ${
                        min ? "flex-col gap-4 pb-4" : "flex-row"
                    } justify-between items-center`}
                >
                    <div
                        className="cursor-pointer"
                        onClick={() => setMin(!min)}
                    >
                        <SidebarIcon />
                    </div>
                    <div
                        className={`relative ${min ? "hidden" : null}`}
                        ref={dropdownRef}
                    >
                        <EllipsisVertical
                            color="#6A6969"
                            onClick={() => setDropdownVisible(!dropdownVisible)}
                            className="cursor-pointer"
                        />
                        {dropdownVisible && (
                            <Dropdown
                                onAddNewAgent={handleAddNewAgent}
                                closeDropdown={() => setDropdownVisible(false)}
                            />
                        )}
                    </div>
                </div>
                <h2
                    className={`text-lg font-semibold mt-8 mb-2 ${
                        min ? "hidden" : null
                    }`}
                >
                    Your Conversations
                </h2>
                <div
                    className={`space-y-1 overflow-y-auto custom-scrollbar max-h-[28rem]`}
                >
                    {chats.length === 0 ? (
                        <Suspense fallback={<div>Loading...</div>}>
                            <AddModal
                                isOpen={true}
                                initial={true}
                                onClose={() => setModalOpen(false)}
                                onAddAgent={handleAddAgent}
                            />
                        </Suspense>
                    ) : (
                        agents.map((a) =>
                            min ? (
                                <MiniAgent
                                    key={a.chatSessionId}
                                    chat_id={a.chatSessionId}
                                    image={a.image}
                                    onClick={() => {
                                        setSession(a.chatSessionId);
                                        router.replace(
                                            `/chat/${a.chatSessionId}`
                                        );
                                    }}
                                />
                            ) : (
                                <Agent
                                    key={a.chatSessionId}
                                    chat_id={a.chatSessionId}
                                    name={a.name}
                                    image={a.image}
                                    category={a.category}
                                    onClick={() => {
                                        setSession(a.chatSessionId);
                                        router.replace(
                                            `/chat/${a.chatSessionId}`
                                        );
                                    }}
                                />
                            )
                        )
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
                <ThemeSwitcher mini={min} />
                <div
                    className={`border-white border-2 rounded-full ${
                        min
                            ? null
                            : "space-x-2 w-full flex flex-row items-center"
                    } p-2 cursor-pointer`}
                    onClick={signOut}
                >
                    <div className="w-[30px] h-[30px] rounded-full bg-white overflow-hidden">
                        <Image
                            src={user ? user.image : "/profile.png"}
                            alt="Profile Pic"
                            width={30}
                            height={30}
                        />
                    </div>
                    <span
                        className={`${min ? "hidden" : null} ${
                            urbanist.className
                        }`}
                    >
                        <i>{user?.name}</i>
                    </span>
                </div>
            </div>
            {modalOpen && (
                <AddModal
                    isOpen={modalOpen}
                    initial={false}
                    onClose={() => setModalOpen(false)}
                    onAddAgent={handleAddAgent}
                />
            )}
        </div>
    );
};

export default Sidebar;
