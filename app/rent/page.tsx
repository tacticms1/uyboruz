import { redirect } from 'next/navigation'

export default function RentPage({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  const qs = new URLSearchParams({ ...searchParams, type: 'rent' })
  redirect(`/listings?${qs}`)
}
