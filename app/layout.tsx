import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Joachim Cishugi — Développeur web et logiciel",
  description: "Le portfolio de Joachim Cishugi.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script id="reset-portfolio-scroll" strategy="beforeInteractive">
          {`history.scrollRestoration = 'manual'; window.scrollTo({ top: 0, left: 0, behavior: 'instant' });`}
        </Script>
        {children}
      </body>
    </html>
  );
}
