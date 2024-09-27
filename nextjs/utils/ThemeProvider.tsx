"use client";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";


export default function ThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}