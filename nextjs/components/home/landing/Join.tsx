"use client";

import { FaArrowRightLong } from "react-icons/fa6";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const Join = () => {
  const ref2 = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref2,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <section className="flex min-h-[80vh] items-center justify-center">
      <motion.div
        className="join-program-section h-96 w-9/12 rounded-xl bg-cover bg-no-repeat"
        style={{
          backgroundImage: 'url("/join-bg.svg")',
          scale: scaleProgress,
          opacity: scaleProgress,
        }}
        ref={ref2}
      >
        <div className="join-program-data flex flex-col items-center">
          <h1 className="mt-14 py-5 text-white text-center text-5xl font-semibold leading-snug">
            Join Our Beta Program in building the next big revolution in
            emotional intelligence.{" "}
          </h1>
          <span className="flex w-9/12  justify-between border border-b-2 border-l-0 border-r-0 border-t-0 border-gray-500 py-2 ">
            <input
              type="text"
              name=""
              id=""
              placeholder="Email"
              className="w-full bg-transparent text-lg outline-none"
            />
            <FaArrowRightLong className="h-auto w-5 text-gray-500" />
          </span>
        </div>
      </motion.div>
    </section>
  );
};
