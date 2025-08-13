import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/CartContext";
import { Footer } from "./components/Footer"; // Import the new Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeggieKart",
  description: "Fresh groceries delivered fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Footer /> 
        </CartProvider>
      </body>
    </html>
  );
}