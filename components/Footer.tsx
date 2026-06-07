import Link from 'next/link'
import { Home, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <div className="bg-blue-600 rounded-lg p-1.5">
                <Home size={20} />
              </div>
              UyBor<span className="text-blue-400">.uz</span>
            </Link>
            <p className="text-blue-300 text-sm leading-relaxed max-w-xs">
              O&apos;zbekistonda ko&apos;chmas mulk sotish, sotib olish va ijaraga berish
              bo&apos;yicha ishonchli platforma. 2024-yildan buyon minglab oilalarga
              uy topishda yordam beramiz.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-blue-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-blue-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Havolalar</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Bosh sahifa' },
                { href: '/sale', label: 'Sotuvdagi uylar' },
                { href: '/rent', label: 'Ijaradagi uylar' },
                { href: '/listings', label: 'Barcha e\'lonlar' },
                { href: '/contact', label: 'Bog\'lanish' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-blue-300 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Aloqa</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-blue-300">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                Toshkent shahri, Amir Temur ko&apos;chasi 22
              </li>
              <li>
                <a
                  href="tel:+998712345678"
                  className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                >
                  <Phone size={16} />
                  +998 71 234-56-78
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@uybor.uz"
                  className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors"
                >
                  <Mail size={16} />
                  info@uybor.uz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-blue-400">
          <p>© 2024 UyBor.uz — Barcha huquqlar himoyalangan</p>
          <p className="mt-2 sm:mt-0">O&apos;zbekiston ko&apos;chmas mulk platformasi</p>
        </div>
      </div>
    </footer>
  )
}
