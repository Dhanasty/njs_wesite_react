'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import CartSidebar from '@/components/cart/CartSidebar'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Catalog', href: '/catalog' },
  { name: 'Chettinad Silks', href: '/chettinad-silks' },
  { name: 'Soft Sico', href: '/soft-sico' },
  { name: 'Ikath', href: '/ikath' },
  { name: 'About Us', href: '/about' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { totalItems, toggleCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-primary-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 group" onClick={() => setMobileMenuOpen(false)}>
            <span className="sr-only">Nava Jothi Silks</span>
            <Image
              src="/images/logos/nava_jothi_silks_logo.jpg"
              alt="Nava Jothi Silks"
              width={149}
              height={34}
              priority
              className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Mobile menu button (Hamburger) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primary-700 hover:text-primary-900 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open main menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-panel" // Controls the panel
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop navigation & actions */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-end gap-x-8">
            <div className="hidden lg:flex lg:gap-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-sm font-semibold leading-6 transition-colors duration-200 group ${
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-neutral-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 ${
                      pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </div>
            
            <div className="hidden lg:flex lg:gap-x-4">
                <button aria-label="Search" className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </button>
                <button aria-label="Wishlist" className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                </button>
                <button 
                  onClick={toggleCart}
                  aria-label={`Shopping Cart (${totalItems} items)`} 
                  className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalItems > 99 ? '99+' : totalItems}
                      </span>
                    )}
                </button>
            </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      {/* Use a higher z-index (z-50) for the modal container */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden transform-gpu ${
          mobileMenuOpen ? 'visible' : 'invisible'
        }`}
        style={{ isolation: 'isolate' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Mobile menu panel */}
        <div 
          id="mobile-menu-panel" // ID for aria-controls
          className={`fixed top-0 right-0 w-full max-w-sm h-[55vh] overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
             <span id="mobile-menu-title" className="sr-only">Main Menu</span>
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
               <Image
                src="/images/logos/nava_jothi_silks_logo.jpg"
                alt="Nava Jothi Silks"
                width={180}
                height={45}
                className="h-12 w-auto"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-neutral-700 hover:text-primary-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-neutral-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-900 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <div className="py-6">
                 <div className="flex items-center justify-around">
                    <button className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                        <span className="text-sm font-medium">Search</span>
                    </button>
                    <button className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                        <span className="text-sm font-medium">Wishlist</span>
                    </button>
                    <button 
                      onClick={toggleCart}
                      className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors relative"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
                        <span className="text-sm font-medium">Cart {totalItems > 0 && `(${totalItems})`}</span>
                        {totalItems > 0 && (
                          <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                            {totalItems > 9 ? '9+' : totalItems}
                          </span>
                        )}
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  )
}
