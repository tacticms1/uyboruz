'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  MapPin, BedDouble, Maximize2, Layers, Bath,
  ArrowLeft, Phone, Send, CheckCircle, AlertCircle
} from 'lucide-react'
import { Property } from '@/lib/types'

function formatPrice(price: number, type: string, currency: string) {
  const f = new Intl.NumberFormat('uz-UZ').format(price)
  return type === 'rent' ? `${f} ${currency}/oy` : `${f} ${currency}`
}

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setProperty(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_id: id }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
        <p className="text-xl">E&apos;lon topilmadi</p>
        <Link href="/listings" className="text-blue-700 hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Barcha e&apos;lonlar
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-700">Bosh sahifa</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-blue-700">E&apos;lonlar</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{property.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image + Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-gray-200">
            <Image
              src={property.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <div className="absolute top-4 left-4">
              <span className={property.type === 'sale' ? 'badge-sale text-sm px-4 py-1.5' : 'badge-rent text-sm px-4 py-1.5'}>
                {property.type === 'sale' ? '🏷 Sotuvda' : '🔑 Ijaraga'}
              </span>
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 flex-1">
                {property.title}
              </h1>
              <p className="text-3xl font-bold text-blue-700 whitespace-nowrap">
                {formatPrice(property.price, property.type, property.currency)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mt-2">
              <MapPin size={16} />
              <span>{property.address}, {property.city}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <BedDouble size={22} />, value: `${property.rooms} xona`, label: 'Xonalar' },
              { icon: <Bath size={22} />, value: `${property.bathrooms} ta`, label: 'Hammom' },
              { icon: <Maximize2 size={22} />, value: `${property.area} m²`, label: 'Maydon' },
              { icon: <Layers size={22} />, value: `${property.floor}/${property.total_floors}`, label: 'Qavat' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-blue-600 flex justify-center mb-2">{s.icon}</div>
                <p className="font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Tavsif</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {property.description || 'Qo\'shimcha ma\'lumot yo\'q.'}
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-900">Joylashuv</h2>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Shahar</span>
                <p className="font-semibold text-gray-900">{property.city}</p>
              </div>
              <div>
                <span className="text-gray-500">Tuman</span>
                <p className="font-semibold text-gray-900">{property.district}</p>
              </div>
              <div>
                <span className="text-gray-500">Manzil</span>
                <p className="font-semibold text-gray-900 text-xs leading-snug">{property.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Bog&apos;lanish
            </h2>

            {status === 'ok' ? (
              <div className="flex flex-col items-center text-center py-6 text-green-600 gap-3">
                <CheckCircle size={48} />
                <p className="font-semibold text-lg">Xabar yuborildi!</p>
                <p className="text-sm text-gray-500">
                  Tez orada siz bilan bog&apos;lanamiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContact} className="space-y-4">
                <div>
                  <label className="label">Ismingiz *</label>
                  <input
                    required
                    className="input text-sm"
                    placeholder="Ism va Familiya"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Telefon</label>
                  <input
                    className="input text-sm"
                    placeholder="+998 90 123-45-67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input text-sm"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Xabar *</label>
                  <textarea
                    required
                    rows={4}
                    className="input text-sm resize-none"
                    placeholder="Savollaringizni yozing..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                {status === 'err' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} /> Xato yuz berdi. Qaytadan urinib ko&apos;ring.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full btn-primary justify-center disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Send size={16} /> Xabar yuborish
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <a
                href="tel:+998712345678"
                className="text-blue-700 hover:text-blue-900 font-semibold flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                +998 71 234-56-78
              </a>
              <p className="text-xs text-gray-400 mt-1">Bepul qo&apos;ngiroq</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
