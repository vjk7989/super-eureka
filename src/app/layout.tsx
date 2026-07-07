import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oil Palm Health Command Center",
  description: "Prototype-first AI disease management GUI for oil palm plantations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
