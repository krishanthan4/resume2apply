import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume2Apply - Build, Tweak, Apply",
  description: "The self-hosted resume and job application platform. Build your CV, tweak templates, and manage your job applications in one clean workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans select-none">
        <Toaster position="bottom-right" richColors />
        {children}
      </body>
    </html>
  );
}
