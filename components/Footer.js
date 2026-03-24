// components/Footer.js
import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaFacebook, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import logo from "@/public/Footlogo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo + Brand Info */}
          <div>
            <Link href="/" className="inline-flex items-center mb-4">
              <Image
                src={logo}
                alt="Codeswear.com logo"
                width={260}
                height={70}
                className="h-12 w-auto object-contain"
                priority
                style={{
                  filter:
                    "invert(14%) sepia(70%) saturate(600%) hue-rotate(310deg) brightness(95%) contrast(95%)",
                }}
              />
            </Link>

            <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xs">
              Codeswear.com — Wear the code, express your passion.
              <br />
              Unique designs for coders, developers & creators.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tshirts" className="hover:text-pink-600">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/hoodies" className="hover:text-pink-600">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/mugs" className="hover:text-pink-600">
                  Mugs
                </Link>
              </li>
              <li>
                <Link href="/stickers" className="hover:text-pink-600">
                  Stickers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-pink-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Connect</h4>
            <div className="flex space-x-4 text-xl">
              <a
                href="https://github.com/Sk-332/textutils-gh-pages"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-pink-600"
              >
                <FaGithub />
              </a>

              <a
                href="https://web.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-pink-600"
              >
                <FaFacebook />
              </a>

              <a
                href="https://wa.me/923704734546"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-pink-600"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://www.linkedin.com/in/sami-khan-b47487361/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-pink-600"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          © 2025 Codeswear.com. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
