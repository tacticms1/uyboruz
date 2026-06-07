import { NextRequest, NextResponse } from 'next/server'
import { query, initDB } from '@/lib/db'
import { Contact } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    await initDB()
    const { name, email, phone, message, property_id } = await request.json()

    if (!name || !message) {
      return NextResponse.json(
        { error: 'Ism va xabar majburiy' },
        { status: 400 }
      )
    }

    await query(
      'INSERT INTO contacts (name, email, phone, message, property_id) VALUES ($1,$2,$3,$4,$5)',
      [name, email || null, phone || null, message, property_id || null]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/contact]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rows = await query<Contact>(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/contact]', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
