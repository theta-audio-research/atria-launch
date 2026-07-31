# downloads/

Installers served directly from the site. Drop the built files here, keep the
exact filenames the pages link to, and re-zip.

## Currently linked

| File | Linked from | Status |
|---|---|---|
| `ENTROPY_v0.1.6.dmg` | entropy.html (DOWNLOAD_FREE // MACOS) | live |
| `OLFACTORY_v0.5.2.dmg` | olfactory.html (DOWNLOAD_FREE // MACOS) | live |
| `EFFEK_v0.1.13_Installer.dmg` | effek.html (DOWNLOAD_FREE // MACOS) | live |

## Rules

- **Filename is the contract.** The pages link to the exact name above. If the
  installer is named differently (e.g. `.dmg` instead of `.pkg`, or a different
  version), either rename the file to match or tell Claude to repoint the link.
- **Version in the filename**, so browser/CDN caches never serve a stale build.
  Bumping the version means updating the link too.
- **macOS only at launch.** Windows builds are planned for the whole catalogue;
  when they arrive, add `-windows.exe` alongside and the pages get a second button.
- **Keep this folder in the repo root**, sibling to `index.html` — the links are
  relative (`downloads/...`).

## Adding a new free plugin installer

1. Drop the installer here using the same naming pattern:
   `NAME_vX.Y.Z.dmg` (or `.pkg`) — match the filename in the page link exactly
2. Point that product page's CTA at it (`href="downloads/..." download`).
3. Flip the product's status from `[DEVELOPMENT]`/`NOTIFY_ME` to
   `[AVAILABLE]`/`DOWNLOAD // MAC` on `index.html`, `store.html` and `free.html`.
