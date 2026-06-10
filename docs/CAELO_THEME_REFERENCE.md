# Caelo Theme Reference (local snapshot)

> **Before `git pull` / merge:** Keep these values. Do **not** overwrite the current correct Caelo theme with older or generic colors from incoming changes. If a conflict appears in `src/styles/theme.css` or promo-related files, prefer **this document** and the local working copy you verified in the UI.

**Primary source of truth:** `src/styles/theme.css`  
**File snapshot:** `docs/caelo-theme.css.snapshot` (full copy — restore with `Copy-Item`)  
**After pull:** see `docs/THEME_RESTORE_AFTER_PULL.md`  
**Git tag:** `caelo-theme-stable` · **branch:** `caelo-theme-colors`  
**Theme editor defaults:** `src/components/theme-editor/ThemeEditorConfig.js`  
**Figma sync scripts:** `scripts/figma-sync-caelo-theme.*.js`

---

## Brand core

| Token | Hex / value | Usage |
|-------|-------------|--------|
| `--color-brand-primary` | `#123B94` | Nav, headings, promo title highlight, payout border |
| `--color-brand-secondary` | `#0d2a6a` | Balance modal item bg, gradients |
| `--color-brand-deep` | `#01206C` | Deep nav gradients, browse value text |
| `--color-brand-soft` | `#E5F6FF` | Soft panels, icons |
| `--color-brand-soft-border` | `#CCEEFF` | Category chips |
| `--color-brand-line` | `#7AD0F5` | Accent lines |

---

## Accent scale (blue UI)

| Token | Hex | Usage |
|-------|-----|--------|
| `--color-accent-50` | `#eff6ff` | Payout card bg, soft hovers |
| `--color-accent-100` | **`#dbeafe`** | **Progress bar track** (VIP tier + Current Promo), borders, chips |
| `--color-accent-200` | `#bfdbfe` | Borders, hovers |
| `--color-accent-300` | `#93c5fd` | Focus rings |
| `--color-accent-400` | `#60a5fa` | Progress bar fill start |
| `--color-accent-500` | `#3b82f6` | — |
| `--color-accent-600` | `#2563eb` | Progress bar fill end, links |
| `--color-accent-700` | `#1d4ed8` | Badge text |

**Important:** Current Promo and “Progress to next tier” both use **`--color-accent-100` (`#dbeafe`)** for the **unfilled** progress track. Do not revert to `--color-surface-muted` (`#f8fafc`) — it is too faint on white cards.

---

## Semantic aliases

| Token | Maps to |
|-------|---------|
| `--base-paper` | `var(--color-surface-base)` → `#ffffff` |
| `--base-ink` | `var(--color-text-strong)` → `#0f172a` |

---

## Text & surfaces

| Token | Value |
|-------|--------|
| `--color-text-strong` | `#0f172a` |
| `--color-text-main` | `#334155` |
| `--color-text-muted` | `#64748b` |
| `--color-surface-base` | `#ffffff` |
| `--color-surface-muted` | `#f8fafc` |
| `--color-border-default` | `#e2e8f0` |
| `--color-border-brand` | `#cfe0f9` |

---

## Dark nav / balance dropdown

| Token | Value |
|-------|--------|
| `--color-nav-top` / `--color-nav-main` | `#123B94` |
| `--color-nav-text-accent` | `#8ad4ff` | Active promo eyebrow in balance dropdown |
| `--color-nav-accent` | `#ffd84d` | Gold balances, CTA accents |
| `--color-nav-border-soft` | `rgb(106 200 255 / 0.12)` |
| `--balance-item-bg` | `var(--color-brand-secondary)` |

---

## CTA (gold buttons)

| Token | Value |
|-------|--------|
| `--color-cta-start` | `#ffcf4a` |
| `--color-cta-end` | `#ffb22d` |
| `--color-cta-text` | `#0c4a8e` |

`btn-theme-cta-soft` → End Promo button (slots, profile, balance dropdown).

