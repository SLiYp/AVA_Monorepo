import React from "react";
import clsx from "clsx";

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const AuthButton = ({
  children,
  className,
  ...rest
}: AuthButtonProps) => {
  return (
    <button
      type="submit"
      className={clsx(
        "mb-6 mt-3 w-56 rounded-sm bg-blue-700 px-10 py-2 hover:border hover:border-white",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
