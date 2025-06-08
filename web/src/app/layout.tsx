import type { Metadata } from "next";
import "./globals.css";
import Header from "./ui/Header";
import Footer from "./ui/Footer";

export const metadata: Metadata = {
  title: "KAZKAZI CHAT",
  description: "Chat with an experimental AI model"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="leading-normal tracking-normal antialiased"
      >
        <Header></Header>
        <div className="w-full mx-auto pt-20 -z-30" style={{ font: "Georgia, sans-serif" }}>
          {children}
        </div>
        <Footer></Footer>
      </body>
    </html >
  );
}
