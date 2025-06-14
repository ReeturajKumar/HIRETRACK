import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {ClerkProvider} from '@clerk/nextjs'
import { ToastProvider } from "@/providers/ToastProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});


export const metadata: Metadata = {
  title: "HIRETRACK - A Platform for Hiring",
  description: "JobSeeker & Recruiter Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
          <html lang="en" suppressContentEditableWarning>
      <body
        className={`${poppins.className}`}>
       <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
       >
       {children}
       <ToastProvider/>
       </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
