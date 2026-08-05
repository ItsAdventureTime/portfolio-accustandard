import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Accustandard ERP Dashboard",
  description: "Control-First Enterprise Operations ERP & Multi-Location Inventory Dashboard for Accustandard Medical and Diagnostic Supplies Corporation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-100 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
