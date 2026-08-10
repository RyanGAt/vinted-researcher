export type PriceReference = {
  source: string
  currentRetail?: number
  historicalAverage?: number
  usedMarketMedian?: number
  updatedAt: string
}

export type Listing = {
  id: string
  title: string
  price: number
  url: string
  imageUrl?: string
  sellerName?: string
  discoveredAt: string
}

export type DealEvaluation = {
  referencePrice?: number
  referenceSource?: string
  amountBelow?: number
  percentBelow?: number
  priority: 'none' | 'medium' | 'high'
}

export function evaluateDeal(listing: Listing, reference?: PriceReference): DealEvaluation {
  if (!reference) return { priority: 'none' }

  const referencePrice = reference.usedMarketMedian ?? reference.currentRetail ?? reference.historicalAverage
  if (!referencePrice || referencePrice <= 0 || listing.price >= referencePrice) {
    return { referencePrice, referenceSource: reference.source, priority: 'none' }
  }

  const amountBelow = referencePrice - listing.price
  const percentBelow = (amountBelow / referencePrice) * 100

  return {
    referencePrice,
    referenceSource: reference.source,
    amountBelow,
    percentBelow,
    priority: percentBelow >= 40 ? 'high' : percentBelow >= 25 ? 'medium' : 'none',
  }
}

export interface ListingProvider {
  search(queryOrUrl: string): Promise<Listing[]>
}

export interface PriceReferenceProvider {
  getReference(listing: Listing): Promise<PriceReference | undefined>
}
