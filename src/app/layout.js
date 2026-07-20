import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  title: "CookMate - Discover, Cook, and Share Delicious Recipes",
  description: "Your ultimate recipe companion. Find thousands of recipes, save your favorites, and cook with confidence.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link
          rel="preload"
          href="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=75"
          as="image"
          fetchpriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem("darkMode") === "true") {
                  document.documentElement.classList.add("dark");
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
