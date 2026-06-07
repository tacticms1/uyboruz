import { Pool } from 'pg'
import { Property } from './types'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'uyboruz',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'uyboruz2024',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

export async function query<T = unknown>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows as T[]
  } finally {
    client.release()
  }
}

let dbInitialized = false

export async function initDB(): Promise<void> {
  if (dbInitialized) return
  dbInitialized = true

  await query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      type VARCHAR(20) NOT NULL CHECK (type IN ('sale','rent')),
      price NUMERIC(15,2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'USD',
      area NUMERIC(10,2),
      rooms INTEGER DEFAULT 1,
      bathrooms INTEGER DEFAULT 1,
      floor INTEGER DEFAULT 1,
      total_floors INTEGER DEFAULT 1,
      address VARCHAR(500),
      city VARCHAR(100),
      district VARCHAR(100),
      image_url TEXT,
      status VARCHAR(20) DEFAULT 'active',
      featured BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(50),
      message TEXT,
      property_id INTEGER,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  const countResult = await query<{ count: string }>(
    'SELECT COUNT(*) as count FROM properties'
  )
  if (parseInt(countResult[0].count) > 0) return

  const seeds: Omit<
    Property,
    'id' | 'status' | 'created_at' | 'updated_at'
  >[] = [
    {
      title: "Yunusobod tumani zamonaviy 3 xonali kvartira",
      description: "To'liq ta'mirlangan, yangi mebel bilan, metro yaqinida joylashgan. Oshxona va yashash xonalari keng, quyoshli tomonga qaragan. Ko'p qavatli binoning 5-qavatida, lift mavjud. Qo'riqlanuvchi parkovka, 24 soat qorovul xizmati. Barcha kommunal to'lovlar o'z vaqtida.",
      type: "sale",
      price: 95000,
      currency: "USD",
      area: 85,
      rooms: 3,
      bathrooms: 1,
      floor: 5,
      total_floors: 9,
      address: "Yunusobod tumani, 19-mavze, 8-uy",
      city: "Toshkent",
      district: "Yunusobod",
      image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      featured: true,
    },
    {
      title: "Mirzo Ulug'bek tumani yangi bino 2 xonali kvartira",
      description: "2023-yilda qurilgan yangi bino, zamonaviy remont, turar-joy majmuasining ichida joylashgan. Bolalar o'yin maydoni, sport zali va savdo markazi yaqin. Panoramik derazalar, yuksakdan shahar manzarasi ko'rinadi.",
      type: "sale",
      price: 72000,
      currency: "USD",
      area: 62,
      rooms: 2,
      bathrooms: 1,
      floor: 8,
      total_floors: 16,
      address: "Mirzo Ulug'bek tumani, Qorasaroy ko'chasi, 34",
      city: "Toshkent",
      district: "Mirzo Ulugbek",
      image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      featured: true,
    },
    {
      title: "Chilonzor tumani 1 xonali kvartira ijaraga",
      description: "Yangi remont qilingan, barcha kommunal xizmatlar ulangan. Mebel, muzlatgich, kir yuvish mashinasi, kabel TV va internet mavjud. Metroga 10 daqiqa piyoda yurish. Oilali yoki yolg'iz yashovchi uchun ideal.",
      type: "rent",
      price: 450,
      currency: "USD",
      area: 42,
      rooms: 1,
      bathrooms: 1,
      floor: 3,
      total_floors: 5,
      address: "Chilonzor tumani, 9-mavze, 12-uy",
      city: "Toshkent",
      district: "Chilonzor",
      image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      featured: false,
    },
    {
      title: "Shayxontohur tumani 4 xonali uy",
      description: "Mustaqil ikki qavatli uy, 150 kv.m. bog' hududi bilan. Garaj, veranda, barbeku zonasi. Qo'riqlanuvchi mahalla. To'liq ta'mirlangan, zamonaviy oshxona, 2 ta hammom. Shahar markaziga 15 daqiqa.",
      type: "sale",
      price: 185000,
      currency: "USD",
      area: 220,
      rooms: 4,
      bathrooms: 2,
      floor: 1,
      total_floors: 2,
      address: "Shayxontohur tumani, Furqat ko'chasi, 56",
      city: "Toshkent",
      district: "Shayxontohur",
      image_url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      featured: true,
    },
    {
      title: "Uchtepa tumani 2 xonali kvartira ijaraga",
      description: "To'liq mebellashtirilgan, internet 100 Mbit/s, kabel TV. Yashash va yotish xonalari alohida. Qulay transport mavzei, do'kon va maktablar yaqin. Janubiy tomonga qaragan, juda yorug' kvartira.",
      type: "rent",
      price: 380,
      currency: "USD",
      area: 55,
      rooms: 2,
      bathrooms: 1,
      floor: 4,
      total_floors: 9,
      address: "Uchtepa tumani, Bog'ishamol ko'chasi, 18",
      city: "Toshkent",
      district: "Uchtepa",
      image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      featured: false,
    },
    {
      title: "Yakkasaray tumani zamonaviy ofis ijaraga",
      description: "150 kv.m. ochiq maydonga ega zamonaviy ofis binosi, to'liq jihozlangan. 5 ta ish stoli, katta yig'ilishlar zali, server xonasi, bufet. Amir Temur ko'chasiga qulay kirish, metro 5 daqiqa.",
      type: "rent",
      price: 2800,
      currency: "USD",
      area: 150,
      rooms: 5,
      bathrooms: 2,
      floor: 3,
      total_floors: 8,
      address: "Yakkasaray tumani, Amir Temur ko'chasi, 22",
      city: "Toshkent",
      district: "Yakkasaray",
      image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      featured: false,
    },
    {
      title: "Samarqand shahri markazida 3 xonali yangi bino",
      description: "Registon yaqinida, turizmga qulay joylashuv. Yangi qurilma, to'liq ta'mirlangan. Katta balkoni mavjud, yodgorliklar manzarasi ko'rinadi. Samarqandga investitsiya uchun ideal variant.",
      type: "sale",
      price: 58000,
      currency: "USD",
      area: 78,
      rooms: 3,
      bathrooms: 1,
      floor: 6,
      total_floors: 10,
      address: "Registon ko'chasi, 45-uy",
      city: "Samarqand",
      district: "Markaz",
      image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      featured: false,
    },
    {
      title: "Namangan shahri Paxta mahalasida yangi uy",
      description: "Qulay mahallada yangi qurilgan uy. 3 xona, katta oshxona, hammom, hojatxona alohida. Yerning umumiy maydoni 6 sotix. Garaj va qo'shimcha omborxona mavjud.",
      type: "sale",
      price: 42000,
      currency: "USD",
      area: 120,
      rooms: 3,
      bathrooms: 1,
      floor: 1,
      total_floors: 1,
      address: "Paxta mahallasi, 7-ko'cha, 15-uy",
      city: "Namangan",
      district: "Namangan shahri",
      image_url: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80",
      featured: false,
    },
    {
      title: "Toshkent shahri Sergeli tumani 1 xonali yangi bino",
      description: "Zamonaviy loyiha binosi, lifti mavjud, parkovka joylari ko'p. Yangi ta'mirlangan, bino 2022-yilda topshirilgan. Metro qurilishi olib borilmoqda — kelajakda qiymat oshadi.",
      type: "sale",
      price: 48000,
      currency: "USD",
      area: 38,
      rooms: 1,
      bathrooms: 1,
      floor: 12,
      total_floors: 24,
      address: "Sergeli tumani, Yangi Sergeli ko'chasi, 3",
      city: "Toshkent",
      district: "Sergeli",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      featured: true,
    },
    {
      title: "Farg'ona shahri markazida 2 xonali ijaraga",
      description: "Shahar markazida qulay kvartira, yaqin atrofda barcha infratuzilma mavjud. Mebel bilan ijaraga beriladi. Oilalar uchun juda qulay muhit.",
      type: "rent",
      price: 280,
      currency: "USD",
      area: 52,
      rooms: 2,
      bathrooms: 1,
      floor: 2,
      total_floors: 5,
      address: "Farg'ona ko'chasi, 88-uy",
      city: "Farg'ona",
      district: "Markaz",
      image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      featured: false,
    },
  ]

  for (const p of seeds) {
    await query(
      `INSERT INTO properties
        (title, description, type, price, currency, area, rooms, bathrooms, floor, total_floors, address, city, district, image_url, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        p.title, p.description, p.type, p.price, p.currency,
        p.area, p.rooms, p.bathrooms, p.floor, p.total_floors,
        p.address, p.city, p.district, p.image_url, p.featured,
      ]
    )
  }
}

export { pool }
