import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RCKL DiRaja - Rotary Club of Kuala Lumpur DiRaja | Directory & Portal 2026/27",
  description: "Official digital portal and member directory of the Rotary Club of Kuala Lumpur DiRaja (Founded 1928, Chartered 1930). Compliant with Malaysia Personal Data Protection (Amendment) Act 2024 (PDPA 2.0 / Act 709).",
  keywords: ["Rotary Club of Kuala Lumpur DiRaja", "RCKL DiRaja", "District 3300", "Member Directory", "PDPA 2.0", "Act 709", "Data Protection Officer"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