---

## Recent Payout (home)

| Token | Value |
|-------|--------|
| `--color-payout-panel-border` | `var(--color-brand-primary)` |
| `--color-payout-card-bg` | `var(--color-accent-50)` |
| `--color-payout-highlight` | `#123b94` |
| `--color-payout-amount` | `#dd6044` |

---

## Progress bar component

**File:** `src/components/ui/ProgressBar.jsx`

| Variant | Track | Fill |
|---------|-------|------|
| `default` | `--color-surface-muted` | accent 400 → 600 gradient |
| `slot-promo` | **`--color-accent-100` (`#dbeafe`)** | accent 400 → 600 gradient |
| `dark` | `white/10` | CTA gold gradient (balance dropdown) |

**Current Promo** (slots + profile) uses `slot-promo` via `PromoProgressRow.jsx`.

**VIP progress** (`ProfilePage.jsx`, `VipTierProgressCard.jsx`): track `bg-[var(--color-accent-100)]`, fill `--gradient-cta` or brand styling — track color must stay **`#dbeafe`**.

---

## Current Promo UI

### Feature flags (`src/constants/slotCurrentPromo.js`)

| Flag | Intended local state | Location |
|------|----------------------|----------|
| `BALANCE_DROPDOWN_SHOW_ACTIVE_PROMO` | `false` (hidden for now) | Navbar balance dropdown |
| `PROFILE_SHOW_ACTIVE_PROMO` | check local file before pull | Account Details page |

Slots browse: always shown when promo is active (no flag).

### Typography colors

| Surface | Label | Promo name |
|---------|-------|------------|
| Slots browse | `--color-text-muted` | `--color-brand-primary` |
| Profile | `--base-ink` | `--color-brand-primary` (`profile-current-promo__name`) |
| Balance dropdown | `--color-nav-text-accent` | white (`balance-modal-text-primary`) |

### Theme classes (`theme.css`)

- `.slot-current-promo` — browse panel border `--color-border-brand`
- `.profile-current-promo` — bg `--base-paper`, name `--color-brand-primary`
- `.balance-modal-promo__eyebrow` — `--color-nav-text-accent`
- `.balance-modal-promo__bar` — track `rgb(255 255 255 / 0.1)`

### Key files

- `src/components/slots/CurrentPromoSection.jsx`
- `src/components/promo/PromoProgressRow.jsx`
- `src/components/promo/PromoSummaryDropdown.jsx`
- `src/hooks/useSlotCurrentPromo.js`

---

## Soft browse panel

```css
.soft-blue-panel {
  border: 1px solid var(--color-accent-100);
  background-image: linear-gradient(180deg, var(--gradient-soft-panel-start) 0%, var(--gradient-soft-panel-end) 100%);
}
```

`--gradient-soft-panel-start`: `#ffffff`  
`--gradient-soft-panel-end`: `#f8fbff`

---

## Git pull checklist

When merging or pulling:

1. **`src/styles/theme.css`** — preserve `--color-accent-100: #dbeafe`, brand primary `#123B94`, payout tokens, promo/balance classes above.
2. **`src/components/ui/ProgressBar.jsx`** — keep `slot-promo` track as `var(--color-accent-100)`.
3. **`src/components/promo/PromoProgressRow.jsx`** — keep `variant="slot-promo"` for light surfaces (not `default`).
4. **`src/constants/slotCurrentPromo.js`** — re-apply feature flags if overwritten.
5. **Do not** replace Caelo blues with riocity/staging grays or near-white progress tracks.

After pull, spot-check:

- Slots → Current Promo progress track visible (`#dbeafe`)
- Account Details → VIP “Progress to next tier” track matches promo track
- Recent Payout cards → accent-50 background, brand-primary border
- Navbar → `#123B94` header, gold nav accent `#ffd84d`

---

*Last updated from local working tree. Regenerate or amend this file after intentional theme changes.*
