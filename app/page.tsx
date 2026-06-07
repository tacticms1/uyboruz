import Link from 'next/link'
import { Search, TrendingUp, Shield, Headphones, ArrowRight } from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/lib/types'

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const base =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'http://localhost:3000'
        : 'http://localhost:3000')
    const res = await fetch(`${base}/api/listings?featured=true`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <>
      {/* Hero */}
      <section
        className="relative bg-blue-900 text-white py-20 px-4"
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, #1e3a8a, #1d4ed8)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-700 text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-5">
            O&apos;zbekistondagi №1 ko&apos;chmas mulk platformasi
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Orzu uyingizni
            <span className="text-blue-300"> UyBor</span>da toping
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Toshkent, Samarqand, Farg&apos;ona va boshqa shahrlarda minglab
            kvartira, uy va ofis e&apos;lonlari
          </p>

          {/* Search Form */}
          <form
            action="/listings"
            method="GET"
            className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto shadow-2xl"
          >
            <select
              name="type"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Barcha turlar</option>
              <option value="sale">Sotuvda</option>
              <option value="rent">Ijaraga</option>
            </select>
            <input
              name="city"
              type="text"
              placeholder="Shahar yoki tuman..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Search size={18} />
              Qidirish
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2,400+', label: "Faol e'lonlar" },
            { value: '15+', label: 'Shaharlar' },
            { value: '8,000+', label: 'Muvaffaqiyatli bitimlar' },
            { value: '24/7', label: 'Qo\'llab-quvvatlash' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-blue-700">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            href="/sale"
            className="group bg-blue-700 hover:bg-blue-800 text-white rounded-2xl p-8 flex items-center justify-between transition-colors"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Sotuvdagi uylar</h2>
              <p className="text-blue-200 text-sm">Kvartira, uy va kottejlar</p>
            </div>
            <ArrowRight
              size={32}
              className="opacity-70 group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="/rent"
            className="group bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl p-8 flex items-center justify-between transition-colors"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">Ijaradagi uylar</h2>
              <p className="text-emerald-100 text-sm">Oylik va uzoq muddatli ijara</p>
            </div>
            <ArrowRight
              size={32}
              className="opacity-70 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Tavsiya etilgan e&apos;lonlar
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Eng yaxshi takliflar
            </p>
          </div>
          <Link
            href="/listings"
            className="text-blue-700 hover:text-blue-900 font-medium text-sm flex items-center gap-1 transition-colors"
          >
            Barchasi <ArrowRight size={16} />
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.slice(0, 8).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p>E&apos;lonlar yuklanmoqda...</p>
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Nega UyBor.uz?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search size={28} />,
                title: 'Keng tanlov',
                desc: 'Minglab e\'lon — kvartiradan kottejgacha, ofisdan omborxonagacha.',
              },
              {
                icon: <Shield size={28} />,
                title: 'Ishonchli platforma',
                desc: 'Barcha e\'lonlar tekshiriladi. Soxta reklama — nol.',
              },
              {
                icon: <Headphones size={28} />,
                title: '24/7 qo\'llab-quvvatlash',
                desc: 'Savol tug\'ilsa — biz doim yordamda. Telefon, chat, email.',
              },
              {
                icon: <TrendingUp size={28} />,
                title: 'Bozor tahlili',
                desc: "Ko'chmas mulk bozori narxlari va tendensiyalari haqida bepul ma'lumot.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="text-blue-700 flex justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-900 text-white py-16 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            E&apos;lon joylashtiring — bepul!
          </h2>
          <p className="text-blue-200 mb-8">
            Mulkingizni sotish yoki ijaraga berish uchun admin panelga kiring
            va e&apos;lon joylashtiring.
          </p>
          <Link href="/admin/add" className="btn-primary bg-white text-blue-900 hover:bg-blue-50">
            E&apos;lon joylash
          </Link>
        </div>
      </section>
    </>
  )
}
