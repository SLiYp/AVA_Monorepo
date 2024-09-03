import Image from "next/image";
import { FaCircleUp } from "react-icons/fa6";

export const Mental = () => {
    return (
        <div className="more-info-des mx-10 mt-40 flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
            <div className="more-info-msg w-2/3">
                <p className="mb-2">Mental Health Tracking</p>
                <hr className="h-2 w-5/6" />
                <h2 className="mt-6 text-8xl font-bold">
                Monitor your progress and get insights.
                </h2>
            </div>
            <div className="card mt-8 w-1/3">
                <div className="w-96 rotate-12 rounded-xl bg-[#262626] p-5">
                    <Image src="/mental.png" width={400} height={400} alt="Mental Image"/>
                </div>
            </div>
        </div>
    );
};
