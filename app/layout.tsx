import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { I18nProvider } from "@/lib/i18n/useTranslation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MindGuard — Дым, а не огонь",
  description: "Персональный мультимодальный AI-компаньон по эмоциональному благополучию. 1–2 минуты в день, чтобы лучше понимать себя. Премиально, спокойно, приватно.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0b0f] text-[#f1f5f9]">
        <I18nProvider>
          {children}
        </I18nProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
