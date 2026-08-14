import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "AccuStandard ERP Dashboard",
    template: "%s | AccuStandard ERP",
  },
  description: "Control-first operations, inventory, purchasing, and finance workspace for AccuStandard Medical and Diagnostic Supplies Corporation.",
  applicationName: "AccuStandard ERP",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#17356f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full text-slate-900 antialiased font-sans">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
