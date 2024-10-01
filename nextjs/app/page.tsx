"use client";

import { Header } from "@/components/home/Header";
import { Button } from "@/components/home/button/Button";
import { Footer } from "@/components/home/Footer";
import { About } from "@/components/home/landing/About";
import { Moreinfo } from "@/components/home/landing/Moreinfo";
import { Research } from "@/components/home/landing/Research";
import { Join } from "@/components/home/landing/Join";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        console.log(process.env)
      if(localStorage.getItem("access_token")) router.push("/chat")
    },[])
    return (
        <main className="text-sm">
            <motion.section
                className="hero-section min-h-screen w-full bg-black bg-cover bg-fixed bg-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
            >
                {" "}
                <video
                    autoPlay
                    loop
                    muted
                    className="absolute left-0 top-0 h-full w-full object-cover"
                >
                    <source src="/landing-vid.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="relative z-10 min-h-screen bg-black bg-opacity-50">
                    <Header />
                    <motion.div
                        className="hero mt-32 flex flex-col items-center gap-5"
                        initial={{ y: "80%" }}
                        animate={{ y: "0%" }}
                        exit={{ opacity: 1, y: "80%" }}
                        transition={{ duration: 0.5, ease: "linear" }}
                    >
                        <h1 className="text-white text-center text-8xl font-bold">
                            Feeling Alone? <br />{" "}
                            <span className="text-[#885EFE]">Ava.ai</span> is
                            here for you
                        </h1>
                        <h3 className="max-w-[720px] text-center text-lg text-white">
                            Your friendly AI companion that listens, supports,
                            and empowers you on your journey to mental
                            well-being.
                        </h3>
                        <Button
                            type="button"
                            className="rounded-full px-8 font-semibold"
                            arrow={true}
                            onClick={() => {
                                router.push("/auth/sign-up");
                            }}
                        >
                            get started
                        </Button>
                    </motion.div>
                </div>
            </motion.section>
            <section
                className="info bg-cover bg-fixed bg-top-10 bg-no-repeat"
                style={{ backgroundImage: 'url("/gradient-bg.svg")' }}
            >
                <About />
                <Moreinfo />
                <Research />
                <Join />
            </section>
            <Footer />
        </main>
    );
}
