import { useTheme } from "next-themes";
import React from "react";

export default function UserMessageTail() {
    const { theme } = useTheme();
    const color = theme === "light" ? "#9CBEBC" : "#5661F6";
    return (
        <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M27 0H9.81818H0V25.5L16.5 27C16.5 27 15.8496 17.4971 16.5 12C17.4008 4.38636 27 0 27 0Z"
                fill={color}
            />
        </svg>
    );
}
