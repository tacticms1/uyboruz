import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { Property } from '@/lib/types'

type Ctx = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Ctx) {
  try {
    const rows = await query<Property>(
      'SELECT * FROM properties WHERE id = $1',
      [params.id]
    )
    if (!rows.length) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error('[GET /api/listings/:id]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  try {
    const b = await request.json()
    const rows = await query<Property>(
      `UPDATE properties SET
        title=$1, description=$2, type=$3, price=$4, currency=$5,
        area=$6, rooms=$7, bathrooms=$8, floor=$9, total_floors=$10,
        address=$11, city=$12, district=$13, image_url=$14, status=$15,
        featured=$16, updated_at=NOW()
       WHERE id=$17 RETURNING *`,
      [
        b.title, b.description, b.type, b.price, b.currency,
        b.area, b.rooms, b.bathrooms, b.floor, b.total_floors,
        b.address, b.city, b.district, b.image_url, b.status,
        b.featured, params.id,
      ]
    )
    if (!rows.length) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error('[PUT /api/listings/:id]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  try {
    await query('DELETE FROM properties WHERE id = $1', [params.id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/listings/:id]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
