import Link from 'next/link'
import Image from 'next/image'
import { MapPin, BedDouble, Maximize2, Layers } from 'lucide-react'
import { Property } from '@/lib/types'

interface Props {
  property: Property
}

function formatPrice(price: number, type: string, currency: string) {
  const formatted = new Intl.NumberFormat('uz-UZ').format(price)
  if (type === 'rent') return `${formatted} ${currency}/oy`
  return `${formatted} ${currency}`
}

export default function PropertyCard({ property }: Props) {
  return (
    <Link href={`/listings/${property.id}`} className="card group block">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-200">
        <Image
          src={property.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className={property.type === 'sale' ? 'badge-sale' : 'badge-rent'}>
            {property.type === 'sale' ? 'Sotuvda' : 'Ijaraga'}
          </span>
        </div>
        {property.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              ⭐ Top
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-blue-700 font-bold text-xl mb-1">
          {formatPrice(property.price, property.type, property.currency)}
        </p>
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{property.city}, {property.district}</span>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <BedDouble size={15} className="text-gray-400" />
            <span>{property.rooms} xona</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 size={15} className="text-gray-400" />
            <span>{property.area} m²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers size={15} className="text-gray-400" />
            <span>{property.floor}/{property.total_floors}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
