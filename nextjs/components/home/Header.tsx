import Image from "next/image";
import Link from "next/link";
import { Button } from "./button/Button";
import { useRouter } from "next/navigation";

export const Header = () => {
    const router = useRouter();
    return (
        <header className="mx-5 flex items-center justify-between py-8">
            <div className="logo flex items-center">
                <Image
                    src={"/ava-logo-removebg.png"}
                    width={56}
                    height={56}
                    alt="Ava.ai logo"
                />
                <h1 className="text-3xl text-white font-semibold">Ava.ai</h1>
            </div>
            {/* <div className="flex flex-row gap-20"> */}
                <nav className="flex items-center gap-20 font-semibold">
                    <Link
                        href={"/"}
                        className="text-white hover:text-purple-400"
                    >
                        HOME
                    </Link>
                    <Link
                        href={"#about"}
                        className="text-white hover:text-purple-400"
                    >
                        ABOUT US
                    </Link>
                    <Link
                        href={"#solutions"}
                        className="text-white hover:text-purple-400"
                    >
                        SOLUTIONS
                    </Link>
                    <Link
                        href={"#research"}
                        className="text-white hover:text-purple-400"
                    >
                        RESEARCH
                    </Link>
                    <Link
                        href={"#footer"}
                        className="text-white hover:text-purple-400"
                    >
                        CONTACT US
                    </Link>
                </nav>
                <Button
                    className="rounded-xl px-5 normal-case"
                    arrow={false}
                    onClick={() => router.push("/auth/sign-up")}
                >
                    Try Ava
                </Button>
            {/* </div> */}
        </header>
    );
};
