import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arc Spark Tips',
  description: 'Web3 Tipping Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full m-0 p-0 bg-[#121212] text-white">
        {children}
      </body>
    </html>
  );
}
