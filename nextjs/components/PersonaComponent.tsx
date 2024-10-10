import React, { useRef } from "react";

interface PersonaProps {
    id: string;
    title: string;
    bio: string;
    category: string;
    setCategory: (category: string) => void;
}

const Dropdown: React.FC<PersonaProps> = ({ id, title, bio, category, setCategory }) => {
    return (
        <div
            className={`w-[45%] ${category === id ? "dark:bg-[#9747FF] bg-[#70b8b3]" : "bg-[#B0CBC9] dark:bg-[#191919]" } rounded-lg p-3 cursor-pointer hover:outline hover:outline-2 dark:hover:outline-purple-600 hover:outline-[#70b8b3]`}
            
            onClick={() => {
                setCategory(id);
            }}
        >
            <p className="text-sm font-semibold mb-2">{title}</p>
            <p className="text-xs">{bio}</p>
        </div>
    );
};

export default Dropdown;
