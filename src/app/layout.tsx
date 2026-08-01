import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accustanda Bridge Dashboard",
  description: "Control-First Enterprise Operations ERP & Multi-Location Inventory Dashboard for Accustanda Rx D",
  manifest: "/manifest.json",
  themeColor: "#1d4ed8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
