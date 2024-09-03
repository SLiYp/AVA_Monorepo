import React from 'react';

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center h-full w-full">
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
);

export default LoadingSpinner;
