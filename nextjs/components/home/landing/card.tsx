import { cardType } from "./Research";
import Image from "next/image";

export const Card = ({ card }: { card: cardType }) => {
  console.log(card);
  return (
    <div className="card flex w-[420px] flex-col items-center gap-3 rounded-xl bg-white/10 p-4 text-white">
      <Image
        src={card.image}
        width={400}
        height={200}
        alt="card image"
        className="rounded-xl"
      />
      <h3 className="text-3xl">{card.heading}</h3>
      <p className="font-thin text-lg">{card.des}</p>
      <div className="mt-5 flex w-full font-thin justify-between">
        <span>{card.date}</span>
        <div className="flex flex-row gap-2 items-center"><Image
        src={card.profilePic}
        width={20}
        height={20}
        alt="card image"
        className="rounded-xl"
      /><span>{card.author}</span></div>
      </div>
    </div>
  );
};
