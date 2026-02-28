"use client"
import { useState, useEffect, useCallback, useRef } from "react"

type UseEntityListOptions = {
  endpoint: string
  limit?: number
}

type EntityListResult<T> = {
  data: T[]
  total: number
  page: number
  totalPages: number
  search: string
  setSearch: (s: string) => void
  setPage: (p: number) => void
  loading: boolean
  error: string
  refetch: () => void
}

export function useEntityList<T>({ endpoint, limit = 5 }: UseEntityListOptions): EntityListResult<T> {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearchState] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const debounceRef = useRef<NodeJS.Timeout>(null)

  const setSearch = useCallback((s: string) => {
    setSearchState(s)
    setPage(1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(s), 300)
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (debouncedSearch) params.set("search", debouncedSearch)
      const res = await fetch(`${endpoint}?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar dados")
      const json = await res.json()
      setData(json.data)
      setTotal(json.total)
      setTotalPages(json.totalPages)
    } catch {
      setError("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }, [endpoint, page, limit, debouncedSearch])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, total, page, totalPages, search, setSearch, setPage, loading, error, refetch: fetchData }
}
