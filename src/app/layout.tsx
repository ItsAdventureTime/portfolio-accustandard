import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const outfit = localFont({
  src: './fonts/Outfit-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-outfit',
  fallback: ['Avenir Next', 'Segoe UI Variable', 'system-ui', 'sans-serif'],
});

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
      <body className={`${outfit.variable} min-h-full text-slate-900 antialiased font-sans`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
