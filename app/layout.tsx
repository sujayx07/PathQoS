import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PathQoS - Intent-Aware Adaptive QoS Engine',
  description: 'PathQoS observes traffic metadata, adapts to changing link capacity, and keeps a policy only when measured results justify it.',
  openGraph: {
    title: 'PathQoS - Intent-Aware Adaptive QoS Engine',
    description: 'PathQoS observes traffic metadata, adapts to changing link capacity, and keeps a policy only when measured results justify it.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PathQoS - Intent-Aware Adaptive QoS Engine',
    description: 'PathQoS observes traffic metadata, adapts to changing link capacity, and keeps a policy only when measured results justify it.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#F7F9FC] text-[#17233B] antialiased selection:bg-[#315CE8]/10 selection:text-[#315CE8]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
