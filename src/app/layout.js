import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/sweetAlert.css";
// import Sidbar from "@/components/leyouts/sidbar/Sidbar";
import Navbar from "@/components/leyouts/navbar/Navbar";
import Footer from "@/components/leyouts/footer/Footer";
import QueryProvider from "@/components/providers/QueryProvider";
import AuthProvider from "@/components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "املاک K&S",
  description: "مجموعه ای فعال در حوزه املاک و مستغلات",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <main className="layout">
          <AuthProvider>
            <QueryProvider>
              
              <Navbar />
              {children}
            </QueryProvider>
          </AuthProvider>
        </main>
        <Footer />
      </body>
    </html>
  );
}
