import BgImage from "@/public/bg-pattern.svg";
import Image from "next/image";
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="w-screen h-screen fixed p-0 m-0 z-0">
                <div className="z-0  absolute left-10 bottom-[-20vh] w-[50vh] h-[50vh] flex-shrink-0 rounded-full bg-custom-gradient filter blur-[20vh]"></div>
                <div className="z-0  absolute right-[-5vh] bottom-[-10vh] w-[60vh] h-[60vh] flex-shrink-0 rounded-full bg-custom-gradient filter blur-[25vh]"></div>
                <div className="z-0 absolute top-[-20vh] left-[30vw] filter blur-[10px]">
                    <Image width="700" src={BgImage} alt={""} />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
                {children}
            </div>
        </>
    );
}
