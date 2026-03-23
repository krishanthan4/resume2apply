"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "How it works", href: "#how-it-works" },
    { name: "Compare", href: "#comparison" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
          <Image src="/resume2apply.png" alt="Logo" width={50} height={50} />
          <span className="font-bold text-slate-900 tracking-tight text-lg">Resume2Apply</span>
        </Link>

        {/* Desktop: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop: CTA Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link href="/auth/register" className="text-sm font-semibold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile: Hamburger Button */}
        <button 
          className="md:hidden flex items-center p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile: Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white backdrop-blur-md absolute w-full shadow-lg">
          <div className="flex flex-col px-10 py-5 gap-3">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/auth/login" 
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-semibold bg-white border border-slate-300 px-5 py-3 rounded-full hover:bg-zinc-100 transition-all shadow-sm text-center inline-block"
            >
              Log In
            </Link>
            <Link 
              href="/auth/register" 
              onClick={() => setIsMenuOpen(false)}
              className="text-base font-semibold bg-slate-900 text-white px-5 py-3 rounded-full hover:bg-slate-800 transition-all shadow-sm text-center inline-block"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
