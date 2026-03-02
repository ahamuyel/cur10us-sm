import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/provider/theme";
import { AuthProvider } from "@/provider/auth";
import { SchoolBrandProvider } from "@/provider/school-brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cur10usX",
  description: "Plataforma de gestão escolar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SchoolBrandProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SchoolBrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
