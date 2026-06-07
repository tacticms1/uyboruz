import { SlidersHorizontal } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'

interface PageProps {
  searchParams: {
    type?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    rooms?: string
    search?: string
  }
}

async function getListings(params: PageProps['searchParams']): Promise<Property[]> {
  try {
    const base =
      process.env.NODE_ENV === 'production'
        ? 'http://localhost:3000'
        : 'http://localhost:3000'

    const qs = new URLSearchParams()
    if (params.type) qs.set('type', params.type)
    if (params.city) qs.set('city', params.city)
    if (params.minPrice) qs.set('minPrice', params.minPrice)
    if (params.maxPrice) qs.set('maxPrice', params.maxPrice)
    if (params.rooms) qs.set('rooms', params.rooms)
    if (params.search) qs.set('search', params.search)

    const res = await fetch(`${base}/api/listings?${qs}`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const properties = await getListings(searchParams)

  const typeName =
    searchParams.type === 'sale'
      ? "Sotuvdagi mulklar"
      : searchParams.type === 'rent'
      ? "Ijaradagi mulklar"
      : "Barcha e'lonlar"

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{typeName}</h1>
        <p className="text-gray-500 mt-1">
          {properties.length} ta e&apos;lon topildi
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
        <form method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2">
            <input
              name="search"
              type="text"
              defaultValue={searchParams.search || ''}
              placeholder="Kalit so'z, manzil..."
              className="input text-sm"
            />
          </div>
          <select
            name="type"
            defaultValue={searchParams.type || ''}
            className="input text-sm"
          >
            <option value="">Barcha turlar</option>
            <option value="sale">Sotuvda</option>
            <option value="rent">Ijaraga</option>
          </select>
          <input
            name="city"
            type="text"
            defaultValue={searchParams.city || ''}
            placeholder="Shahar..."
            className="input text-sm"
          />
          <select
            name="rooms"
            defaultValue={searchParams.rooms || ''}
            className="input text-sm"
          >
            <option value="">Xonalar soni</option>
            <option value="1">1+ xona</option>
            <option value="2">2+ xona</option>
            <option value="3">3+ xona</option>
            <option value="4">4+ xona</option>
          </select>
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <SlidersHorizontal size={16} />
            Filtr
          </button>
        </form>
      </div>

      {/* Results */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400">
          <SlidersHorizontal size={40} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Hech qanday e&apos;lon topilmadi</p>
          <p className="text-sm mt-1">Filtr parametrlarini o&apos;zgartiring</p>
        </div>
      )}
    </div>
  )
}
