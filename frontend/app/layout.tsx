import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "ResumeAI — Build Professional Resumes",
  description:
    "Create ATS-friendly professional resumes with live preview, multiple templates, and one-click PDF download.",
  keywords: ["resume builder", "ATS resume", "CV maker", "professional resume"],
  openGraph: {
    title: "ResumeAI — Build Professional Resumes",
    description: "Create ATS-friendly resumes in minutes with live preview and PDF export",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-slate-900 bg-white" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
