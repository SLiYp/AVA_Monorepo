import React from "react";

const PulsatingDots: React.FC = () => {
    return (
        <div className="flex justify-center mt-3">
            <div className="w-2 h-2 mx-1 bg-gray-600 rounded-full animate-bounce opacity-100"></div>
            <div
                className="w-2 h-2 mx-1 bg-gray-600 rounded-full animate-bounce opacity-100"
                style={{ animationDelay: "0.2s" }}
            ></div>
            <div
                className="w-2 h-2 mx-1 bg-gray-600 rounded-full animate-bounce opacity-100"
                style={{ animationDelay: "0.4s" }}
            ></div>
        </div>
    );
};

export default PulsatingDots;
