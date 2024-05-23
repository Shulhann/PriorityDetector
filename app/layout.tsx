import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Priority Detector",
  description: "Website untuk membuat antrian pasien",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>

        <header className="bg-blue-800 flex justify-center">
          <div className="justify-center ">
            <button className="py-8 px-5 text-white text-2xl font-semibold hover:bg-blue-900">
              <Link href="/">Registrasi</Link>
            </button>
            <button className="py-8 px-5 text-white text-2xl font-semibold hover:bg-blue-900">
              <Link href="/antrian">Antrian</Link>
            </button>
          </div>
        </header>
        
        <main className="app">
          {children}
        </main>
        
        <footer className=" w-full flex justify-center absolute bottom-0">
          <h1>
            @PriorityDetector TPK Rekayasa Sistem Multimedia
          </h1>
        </footer>

      </body>
    </html>
  );
}
