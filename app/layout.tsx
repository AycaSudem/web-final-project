import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Campus Loop",
  description: "Campus tech + AI social network"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={dmSans.className}>
      <body>
        <SessionProvider>
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-teal/20 blur-3xl" />
          </div>
          <Navbar />
          <main className="container-app py-8 animate-fade-up">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
