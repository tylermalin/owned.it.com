import type { Metadata } from "next";
import { Libre_Baskerville, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "OWNED - Stack sats, not subscriptions",
  description: "Crypto-native creator commerce. Get paid onchain without platform risk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreBaskerville.variable} ${inter.variable} font-sans antialiased text-foreground bg-background`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
