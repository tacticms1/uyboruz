export interface Property {
  id: number
  title: string
  description: string
  type: 'sale' | 'rent'
  price: number
  currency: string
  area: number
  rooms: number
  bathrooms: number
  floor: number
  total_floors: number
  address: string
  city: string
  district: string
  image_url: string
  status: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  message: string
  property_id: number | null
  created_at: string
}

export interface SearchParams {
  type?: string
  city?: string
  minPrice?: string
  maxPrice?: string
  rooms?: string
  search?: string
}
