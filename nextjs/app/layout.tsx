import type { Metadata } from "next";
import { urbanist } from "./fonts";
import "./globals.css";
import { UserProvider } from "@/lib/context/userContext";
import "@uploadthing/react/styles.css";
import ThemeProvider from "@/utils/ThemeProvider";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export const metadata: Metadata = {
    title: "AVA",
    description: "Chatgpt for mental health",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={urbanist.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <ThemeSwitcher />
                    <UserProvider>{children}</UserProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
