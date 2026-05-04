'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function MemberSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`/members?${params.toString()}`, { scroll: false })
    }, 400)

    return () => clearTimeout(timer)
  }, [query, router, searchParams])

  return (
    <div className="max-w-md mx-auto mb-16 relative group">
      <div className="absolute inset-0 bg-accent-gold/5 rounded-2xl blur-xl group-focus-within:bg-accent-gold/10 transition-all duration-500" />
      <div className="relative flex items-center bg-white/40 backdrop-blur-md border border-brand/5 rounded-2xl p-2 group-focus-within:border-accent-gold/30 transition-all duration-300">
        <div className="pl-4 pr-2 text-brand/30">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, role, or bio..."
          className="w-full bg-transparent border-none outline-none text-sm py-2 tracking-widest text-brand placeholder:text-brand/20"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="p-2 text-brand/20 hover:text-brand transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
