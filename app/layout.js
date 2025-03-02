import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Memories.",
    template: "Memories • %s"
  },
  description: "Capture moments, cherish memories, and let your stories shine forever.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterSignOutUrl="/" signInFallbackRedirectUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <NextTopLoader color="#020202" />
          <Header />
          {children}
          <Toaster position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
