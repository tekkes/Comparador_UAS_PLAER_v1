import type { Metadata } from "next";
import { Public_Sans } from "next/font/google"; // Make sure font is imported if used
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const publicSans = Public_Sans({ subsets: ["latin"] }); // Ensure this matches import

export const metadata: Metadata = {
  title: "Comparador UAS - PLAER",
  description: "Base de datos y comparador de UAS militares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${publicSans.className} min-h-screen transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="pt-24 px-6 pb-12 w-full max-w-[1920px] mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
