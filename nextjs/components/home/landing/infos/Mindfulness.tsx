import Image from "next/image";
import { FaCircleUp } from "react-icons/fa6";

export const Mindfulness = () => {
    return (
        <div className="more-info-des mx-10 mt-40 flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
            <div className="more-info-msg w-2/3">
                <p className="mb-2">Mindfulness & Relaxation Techniques</p>
                <hr className="h-2 w-5/6" />
                <h2 className="mt-6 text-8xl font-bold">
                    Learn tools to manage stress and improve sleep.
                </h2>
            </div>
            <div className="card mt-8  w-1/3">
                <div className="rotate-12 p-5 flex justify-end">
                    <Image
                        src="/mind.png"
                        width={400}
                        height={400}
                        alt="Mind Image"
                    />
                </div>
            </div>
        </div>
    );
};
