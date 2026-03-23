import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Resume2Apply - Build, Tweak, Apply",
  description: "The resume and job application platform. Build your CV, tweak templates, and manage your job applications in one clean workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans select-none">
        <Analytics/>
        <Toaster position="bottom-right" richColors />
        {children}
      </body>
    </html>
  );
}
