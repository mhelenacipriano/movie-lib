import { Geist } from "next/font/google";
import "@/styles/globals.scss";
import AppLayout from "@/components/layout/AppLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MovieLib - Discover Movies & TV Shows",
  description: "Browse, search, and track your favorite movies and TV shows with AI-powered recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
