import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/dom/SmoothScroll';
import Scene from '@/components/canvas/Scene';
import Header from '@/components/dom/Header';
import Globe from '@/components/canvas/Globe';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "BloodBridge - Life After Diagnosis",
  description: "Connect blood donors with patients directly in critical moments.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#FF2E63",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <SmoothScroll>
          <div className="relative z-10 flex flex-col">
            <Header />
            {children}
          </div>
          <Scene>
            <Globe />
          </Scene>
        </SmoothScroll>
      </body>
    </html>
  );
}
