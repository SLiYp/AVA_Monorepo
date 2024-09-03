import Image from "next/image";
import { FaCircleUp } from "react-icons/fa6";

export const Education = () => {
    return (
        <div className="more-info-des mx-10 mt-40 flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
            <div className="more-info-msg w-2/3">
                <p className="mb-2">Educational Resources</p>
                <hr className="h-2 w-5/6" />
                <h2 className="mt-6 text-8xl font-bold">
                    Access articles, books, and research on mental health.
                </h2>
            </div>
            <div className="card mt-8 w-1/3 relative">
                <div className="w-[28rem] rotate-12 rounded-xl">
                    <div className="w-56 rounded-xl absolute top-0 right-0">
                        <Image
                            src="/book1.png"
                            width={300}
                            height={200}
                            alt="Book 1 Image"
                        />
                    </div>
                    <div className="w-56 rounded-xl absolute bottom-0 left-0">
                        <Image
                            src="/book2.png"
                            width={300}
                            height={200}
                            alt="Book 2 Image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
