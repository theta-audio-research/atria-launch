# downloads/

Installers served directly from the site. Drop the built files here, keep the
exact filenames the pages link to, and re-zip.

## Currently linked

| File | Linked from | Status |
|---|---|---|
| `ENTROPY_v0.2.3.dmg` | entropy.html (DOWNLOAD_FREE // MACOS) | live |
| `OLFACTORY_v0.5.3.dmg` | olfactory.html (DOWNLOAD_FREE // MACOS) | live |
| `EFFEK_v0.1.14_Installer.dmg` | effek.html (DOWNLOAD_FREE // MACOS) | **BROKEN — 404** |

> **⚠ effek.html is serving a 404.** It links to `EFFEK_v0.1.14_Installer.dmg`
> but the file present is `EFFEK_v0.1.16_Installer.dmg`. Either repoint the link
> or rename the file — whichever matches the build that is meant to be live.
> Found 2026-08-03 while adding ENTROPY v0.2.3; left alone because it is not
> this session's plugin to decide.

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

## Size

DMGs here are ~25 MB. **GitHub's web (drag-and-drop) upload caps at 25 MiB =
26,214,400 bytes**, and ENTROPY v0.2.3 is 26,256,572 — 41 KB over, which is why
the browser upload fails for it and worked for every earlier one. Push via git
instead (no limit below 50 MB), or rebuild the DMG with `format = 'UDBZ'` in the
plugin's `dmg_settings.py`, which is ~4.5 % smaller and mounts on 10.4+.
Do NOT use ULMO/lzma: it is 15 % smaller but needs macOS 10.15 to MOUNT, which
would silently break the 10.13 users these installers promise to support.
