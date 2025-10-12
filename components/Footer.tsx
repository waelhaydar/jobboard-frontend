'use client'

import { FaFacebook, FaLinkedin, FaInstagram, FaGithub } from 'react-icons/fa'
import { BsTwitterX } from 'react-icons/bs'

export default function Footer() {
  return (
    <footer className="glass-dark mt-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              JobBoard
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting talented professionals with amazing opportunities. Find your dream job or the perfect candidate.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, BsTwitterX, FaLinkedin, FaInstagram, FaGithub].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-gray-300 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-cyan-400 transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-300 font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>hello@jobboard.com</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} JobBoard. All rights reserved. Made with ❤️ for the community.
          </p>
        </div>
      </div>
    </footer>
  )
}
