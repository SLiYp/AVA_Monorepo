import React, { useState, useEffect } from "react";
import { UploadButton } from "@/utils/uploadthing";

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

    useEffect(() => {
        setIsFormValid(name.trim() !== "" && image !== "" && category !== "");
    }, [name, image, category]);

    if (!isOpen) return null;

    const handleAdd = () => {
        if (isFormValid) {
            onAddAgent(name, image, category);
            setName("");
            setImage("");
            setCategory("");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="relative bg-black rounded-lg p-6 w-96">
                {!initial && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                )}
                <h2 className="text-xl font-bold mb-4">Add New Agent</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                            // Extract the URL from the response and store it
                            const url =
                                res[0]?.url ||
                                "https://utfs.io/f/5e775dab-aa37-439c-9297-64f50864d8fa-57m4i6.960x1024.png";
                            setImage(url);
                            console.log("Files: ", res);
                            alert("Upload Completed");
                        }}
                        onUploadError={(error: Error) => {
                            alert(`ERROR! ${error.message}`);
                        }}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Category
                    </label>
                    <div className="flex space-x-4">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="category-a"
                                name="category"
                                value="a"
                                checked={category === "a"}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mr-2"
                            />
                            <label
                                htmlFor="category-a"
                                className="text-sm font-medium"
                            >
                                A
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="category-b"
                                name="category"
                                value="b"
                                checked={category === "b"}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mr-2"
                            />
                            <label
                                htmlFor="category-b"
                                className="text-sm font-medium"
                            >
                                B
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="category-c"
                                name="category"
                                value="c"
                                checked={category === "c"}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mr-2"
                            />
                            <label
                                htmlFor="category-c"
                                className="text-sm font-medium"
                            >
                                C
                            </label>
                        </div>
                    </div>
                    <div className="mt-2">
                        {category === "a" && (
                            <p className="text-xs text-gray-600">
                                Text for category A goes here.
                            </p>
                        )}
                        {category === "b" && (
                            <p className="text-xs text-gray-600">
                                Text for category B goes here.
                            </p>
                        )}
                        {category === "c" && (
                            <p className="text-xs text-gray-600">
                                Text for category C goes here.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isFormValid
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                        disabled={!isFormValid}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
