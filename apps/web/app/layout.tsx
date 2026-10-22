import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Molith ERP',
  description: 'This is one app for whole operation business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
