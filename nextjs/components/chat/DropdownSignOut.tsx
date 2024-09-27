import React from "react";

interface DropdownSignOutProps {
    onSignOut: () => void;
    closeDropdownSignOut: () => void;
}

const DropdownSignOut: React.FC<DropdownSignOutProps> = ({
    onSignOut,
    closeDropdownSignOut,
}) => {
    return (
        <div className="absolute bg-gray-700 shadow-lg rounded-lg p-2 right-0 mt-2">
            <ul className="list-none m-0 p-0">
                <li
                    onClick={() => {
                        onSignOut();
                        closeDropdownSignOut();
                    }}
                    className="cursor-pointer p-2 whitespace-nowrap"
                >
                    Sign Out
                </li>
            </ul>
        </div>
    );
};

export default DropdownSignOut;
