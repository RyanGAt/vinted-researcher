import type { Listing, ListingProvider } from '../domain'

type VintedMoney = {
  amount?: string | number
}

type VintedItem = {
  id?: string | number
  title?: string
  url?: string
  price?: VintedMoney | string | number
  photo?: { url?: string }
  user?: { login?: string }
}

type VintedCatalogResponse = {
  items?: VintedItem[]
}

function parsePrice(value: VintedItem['price']): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value)
  return Number(value?.amount ?? 0)
}

function normaliseUrl(url?: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://www.vinted.co.uk${url.startsWith('/') ? '' : '/'}${url}`
}

export class VintedProvider implements ListingProvider {
  constructor(private readonly apiBase = '/vinted-api') {}

  async search(queryOrUrl: string): Promise<Listing[]> {
    const query = extractSearchText(queryOrUrl)
    const params = new URLSearchParams({
      search_text: query,
      order: 'newest_first',
      per_page: '40',
      page: '1',
    })

    const response = await fetch(`${this.apiBase}/api/v2/catalog/items?${params.toString()}`, {
      headers: { Accept: 'application/json' },
    })

    if (response.status === 429) {
      throw new Error('Vinted rate-limited the request. Wait before trying again.')
    }

    if (!response.ok) {
      throw new Error(`Vinted request failed (${response.status}).`)
    }

    const data = await response.json() as VintedCatalogResponse
    return (data.items ?? [])
      .map(normaliseItem)
      .filter((item): item is Listing => item !== undefined)
  }
}

export function extractSearchText(queryOrUrl: string): string {
  const input = queryOrUrl.trim()
  if (!input) return ''

  try {
    const url = new URL(input)
    return url.searchParams.get('search_text')?.trim() || input
  } catch {
    return input
  }
}

function normaliseItem(item: VintedItem): Listing | undefined {
  const id = item.id?.toString()
  const title = item.title?.trim()
  const price = parsePrice(item.price)
  const url = normaliseUrl(item.url)

  if (!id || !title || !Number.isFinite(price) || price <= 0 || !url) return undefined

  return {
    id,
    title,
    price,
    url,
    imageUrl: item.photo?.url,
    sellerName: item.user?.login,
    discoveredAt: new Date().toISOString(),
  }
}
