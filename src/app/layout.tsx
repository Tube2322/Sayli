import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Life",
  description: "English Life — เรียนภาษาอังกฤษตั้งแต่เริ่มต้นจนถึงระดับ Native-like",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
