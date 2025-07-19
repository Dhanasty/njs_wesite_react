import Link from 'next/link'
import Image from 'next/image'

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Catalog', href: '/catalog' },
    { name: 'About Us', href: '/about' },
  ],
  collections: [
    { name: 'Chettinad Silks', href: '/chettinad-silks' },
    { name: 'Soft Sico', href: '/soft-sico' },
    { name: 'Ikath', href: '/ikath' },
  ],
  support: [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Return Policy', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const contactInfo = [
  {
    icon: '📍',
    label: 'Address',
    value: '123 Silk Street, Heritage District\nChennai, Tamil Nadu 600001',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 44 1234 5678',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'info@navajothisilks.store',
  },
  {
    icon: '🕒',
    label: 'Hours',
    value: 'Mon-Sat: 10:00 AM - 8:00 PM\nSunday: Closed',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-primary-700">
        <div className="container-custom section-padding">
          <div className="text-center">
            <h3 className="text-2xl font-display font-semibold mb-4">
              Stay Updated with Our Latest Collections
            </h3>
            <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new arrivals, and traditional textile insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-primary-600 text-white placeholder-primary-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent backdrop-blur-sm"
              />
              <button className="btn-secondary px-8 py-3 font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div>
              <Link href="/" className="inline-block mb-6">
                <Image
                  src="/images/logos/nava-jothi-silks-logo.svg"
                  alt="Nava Jothi Silks"
                  width={149}
                  height={34}
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </Link>
              
              <p className="text-primary-200 leading-relaxed mb-6 max-w-md">
                Premium silk saree collection preserving India&apos;s rich textile heritage 
                while creating contemporary masterpieces for the modern woman.
              </p>
              
              <div className="space-y-3">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-secondary-400 mt-0.5 text-xl">{item.icon}</span>
                    <div>
                      <span className="text-primary-300 text-sm font-medium block">{item.label}</span>
                      <span className="text-primary-100 text-sm whitespace-pre-line">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-6 text-secondary-400">Quick Links</h4>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-secondary-400 transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-6 text-secondary-400">Collections</h4>
            <ul className="space-y-3">
              {navigation.collections.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-secondary-400 transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-display font-semibold mb-6 text-secondary-400">Support</h4>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-primary-200 hover:text-secondary-400 transition-colors duration-200 relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary-400 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-700">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-300 text-sm">
              © {currentYear} Nava Jothi Silks. All rights reserved. Crafted with tradition and elegance.
            </p>
            
            <div className="flex items-center gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-primary-400 hover:text-secondary-400 text-sm transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}