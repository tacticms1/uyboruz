'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, CheckCircle, AlertCircle } from 'lucide-react'

const cities = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', "Farg'ona", 'Qo\'qon', 'Navoiy', 'Qarshi', 'Termiz']

export default function AddPropertyPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'sale',
    price: '',
    currency: 'USD',
    area: '',
    rooms: '1',
    bathrooms: '1',
    floor: '1',
    total_floors: '1',
    address: '',
    city: 'Toshkent',
    district: '',
    image_url: '',
    featured: false,
  })

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('ok')
        setTimeout(() => router.push('/admin'), 1500)
      } else {
        setStatus('err')
      }
    } catch {
      setStatus('err')
    }
  }

  const Input = ({ name, label, type = 'text', placeholder = '', required = false }: {
    name: string; label: string; type?: string; placeholder?: string; required?: boolean
  }) => (
    <div>
      <label className="label">{label}{required && ' *'}</label>
      <input
        type={type}
        required={required}
        className="input"
        placeholder={placeholder}
        value={form[name as keyof typeof form] as string}
        onChange={(e) => set(name, e.target.value)}
      />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yangi e&apos;lon qo&apos;shish</h1>
          <p className="text-gray-500 text-sm mt-0.5">Barcha (*) belgilangan maydonlar majburiy</p>
        </div>
      </div>

      {status === 'ok' ? (
        <div className="text-center py-16 text-green-600">
          <CheckCircle size={56} className="mx-auto mb-4" />
          <p className="text-xl font-bold">E&apos;lon muvaffaqiyatli saqlandi!</p>
          <p className="text-gray-500 text-sm mt-2">Admin panelga qaytayapman...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Asosiy ma&apos;lumotlar</h2>
            <Input name="title" label="Sarlavha" required placeholder="3 xonali kvartira, Yunusobod..." />

            <div>
              <label className="label">Tavsif</label>
              <textarea
                rows={4}
                className="input resize-none"
                placeholder="Mulk haqida batafsil ma'lumot..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Turi *</label>
                <select
                  className="input"
                  value={form.type}
                  onChange={(e) => set('type', e.target.value)}
                >
                  <option value="sale">Sotuvda</option>
                  <option value="rent">Ijaraga</option>
                </select>
              </div>
              <div>
                <label className="label">Valyuta</label>
                <select
                  className="input"
                  value={form.currency}
                  onChange={(e) => set('currency', e.target.value)}
                >
                  <option value="USD">USD ($)</option>
                  <option value="UZS">UZS (so&apos;m)</option>
                </select>
              </div>
            </div>

            <Input name="price" label="Narx" type="number" required placeholder="95000" />
            <Input
              name="image_url"
              label="Rasm URL (Unsplash yoki boshqa)"
              placeholder="https://images.unsplash.com/..."
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 accent-blue-700"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Tavsiya etilgan e&apos;lon (asosiy sahifada ko&apos;rsatiladi)
              </label>
            </div>
          </div>

          {/* Property details */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Mulk xususiyatlari</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input name="rooms" label="Xonalar" type="number" />
              <Input name="bathrooms" label="Hammom" type="number" />
              <Input name="area" label="Maydon (m²)" type="number" />
              <Input name="floor" label="Qavat" type="number" />
            </div>
            <Input name="total_floors" label="Umumiy qavatlar" type="number" />
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <h2 className="font-semibold text-gray-900 text-lg">Joylashuv</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label">Shahar *</label>
                <select
                  required
                  className="input"
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Input name="district" label="Tuman/Mavze" placeholder="Yunusobod tumani" />
            </div>
            <Input name="address" label="To'liq manzil" required placeholder="Ko'cha nomi, uy raqami..." />
          </div>

          {status === 'err' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
              <AlertCircle size={16} />
              Saqlashda xato yuz berdi. Qaytadan urinib ko&apos;ring.
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/admin"
              className="flex-1 text-center border border-gray-300 text-gray-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={status === 'saving'}
              className="flex-1 btn-primary justify-center disabled:opacity-60"
            >
              {status === 'saving' ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Save size={18} />
                  Saqlash
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
