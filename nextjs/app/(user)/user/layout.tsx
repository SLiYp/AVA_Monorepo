import Image from 'next/image';
export default function UserLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (

        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black">
            {children}
        </div>

    );
  }