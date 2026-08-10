# Valuation plan

Vinted Researcher should become a **deal detector**, not just a fixed-price watcher.

## Core flow

```text
VintedProvider
  -> Listing
  -> ProductMatcher
  -> PriceReferenceProvider(s)
  -> MarketHistory
  -> DealEvaluator
  -> Notification
```

## Phase 1 — Vinted watcher

Get reliable public Vinted listing retrieval working first, then persist listings locally so the app starts building its own historical dataset from day one.

Every observed listing should retain enough data for later valuation, including:

- listing ID
- raw title
- normalized title/model when known
- price
- URL
- image URL
- seller information when publicly available
- condition when publicly available
- search that discovered it
- first seen timestamp
- last seen timestamp if rechecked

Do not require valuation to work before the watcher can notify by a simple max-price rule.

## Phase 2 — Retail/reference pricing

Introduce replaceable `PriceReferenceProvider` implementations.

Potential sources to research include:

- Keepa / Amazon UK price history
- other documented retail-price APIs
- manual reference prices

Do not couple the app to one retailer or provider.

A reference result can contain:

- canonical product/model
- current retail price
- historical average retail price
- historical low retail price
- used/reference price where available
- source
- retrieved timestamp
- confidence

Cache reference values locally.

## Phase 3 — Build our own Vinted market history

The app should calculate market statistics from listings it has observed itself.

For each confidently matched canonical product/model, derive values such as:

- number of observations
- median asking price
- rolling median (for example recent 30/90 days)
- lower quartile / unusually cheap threshold
- minimum observed price
- last observed price

Median should be preferred over a simple average because extreme scam listings or unrealistic high listings can distort an average.

Until enough observations exist, market-history confidence must remain low and retail/manual references can carry more weight.

## Deal evaluation

A listing can be interesting for more than one reason.

Example signals:

- below a user's hard maximum price
- X% below current retail/reference value
- X% below observed Vinted median
- unusually low relative to recent Vinted listings
- high-confidence product match

Example:

```text
Steam Deck LCD 256GB
Vinted listing:       £80
Retail reference:     £300
Observed Vinted median: £145

Below retail:          73%
Below Vinted market:   45%
Deal result:           HIGH PRIORITY
```

Do not treat retail discount alone as resale profit. For older products, the observed used-market value should eventually be the stronger signal.

## Product matching

Start simple.

Normalize titles and match obvious brand/model/storage/variant terms before considering AI.

Examples:

```text
"Valve Steam Deck LCD 256 GB + case"
"Steamdeck 256gb lcd"
"Steam Deck 256GB"
```

should all be candidates for:

```text
Steam Deck LCD 256GB
```

Store match confidence and avoid strong valuation alerts when confidence is low.

## Alert rules

Eventually a watched search should support rules such as:

```text
price <= £100
OR
price is >= 40% below Vinted median
OR
price is >= 60% below retail reference
```

Notifications should explain why the listing was flagged, for example:

```text
Steam Deck 256GB — £82
43% below observed Vinted median (£145)
```

## Safety / scope

This project remains read-only toward marketplaces.

It should:

- discover public listings
- research/reference prices
- calculate deal signals
- notify the user
- open the real listing in a browser

It should not:

- auto-buy
- automate login
- send seller messages
- bypass access controls or CAPTCHA
- aggressively poll services

## Build order

1. Prove Vinted retrieval.
2. Build desktop shell.
3. Persist searches + every observed listing in SQLite.
4. Implement watcher/deduplication.
5. Add notifications.
6. Add retail/reference providers.
7. Add canonical product matching.
8. Calculate local Vinted market history.
9. Combine signals into deal scoring.

The important design choice is to **store useful listing history from the beginning**, even before the valuation engine exists. That means the app naturally improves its own market knowledge the longer it runs.
