import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import PersonaComponent from "../PersonaComponent";
import { CameraIcon } from "lucide-react";

const bioData = [
    {
        id: "A",
        title: "Friendly & Casual",
        bio: "Meet Alex, your easy-going, approachable chat agent. Alex loves keeping things light and breezy, ensuring every conversation feels natural and welcoming. Whether you’re asking for help or just need a friendly chat, Alex is always there with a smile (figuratively) and a helpful answer. With a knack for breaking down complex ideas into simple terms, Alex makes even the most technical questions seem like a breeze.",
    },
    {
        id: "B",
        title: "Professional & Formal",
        bio: "Introducing Clara, your virtual agent with a professional edge. Clara takes a formal and polished approach to every interaction, ensuring that information is delivered clearly, accurately, and with utmost respect. If you’re looking for detailed, precise responses and a serious tone to match your queries, Clara has you covered. Perfect for business settings or users who prefer a no-nonsense, authoritative assistant.",
    },
    {
        id: "C",
        title: "Supportive & Empathetic",
        bio: "Say hello to Emma, a virtual agent designed to be your personal support system. Emma is calm, patient, and empathetic, making sure that every interaction is filled with understanding and care. Whether you’re navigating a difficult issue or just need reassurance, Emma listens first and responds with thoughtful guidance. With a nurturing presence, Emma creates a safe space for users to ask questions without feeling rushed or judged.",
    },
    {
        id: "D",
        title: "Informative & Direct",
        bio: "Meet Max, the get-straight-to-the-point virtual agent. Max values your time and ensures that every answer is concise and on target. No fluff, no small talk—just the facts you need to solve your problem quickly. Max is perfect for users who appreciate efficiency and clarity, delivering sharp, well-organized responses to even the trickiest of questions.",
    },
    {
        id: "E",
        title: "Cheerful & Motivational",
        bio: "Introducing Sunny, your always-optimistic chat agent! Sunny brings a burst of positivity to every conversation, offering not just answers but a dose of encouragement along the way. If you’re feeling overwhelmed or stuck, Sunny knows how to cheer you up and keep you motivated. With an energetic, can-do attitude, Sunny makes every interaction feel uplifting, no matter the topic.",
    },
    {
        id: "F",
        title: "Inquisitive & Problem-Solver",
        bio: "Say hello to Quinn, your problem-solving virtual agent. Quinn is naturally curious and loves digging deep into issues, asking smart questions to fully understand your needs. Whether it's a complex technical issue or a simple question, Quinn approaches every interaction like a puzzle to solve, making sure no detail is overlooked. Ideal for users who need someone to thoroughly investigate and resolve their queries.",
    },
    {
        id: "G",
        title: "Relaxed & Mindful",
        bio: "Meet Zen, the virtual agent with a mindful, slow-paced approach. Zen believes in taking the time to breathe and think things through. Every conversation is handled with calm precision, giving users a chance to reflect and engage at their own pace. Perfect for users who want a relaxed and measured interaction, Zen turns every chat into a soothing experience, no rush involved.",
    },
];
interface ModalProps {
    isOpen: boolean;
    initial: boolean;
    onClose: () => void;
    onAddAgent: (name: string, image: string, category: string) => void;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    initial,
    onClose,
    onAddAgent,
}) => {
    const [name, setName] = useState("");
    const [image, setImage] = useState<string>("");
    const [category, setCategory] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<string>(
        "Select Profile Picture"
    );

    useEffect(() => {
        setIsFormValid(name.trim() !== "" && image !== "" && category !== "");
    }, [name, image, category]);

    if (!isOpen) return null;

    const clearAll = () => {
        setName("");
        setImage("");
        setCategory("");
        setUploadStatus("Select Profile Picture");
    };
    const handleAdd = () => {
        if (isFormValid) {
            onAddAgent(name, image, category);
            clearAll();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="relative bg-[#F7F4F0] dark:bg-black rounded-lg p-6 w-3/5 h-[90%]">
                {!initial && (
                    <button
                        onClick={() => {
                            onClose();
                            clearAll();
                        }}
                        className="absolute text-2xl top-2 right-5 text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                )}
                <h2 className="text-xl font-bold mb-4">Add New Agent</h2>

                <div className="flex flex-col items-center overflow-y-scroll custom-scrollbar max-h-[92%]">
                    <div className="relative group w-20 h-20 rounded-full flex-shrink-0 overflow-hidden">
                        <Image
                            src={image ? image : "/profile.png"}
                            alt="Image Placeholder"
                            fill
                        />

                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <CameraIcon className="w-10 h-10 text-[#70b8b3] dark:text-purple-500" />
                        </div>

                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                // Extract the URL from the response and store it
                                const url = res[0]?.url || image;
                                setImage(url);
                                setUploadStatus("Successfully Uploaded. Want to change?");
                            }}
                            onUploadError={(error: Error) => {
                                setUploadStatus(error.message);
                            }}
                            onUploadBegin={() =>
                                setUploadStatus("Uploading...")
                            }
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <p className="text-sm mb-6 text-[#70b8b3] dark:text-[#9747FF] mt-2">
                        {uploadStatus}
                    </p>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-white dark:bg-[#191919] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70b8b3] dark:focus:ring-purple-500"
                            required
                        />
                    </div>

                    <div className="mb-2 w-1/2 flex flex-col items-center">
                        <p className="text-[#70b8b3] dark:text-[#9747FF] text-center">
                            Agent Persona and Behavior
                        </p>
                        <p className="text-xs text-center">
                            Select the persona that best describes how your
                            virtual agent interacts with users, including their
                            communication style and expertise.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {bioData.map((data, index) => (
                            <PersonaComponent
                                key={index}
                                {...data}
                                category={category}
                                setCategory={setCategory}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-2">
                        <button
                            onClick={() => {
                                onClose();
                                clearAll();
                            }}
                            className="px-4 py-2 bg-[#191919] hover:bg-[#3b3a3a] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700 text-red-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#70b8b3] dark:focus:ring-[#9747FF] ${
                                isFormValid
                                    ? "bg-[#70b8b3] dark:bg-[#9747FF] hover:bg-[#B0CBC9] hover:dark:bg-[#ae7cf0]"
                                    : "bg-gray-400 text-gray-700 cursor-not-allowed"
                            }`}
                            disabled={!isFormValid}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
