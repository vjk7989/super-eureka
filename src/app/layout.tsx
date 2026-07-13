import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ESN LABS AI Disease Command Center",
  description: "ESN LABS prototype-first AI disease management GUI for oil palm operations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
