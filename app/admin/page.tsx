'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Eye, RefreshCw, Home, MessageSquare } from 'lucide-react'
import { Property } from '@/lib/types'

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [tab, setTab] = useState<'listings' | 'contacts'>('listings')
  const [contacts, setContacts] = useState<{ id: number; name: string; phone: string; email: string; message: string; created_at: string }[]>([])

  const fetchAll = async () => {
    setLoading(true)
    const [pRes, cRes] = await Promise.all([
      fetch('/api/listings'),
      fetch('/api/contact'),
    ])
    setProperties(pRes.ok ? await pRes.json() : [])
    setContacts(cRes.ok ? await cRes.json() : [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Bu e\'lonni o\'chirmoqchimisiz?')) return
    setDeletingId(id)
    await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    setProperties((prev) => prev.filter((p) => p.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">E&apos;lonlar va murojaatlarni boshqarish</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAll}
            className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Yangilash
          </button>
          <Link
            href="/admin/add"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Plus size={18} />
            E&apos;lon qo&apos;shish
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jami e\'lonlar', value: properties.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Sotuvda', value: properties.filter(p => p.type === 'sale').length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Ijaraga', value: properties.filter(p => p.type === 'rent').length, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Murojaatlar', value: contacts.length, color: 'bg-amber-50 text-amber-700' },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab('listings')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'listings'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={16} /> E&apos;lonlar
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
            tab === 'contacts'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={16} /> Murojaatlar
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-700 border-t-transparent" />
        </div>
      ) : tab === 'listings' ? (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Sarlavha</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Tur</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Narx</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Shahar</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-4 font-semibold text-gray-600">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 max-w-xs truncate">{p.title}</p>
                      <p className="text-gray-400 text-xs">{p.rooms} xona · {p.area} m²</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={p.type === 'sale' ? 'badge-sale' : 'badge-rent'}>
                        {p.type === 'sale' ? 'Sotuvda' : 'Ijara'}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-gray-900">
                      {new Intl.NumberFormat('uz-UZ').format(p.price)} {p.currency}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{p.city}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.status === 'active' ? 'Faol' : p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/listings/${p.id}`}
                          className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Ko'rish"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/edit/${p.id}`}
                          className="text-gray-400 hover:text-amber-600 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Tahrirlash"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {properties.length === 0 && (
              <p className="text-center py-12 text-gray-400">Hech qanday e&apos;lon yo&apos;q</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Ism</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Telefon</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Xabar</th>
                  <th className="text-left px-4 py-4 font-semibold text-gray-600">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-4 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-4 py-4 text-gray-600">{c.email || '—'}</td>
                    <td className="px-4 py-4 text-gray-600 max-w-xs">
                      <p className="truncate">{c.message}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">
                      {new Date(c.created_at).toLocaleDateString('uz-UZ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {contacts.length === 0 && (
              <p className="text-center py-12 text-gray-400">Hech qanday murojaat yo&apos;q</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
