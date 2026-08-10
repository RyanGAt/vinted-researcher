const query = process.argv.slice(2).join(' ').trim() || 'Steam Deck'
const url = new URL('https://www.vinted.co.uk/api/v2/catalog/items')
url.searchParams.set('search_text', query)
url.searchParams.set('order', 'newest_first')
url.searchParams.set('per_page', '10')
url.searchParams.set('page', '1')

try {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36',
    },
  })

  if (!response.ok) {
    console.error(`Vinted request failed: ${response.status} ${response.statusText}`)
    process.exitCode = 1
  } else {
    const data = await response.json()
    const items = (data.items ?? []).map((item) => ({
      id: String(item.id ?? ''),
      title: item.title ?? '',
      price: Number(item.price?.amount ?? item.price ?? 0),
      url: item.url ?? '',
      imageUrl: item.photo?.url,
      sellerName: item.user?.login,
    }))

    console.table(items.map(({ id, title, price, sellerName }) => ({ id, title, price, sellerName })))
    console.log(JSON.stringify(items, null, 2))
  }
} catch (error) {
  console.error('Could not reach Vinted:', error instanceof Error ? error.message : error)
  console.error('This script intentionally does not retry aggressively or attempt to bypass access controls.')
  process.exitCode = 1
}
