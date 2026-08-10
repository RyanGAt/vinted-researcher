# Deal scoring notes

Deal scoring should remain explainable and should not hide important uncertainty behind one magic number.

## Signals

For each listing calculate independently where possible:

- `hard_price_match`: whether the listing is below the watched search's maximum price
- `discount_vs_retail_pct`
- `discount_vs_vinted_median_pct`
- `product_match_confidence`
- `market_history_confidence`
- `reference_price_confidence`

## Suggested priority bands

These are initial defaults only and should later be user-configurable.

### High priority

A confidently matched listing where one of the following is true:

- >= 40% below a sufficiently confident observed Vinted median
- >= 60% below a sufficiently confident retail/reference price
- below a manually configured hard price that the user explicitly considers a bargain

### Medium priority

- 20–40% below observed Vinted median
- 35–60% below retail/reference price
- a hard-price match with weak valuation data

### Normal

Everything else.

## Confidence rules

Do not produce statements such as `45% below market` from tiny or weak samples.

Suggested starting point for local market history:

- fewer than 5 observations: very low confidence
- 5–14: low confidence
- 15–39: medium confidence
- 40+: higher confidence

These thresholds are intentionally simple and can be refined later.

## Why median

Use median asking price as the default local-market reference rather than mean. Vinted data can contain outliers such as scams, accidental prices, bundles, damaged items and unrealistic seller pricing. Median reduces their impact.

## Important limitation

Observed Vinted listings are asking prices, not guaranteed sale prices. The UI and notification copy should say `observed Vinted median` or `typical observed asking price`, not claim it is the exact resale value.
