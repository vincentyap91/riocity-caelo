# Restore Caelo theme after `git pull`

Use this when colors look wrong after pulling from `origin/main` (green brand, dark progress tracks, new `src/theme.css`, etc.).

## Quick restore (recommended)

```powershell
# From repo root — restores theme files from the saved tag
git checkout caelo-theme-stable -- src/styles/theme.css src/index.css src/components/ui/ProgressBar.jsx

# If pull added migration theme files you do not want:
git rm -f src/theme.css src/theme-cam88.css 2>$null
git checkout caelo-theme-stable -- src/index.css
```

Or restore the full snapshot file manually:

```powershell
Copy-Item docs/caelo-theme.css.snapshot src/styles/theme.css -Force
```

## Verify (30 seconds)

Open `src/styles/theme.css` and confirm:

- `--color-brand-primary: #123B94`
- `--color-accent-100: #dbeafe`
- `--color-nav-accent: #ffd84d`

Spot-check in the browser: nav blue, promo progress track light blue, Recent Payout border blue.

## Reference

- Token checklist: [CAELO_THEME_REFERENCE.md](./CAELO_THEME_REFERENCE.md)
- Full file copy: [caelo-theme.css.snapshot](./caelo-theme.css.snapshot)

## Git pointers

| Name | Purpose |
|------|---------|
| Tag `caelo-theme-stable` | Known-good commit with Caelo colors + this docs folder |
| Branch `caelo-theme-colors` | Same commit; easy to find in branch list |

```powershell
git show caelo-theme-stable:src/styles/theme.css
git diff caelo-theme-stable -- src/styles/theme.css
```
