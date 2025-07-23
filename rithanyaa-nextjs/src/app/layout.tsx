import type { Metadata } from "next";
import { Playfair_Display, Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ProductsProvider } from "@/lib/products-provider";
import { CartProvider } from "@/contexts/CartContext";


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

// --- IMPROVED METADATA OBJECT ---
// All head-related information now lives here.
export const metadata: Metadata = {
  title: {
    default: "Nava Jothi Silks - Premium Silk Sarees & Traditional Indian Clothing",
    template: "%s | Nava Jothi Silks"
  },
  description: "Discover exquisite handwoven silk sarees from India. Premium Chettinad silks, Soft Sico, and Ikath collections. Traditional craftsmanship meets modern elegance.",
  keywords: ["silk sarees", "indian clothing", "chettinad silk", "ikath", "soft sico", "handwoven", "traditional", "premium sarees"],
  authors: [{ name: "Nava Jothi Silks" }],
  creator: "Nava Jothi Silks",

  // Viewport and theme-color are handled here
  themeColor: "#2d5f2d", 
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },

  // Icons are handled here
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://navajothisilks.store",
    siteName: "Nava Jothi Silks",
    title: "Nava Jothi Silks - Premium Silk Sarees",
    description: "Discover exquisite handwoven silk sarees from India. Traditional craftsmanship meets modern elegance.",
    images: [
      {
        url: "/images/hero/hero1.png", // For production, use an absolute URL
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
    images: ["/images/hero/hero1.png"], // For production, use an absolute URL
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
      {/* The <head> tag is now managed automatically by Next.js via the metadata object. */}
      <body className="font-sans antialiased">
        <CartProvider>
          <ProductsProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              {/* 
                The pt-20 class is crucial. It adds top padding to the main content area 
                to prevent it from being obscured by the fixed header. 
                The value '20' (5rem) should match the height of your Header component.
              */}
              <main className="flex-grow pt-20">
                {children}
              </main>
              <Footer />
            </div>
          </ProductsProvider>
        </CartProvider>
      </body>
    </html>
  );
}
