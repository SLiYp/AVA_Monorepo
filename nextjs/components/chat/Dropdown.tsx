import React from "react";

interface DropdownProps {
    onAddNewAgent: () => void;
    closeDropdown: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
    onAddNewAgent,
    closeDropdown,
}) => {
    return (
        <div className="absolute bg-[#70b8b3] dark:bg-gray-700 shadow-lg rounded-lg p-2 right-0 mt-2">
            <ul className="list-none m-0 p-0">
                <li
                    onClick={() => {
                        onAddNewAgent();
                        closeDropdown();
                    }}
                    className="cursor-pointer p-2 whitespace-nowrap"
                >
                    Add New Agent
                </li>
            </ul>
        </div>
    );
};

export default Dropdown;
