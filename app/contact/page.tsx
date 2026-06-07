'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Bog&apos;lanish</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Savollaringiz bormi? Biz bilan bog&apos;laning — 24 soat ichida javob beramiz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Aloqa ma&apos;lumotlari</h2>
          <div className="space-y-5">
            {[
              {
                icon: <Phone size={22} />,
                title: 'Telefon',
                lines: ['+998 71 234-56-78', '+998 90 123-45-67'],
                color: 'bg-blue-100 text-blue-700',
              },
              {
                icon: <Mail size={22} />,
                title: 'Email',
                lines: ['info@uybor.uz', 'support@uybor.uz'],
                color: 'bg-emerald-100 text-emerald-700',
              },
              {
                icon: <MapPin size={22} />,
                title: 'Manzil',
                lines: ['Toshkent shahri, Amir Temur ko\'chasi 22', 'Yakkasaray tumani'],
                color: 'bg-amber-100 text-amber-700',
              },
              {
                icon: <Clock size={22} />,
                title: 'Ish vaqti',
                lines: ['Du–Ju: 09:00 – 18:00', 'Sha: 10:00 – 15:00'],
                color: 'bg-purple-100 text-purple-700',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className={`${item.color} p-3 rounded-xl shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  {item.lines.map((l) => (
                    <p key={l} className="text-gray-500 text-sm">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map placeholder */}
          <div className="bg-gray-200 rounded-2xl h-52 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin size={32} className="mx-auto mb-2" />
              <p className="text-sm">Toshkent, Amir Temur ko&apos;chasi 22</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Xabar yuboring</h2>

          {status === 'ok' ? (
            <div className="flex flex-col items-center text-center py-12 text-green-600 gap-4">
              <CheckCircle size={56} />
              <p className="font-bold text-xl">Xabar muvaffaqiyatli yuborildi!</p>
              <p className="text-gray-500 text-sm">
                Mutaxassisimiz siz bilan tez orada bog&apos;lanadi.
              </p>
              <button
                onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '', message: '' }) }}
                className="text-blue-700 hover:underline text-sm mt-2"
              >
                Yana xabar yuborish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Ismingiz *</label>
                  <input
                    required
                    className="input"
                    placeholder="Ism Familiya"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Telefon</label>
                  <input
                    className="input"
                    placeholder="+998 90 123-45-67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Xabar *</label>
                <textarea
                  required
                  rows={5}
                  className="input resize-none"
                  placeholder="Savollaringizni yozing..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {status === 'err' && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
                  <AlertCircle size={16} />
                  Xabar yuborishda xato yuz berdi. Qaytadan urinib ko&apos;ring.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full btn-primary justify-center text-base disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Send size={18} />
                    Xabar yuborish
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
