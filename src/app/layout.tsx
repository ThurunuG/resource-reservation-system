import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserProvider } from "@/components/UserContext";

export const metadata: Metadata = {
  title: "PrimeWave | Resource Reservation Management System",
  description: "Enterprise shared resource coordination, calendar scheduling, and conflict prevention platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <UserProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}