import type { Metadata } from "next";
import "./globals.css";
import "./styles/bootstrap.min.css";
import "./styles/common.css";
import "./styles/main.css";
import "./styles/responsive.css";


export const metadata: Metadata = {
  title: "Buddy Script",
  description: "Buddy Script Interview Task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}