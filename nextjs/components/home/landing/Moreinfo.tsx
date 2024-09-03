"use client";

import { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { Conversation } from "./infos/Conversation";
import { Mental } from "./infos/Mental";
import { Mindfulness } from "./infos/Mindfulness";
import { Education } from "./infos/Education";

export const Moreinfo = () => {
    const ref1 = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref1,
        offset: ["0 1", "1.33 1"],
    });

    const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
    return (
        <section
            className="more-info-section mt-40 min-h-screen w-full text-white"
            id="solutions"
        >
            <motion.div
                className="more-info "
                ref={ref1}
                style={{ scale: scaleProgress, opacity: scaleProgress }}
            >
                <h1 className="text-center text-8xl font-bold text-gray-300 opacity-20">
                    How Ava.ai Can Help
                </h1>
                <Conversation />
                {/* <Mental />
                <Mindfulness />
                <Education /> */}
            </motion.div>
        </section>
    );
};
