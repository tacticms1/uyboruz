import { redirect } from 'next/navigation'

export default function SalePage({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const qs = new URLSearchParams({ ...searchParams, type: 'sale' })
  redirect(`/listings?${qs}`)
}
