import clsx from "clsx";
import { FaArrowRight } from "react-icons/fa";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  arrow: boolean;
}
export const Button = ({
  children,
  arrow = false,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "flex flex-row items-center gap-4 border bg-white p-3 text-center uppercase text-black/100 transition-all ease-linear hover:border-white hover:bg-black hover:text-white",
        className,
      )}
      type="button"
      {...rest}
    >
      {children}
      {arrow && (
        <span>
          <FaArrowRight />
        </span>
      )}
    </button>
  );
};
