"use client";

import Image from "next/image";
import { Button } from "../button/Button";
import { useScroll, motion, useTransform } from "framer-motion";
import { useRef } from "react";

export const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });

  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  return (
    <section className="about-us-section flex min-h-[80vh] justify-center" id="about">
      <motion.div
        className="about mt-40 flex h-auto max-w-5xl flex-row items-center justify-items-start gap-10 md:flex-row"
        ref={ref}
        style={{ scale: scaleProgress, opacity: scaleProgress }}
      >
        <div className="image-part w-1/2 rounded-md">
          <Image
            src={"/about-us-img.jpg"}
            width={700}
            height={500}
            alt="AR glasses image"
            className="rounded-2xl"
          />
        </div>
        <div className="about-us-explanation flex w-1/2 flex-col gap-5 text-white">
          {" "}
          <h3 className="font-semibold uppercase">about us</h3>
          <h1 className="text-4xl font-bold">
            Ava is Your Ai Champion for Mental Well-being
          </h1>
          <h3 className="text-lg ">
            Ava.ai is more than just an app; it&apos;s a revolution in mental
            wellness support. We&apos;re a team dedicated to building the
            world&apos;s leading AI companion, focused on fostering genuine
            connection and empowering individuals on their path to emotional
            well-being.
          </h3>
          <Button className="w-fit rounded-full px-8" arrow={true}>
            Know More
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
