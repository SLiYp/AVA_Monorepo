import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ExtAuthProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ExtAuthButton = ({
  children,
  className,
  ...rest
}: ExtAuthProps) => {
  return (
    <button
      className={clsx("rounded-sm bg-white px-8 py-3", className)}
      {...rest}
    >
      {children}
    </button>
  );
};
