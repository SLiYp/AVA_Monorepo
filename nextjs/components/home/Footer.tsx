import Image from "next/image";
import Link from "next/link";
import {
    FaDiscord,
    FaFacebookMessenger,
    FaInstagram,
    FaLinkedin,
} from "react-icons/fa";
import { MdMailOutline, MdOutlineMail, MdOutlinePhone } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
export const Footer = () => {
    const legal = [
        { link: "/", data: "Privacy policy" },
        { link: "/terms-and-services", data: "Terms & Services" },
        { link: "/terms-of-user", data: "Terms of use" },
        { link: "/refund-policy", data: "Refund policy" },
    ];

    const sitelinks = [
        { link: "/", data: "Home" },
        { link: "/about", data: "About Us" },
        { link: "/solutions", data: "Solutions" },
        { link: "/research", data: "Research" },
    ];

    const research = [
        { link: "/", data: "Overview" },
        { link: "/index", data: "Index" },
    ];

    const features = [
        { link: "/", data: "Ava.ai" },
        { link: "/", data: "Realtime avatars" },
        { link: "/", data: "Marketplace" },
        { link: "/", data: "Analytics" },
    ];
    return (
        <footer className="bg-[#0D0D0D] w-full py-5 px-20 text-white" id="footer">
            <ul className="flex  flex-col flex-wrap  justify-between gap-5 sm:flex-row">
                <li className="flex  flex-col gap-2">
                    <h1 className="mb-1 text-2xl font-bold">Research</h1>
                    {research.map((item) => (
                        <Link
                            key={uuidv4()}
                            href={item.link}
                            className="text-lg hover:text-purple-400"
                        >
                            {item.data}
                        </Link>
                    ))}
                </li>
                <li className="flex flex-col gap-2">
                    <h1 className="mb-1 text-2xl font-bold">Features</h1>
                    {features.map((item) => (
                        <Link
                            key={uuidv4()}
                            href={item.link}
                            className="text-lg hover:text-purple-400"
                        >
                            {item.data}
                        </Link>
                    ))}
                </li>
                <li className="flex flex-col gap-2">
                    <h1 className="mb-1 text-2xl font-bold">Legal</h1>
                    {legal.map((item) => (
                        <Link
                            key={uuidv4()}
                            className="text-lg hover:text-purple-400"
                            href={item.link}
                        >
                            {item.data}
                        </Link>
                    ))}
                </li>
                <li className="flex flex-col gap-2">
                    <h1 className="mb-1 text-2xl font-bold">Company</h1>
                    {sitelinks.map((item) => (
                        <Link
                            key={uuidv4()}
                            className="text-lg hover:text-purple-400"
                            href={item.link}
                        >
                            {item.data}
                        </Link>
                    ))}
                </li>
                <li className="flex flex-col gap-6 justify-start">
                    <div className="flex flex-row items-center gap-2">
                        <Image
                            src="/ava-darkBG-logo.png"
                            width={40}
                            height={40}
                            alt="Ava Logo"
                        />
                        <h4 className="text-2xl font-semibold">Ava.ai</h4>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <MdOutlinePhone className="h-5 w-5" />
                        <p>+91 94836 09845</p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <MdMailOutline className="h-5 w-5" />
                        <p>goutham@ava.com</p>
                    </div>
                    <div className="other-socials flex gap-5">
                        <FaDiscord className="h-5 w-5" />
                        <FaInstagram className="h-5 w-5" />
                        <FaLinkedin className="h-5 w-5" />
                        <FaFacebookMessenger className="h-5 w-5" />
                    </div>
                </li>
            </ul>
            <div className="footer-ending mt-10 flex justify-between py-3  ">
                <h1 className="flex items-center text-lg text-gray-300">
                    Ava.ai © 2024
                </h1>
            </div>
        </footer>
    );
};
