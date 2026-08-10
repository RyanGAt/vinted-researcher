# Vinted Researcher

A small local desktop app that watches Vinted searches for unusually cheap tech listings and notifies you quickly.

## Goal

Catch good-value listings before they disappear, without automating purchases or account actions.

Example:

> Steam Deck 256GB — £92 — new listing

Click the notification and the real Vinted listing opens in your browser so you can decide whether to buy it.

## MVP

- Add one or more Vinted searches
- Store a maximum price for each search
- Poll periodically for new listings
- Remember listing IDs already seen
- Ignore duplicate listings
- Show Windows desktop notifications for new matches
- Click a notification to open the listing in Vinted
- Keep a small local history of discovered listings
- Pause/resume individual searches

## Initial searches

Examples only — these are configured by the user in the app:

- Steam Deck
- Nintendo Switch / Switch OLED
- GPUs
- Handheld PCs
- Other tech worth monitoring

## Stack

Keep the project deliberately small:

- **Tauri 2** — desktop shell and native capabilities
- **Vue 3 + TypeScript + Vite** — UI
- **SQLite** — searches, seen listing IDs and history
- **Rust/Tauri commands** — polling/network work and notifications where appropriate

Avoid adding a backend, hosted database or AI service for the MVP.

## How Vinted data should be read

Vinted does not provide a normal public consumer API for this use case.

Implementation should therefore start by researching how the public Vinted web search page retrieves listings. Prefer reading a stable JSON response used by the public website if practical. HTML parsing is the fallback.

Important rules:

- Read-only access only
- Do not automate login
- Do not automate favourites, messaging, offers or purchases
- Do not attempt to bypass CAPTCHAs, access controls or anti-bot protections
- Use conservative polling and backoff on errors/rate limits
- Keep the Vinted-specific fetching code isolated behind a provider interface so it can be replaced if their site changes

## Suggested architecture

```text
Vue UI
  |
  | Tauri commands/events
  v
Watcher service
  |-- Search configuration
  |-- Vinted provider
  |-- Deduplication
  |-- Match filtering
  |-- SQLite history
  `-- Desktop notifications
```

### Core models

**WatchSearch**

- id
- name
- query/search URL
- max price
- enabled
- poll interval
- created at

**Listing**

- Vinted listing ID
- title
- price
- URL
- image URL if available
- seller name if available
- discovered at
- search ID

## MVP behaviour

1. User creates a search such as `Steam Deck` with a maximum price of `£120`.
2. The watcher checks the configured Vinted search periodically.
3. Returned listing IDs are compared with locally stored IDs.
4. Existing listings are ignored.
5. New listings that meet the search rules are stored.
6. A Windows notification is displayed.
7. Clicking the notification opens the Vinted listing.

On first run of a newly-created search, existing search results should normally be marked as seen without notifying for every old listing. Only genuinely new listings found on later checks should alert the user.

## Later ideas — not MVP

- Typical-price estimates based on collected history
- Deal score / percentage below recent median
- Seller review-count filters if reliably available
- Multiple price bands
- Keyword include/exclude rules
- Search analytics and price charts
- Tray mode / launch on startup
- Discord/Telegram/mobile notifications
- eBay or other marketplace providers

Do not build these until the basic watcher is reliable.

## Development principle

Prefer the smallest implementation that works. No auth system, cloud infrastructure, agent framework, microservices or generic marketplace abstraction beyond the small provider boundary needed to keep Vinted-specific parsing isolated.

## Current plan

Work through the GitHub issues in order. First prove that we can reliably retrieve and parse public Vinted search results, then build the desktop application around that proven fetcher.
