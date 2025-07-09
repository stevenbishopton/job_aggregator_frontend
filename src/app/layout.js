import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Job Aggregator | Find Remote Jobs Instantly",
  description: "Discover remote jobs from top sources. Search, filter, and view details in a clean, modern interface. Updated daily with real-time job listings.",
  keywords: [
    "remote jobs",
    "job aggregator",
    "job search",
    "web scraper",
    "find jobs",
    "work from home",
    "tech jobs",
    "developer jobs",
    "remote work"
  ],
  openGraph: {
    title: "Job Aggregator | Find Remote Jobs Instantly",
    description: "Discover remote jobs from top sources. Search, filter, and view details in a clean, modern interface. Updated daily with real-time job listings.",
    url: "https://job-aggregator-frontend.vercel.app",
    siteName: "Job Aggregator",
    images: [
      {
        url: "/og-image.png", // Place your Open Graph image in the public folder
        width: 1200,
        height: 630,
        alt: "Job Aggregator - Find Remote Jobs"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Aggregator | Find Remote Jobs Instantly",
    description: "Discover remote jobs from top sources. Search, filter, and view details in a clean, modern interface. Updated daily with real-time job listings.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
