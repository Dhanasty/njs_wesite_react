import type { Metadata } from "next";
import { Playfair_Display, Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nava Jothi Silks - Premium Silk Sarees & Traditional Indian Clothing",
    template: "%s | Nava Jothi Silks"
  },
  description: "Discover exquisite handwoven silk sarees from India. Premium Chettinad silks, Soft Sico, and Ikath collections. Traditional craftsmanship meets modern elegance.",
  keywords: ["silk sarees", "indian clothing", "chettinad silk", "ikath", "soft sico", "handwoven", "traditional", "premium sarees"],
  authors: [{ name: "Nava Jothi Silks" }],
  creator: "Nava Jothi Silks",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://navajothisilks.store",
    siteName: "Nava Jothi Silks",
    title: "Nava Jothi Silks - Premium Silk Sarees",
    description: "Discover exquisite handwoven silk sarees from India. Traditional craftsmanship meets modern elegance.",
    images: [
      {
        url: "/images/hero/hero1.png",
        width: 1200,
        height: 630,
        alt: "Nava Jothi Silks - Premium Silk Sarees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nava Jothi Silks - Premium Silk Sarees",
    description: "Discover exquisite handwoven silk sarees from India. Traditional craftsmanship meets modern elegance.",
    images: ["/images/hero/hero1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cinzel.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2d5f2d" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}