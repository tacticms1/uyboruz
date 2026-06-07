import { NextRequest, NextResponse } from 'next/server'
import { query, initDB } from '@/lib/db'
import { Property } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    await initDB()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rooms = searchParams.get('rooms')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    let sql = `SELECT * FROM properties WHERE status = $1`
    const params: unknown[] = ['active']
    let idx = 2

    if (type && (type === 'sale' || type === 'rent')) {
      sql += ` AND type = $${idx++}`
      params.push(type)
    }
    if (city) {
      sql += ` AND LOWER(city) LIKE LOWER($${idx++})`
      params.push(`%${city}%`)
    }
    if (search) {
      sql += ` AND (LOWER(title) LIKE LOWER($${idx}) OR LOWER(address) LIKE LOWER($${idx}) OR LOWER(district) LIKE LOWER($${idx}))`
      params.push(`%${search}%`)
      idx++
    }
    if (minPrice) {
      sql += ` AND price >= $${idx++}`
      params.push(parseFloat(minPrice))
    }
    if (maxPrice) {
      sql += ` AND price <= $${idx++}`
      params.push(parseFloat(maxPrice))
    }
    if (rooms) {
      sql += ` AND rooms >= $${idx++}`
      params.push(parseInt(rooms))
    }
    if (featured === 'true') {
      sql += ` AND featured = true`
    }

    sql += ` ORDER BY featured DESC, created_at DESC`

    const rows = await query<Property>(sql, params)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/listings]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDB()
    const b = await request.json()

    const result = await query<Property>(
      `INSERT INTO properties
        (title, description, type, price, currency, area, rooms, bathrooms, floor, total_floors, address, city, district, image_url, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       RETURNING *`,
      [
        b.title, b.description || '', b.type, parseFloat(b.price) || 0,
        b.currency || 'USD', parseFloat(b.area) || 0, parseInt(b.rooms) || 1,
        parseInt(b.bathrooms) || 1, parseInt(b.floor) || 1,
        parseInt(b.total_floors) || 1, b.address || '', b.city || '',
        b.district || '', b.image_url || '', b.featured || false,
      ]
    )

    return NextResponse.json(result[0], { status: 201 })
  } catch (err) {
    console.error('[POST /api/listings]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
