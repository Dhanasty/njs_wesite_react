'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
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
          <Link href="/" className="-m-1.5 p-1.5 group">
            <span className="sr-only">Nava Jothi Silks</span>
            <div className="relative">
              <Image
                src="/images/logos/nava_jothi_silks_logo.jpg"
                alt="Nava Jothi Silks"
                width={149}
                height={34}
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-primary-700 hover:text-primary-900 active:text-primary-900 transition-colors touch-manipulation"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setMobileMenuOpen(true)
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setMobileMenuOpen(true)
            }}
            aria-label="Open main menu"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-semibold leading-6 text-neutral-700 hover:text-primary-600 transition-colors duration-200 group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <button className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
          
          <button className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </button>

          <button className="relative p-2 text-neutral-700 hover:text-primary-600 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 lg:hidden touch-manipulation"
            style={{zIndex: 9998}}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setMobileMenuOpen(false)
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              setMobileMenuOpen(false)
            }}
          />
          
          {/* Mobile menu panel */}
          <div 
            className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm shadow-2xl"
            style={{zIndex: 9999}}
          >
            <div className="flex items-center justify-between">
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
                className="-m-2.5 rounded-md p-2.5 text-neutral-700 hover:text-primary-600 active:text-primary-600 transition-colors touch-manipulation"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setMobileMenuOpen(false)
                }}
                onTouchStart={(e) => {
                  e.preventDefault()
                  setMobileMenuOpen(false)
                }}
                aria-label="Close menu"
              >
                <span className="sr-only">Close menu</span>
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
                      className="group -mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-neutral-900 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <span>{item.name}</span>
                        <span className="ml-auto h-1 w-1 rounded-full bg-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="py-6">
                  <div className="flex items-center justify-center gap-6">
                    <button className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      <span className="text-sm">Search</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      <span className="text-sm">Wishlist</span>
                    </button>

                    <button className="flex items-center gap-2 text-neutral-700 hover:text-primary-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                      <span className="text-sm">Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}