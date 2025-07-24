import type { Metadata } from "next";
import { Inter, Crimson_Text } from "next/font/google";
import "./globals.css";
import { ScrollLayout } from "@/components/layout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sidequest Beta - Real Adventures Await",
  description: "Push yourself outside your comfort zone with meaningful, authentic experiences. Combat social media superficiality through real-world adventures. Now featuring stargazing adventures!",
  keywords: "adventure, experiences, quests, authentic, meaningful, outdoor, activities",
  authors: [{ name: "Sidequest Team" }],
  creator: "Sidequest",
  publisher: "Sidequest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sidequest.app",
    siteName: "Sidequest",
    title: "Sidequest Beta - Real Adventures Await",
    description: "Push yourself outside your comfort zone with meaningful, authentic experiences. Now featuring stargazing adventures!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidequest Beta - Real Adventures Await",
    description: "Push yourself outside your comfort zone with meaningful, authentic experiences. Now featuring stargazing adventures!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <body>
        <ScrollLayout>
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
