# Building with THETA AUDIO RESEARCH

**Wrap everything in `ThetaProvider`.** All styling flows from CSS custom properties set by its root; components outside it render unstyled. `theme="void"` (default) is the family near-black; `theme="gold"` is the light White & Gold look. Set the page's default accent with `accent`, and switch a functional group's channel by wrapping it in `AccentScope` — the family convention: gold = master/default, `blue` = transport/link, `coral` = heat/damage, `teal` = filters/motion, `purple` = modulation, `amber` = SOLO and gain-reduction only.

**Styling idiom: design tokens via CSS variables — no utility-class vocabulary.** Write layout glue (grids, flex rows, padding) as inline styles or plain CSS that references the tokens:

- Surfaces: `--th-bg` (window field), `--th-header`, `--th-panel` (raised card), `--th-panel-off`, `--th-well` (recessed), borders `--th-border`, `--th-divider`
- Text: `--th-text` (cream titles), `--th-text-2` (silver labels), `--th-text-3` (dim)
- Brand + accents: `--th-gold`, `--th-gold-dim`, `--th-gold-muted`, `--th-accent` (current channel), `--th-coral`, `--th-teal`, `--th-purple`, `--th-blue`, `--th-amber`
- Fonts: `--th-font-display` (Montserrat), `--th-font-mono` (JetBrains Mono), `--th-font-body` (Rubik)
- Shape/space: `--th-r-card` (8px), `--th-r-pill` (4px), spacing scale `--th-s1`…`--th-s8`
- Type helpers: `.th-display` (tracked caps), `.th-label` (small caps label), `.th-value` (mono gold value)

House rules: headings and labels are ALL-CAPS with wide tracking; anything numeric or technical is JetBrains Mono; body copy is Rubik and never uppercase. Product names are always `ThetaWordmark` (the three-bar E is the brand — never set product names as plain text). Dividers are 1px gold at low opacity. Marketing pages live on the void theme; instrument UIs may use either theme.

**Where the truth lives:** tokens and component classes ship in `styles.css`'s import closure (`fonts/fonts.css`, `_ds_bundle.css` — every `.th-*` class and token under `.th-root`). Per-component API is `components/<Group>/<Name>/<Name>.d.ts`; usage patterns are in each `<Name>.prompt.md`.

**Idiomatic composition:**

```tsx
<ThetaProvider theme="void" accent="gold">
  <PluginHeader product="CATHODE" version="v16.60" actions={<Button size="sm">Save</Button>} />
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--th-s4)', padding: 'var(--th-s5)' }}>
    <ModulePanel title="RECEIVER" accent="blue">
      <PillSlider label="PUMP" value={0.5} />
      <PillSlider label="MIX" value={0.85} accent="gold" />
    </ModulePanel>
    <ModulePanel title="CRUSH" accent="coral">
      <Knob label="DRIVE" display="+3.5 dB" value={0.6} />
    </ModulePanel>
  </div>
</ThetaProvider>
```

Roster (22): Foundations `ThetaProvider`, `AccentScope` · Brand `ThetaLogo`, `ThetaWordmark`, `BrandLockup` · Controls `Button`, `Toggle`, `SegmentedControl`, `PillSlider`, `Knob`, `Select`, `TextField` · Display `Meter`, `ScopeScreen`, `DataReadout`, `Badge`, `SpecTable` · Structure `ModulePanel`, `PluginHeader`, `SectionHeading` · Marketing `ProductCard`, `Hero`.

# ThetaDS (theta-audio-design-system@0.1.0)

This design system is the published theta-audio-design-system React library, bundled as a single
browser global. All 22 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.ThetaDS`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).
- `guidelines/` — the design system's own usage guidance (22 doc(s), see `guidelines/index.md`). Read these before composing larger layouts.

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.ThetaDS.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { AccentScope } = window.ThetaDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<AccentScope />);
```

Wrap the tree in the provider — most components read theme/i18n from context:

```jsx
<ThetaProvider>{children}</ThetaProvider>
```

## Tokens

45 CSS custom properties from theta-audio-design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (4): `--th-border-off`, `--th-text-2`, `--th-text-3`, …
- **typography** (3): `--th-font-display`, `--th-font-mono`, `--th-font-body`
- **other** (38): `--th-bg`, `--th-header`, `--th-panel`, …

## Components

### foundations
- `AccentScope` — Switches the accent channel for a subtree  the family convention for
- `ThetaProvider` — Root wrapper for every THETA AUDIO RESEARCH interface. Applies the theme

### display
- `Badge` — Small mono tag: version strings (v16.60), format chips (VST3 / AU / AAX)
- `DataReadout` — Inline row of technical readouts in JetBrains Mono caps  dim label, gold
- `Meter` — Segmented LED level meter in a recessed well. Default reads bottom-up in
- `ScopeScreen` — Recessed instrument display: graph-paper grid, inner shadow and the gold
- `SpecTable` — Two-column specification table (system requirements, format support,

### brand
- `BrandLockup` — Full brand lockup: optional triangle-theta mark, wordmark in the custom
- `ThetaLogo` — The THETA triangle-theta mark: a stroked triangle crossed by a horizontal
- `ThetaWordmark` — Wordmark set in the THETA custom-typeface treatment: light-weight, extremely

### controls
- `Button` — Push button in the family chrome style: uppercase JetBrains Mono label,
- `Knob` — Rotary control drawn to the family recipe: thin arc track, 2.5px accent arc
- `PillSlider` — The signature THETA pill slider: a rounded capsule track with an
- `SegmentedControl` — Row of mutually-exclusive mode pills in a recessed track (RATE / LENGTH /
- `Select` — Dropdown in the family chrome style (preset selectors, FILTER OFF / MOD
- `TextField` — Text input in the instrument style: recessed well, mono type, accent focus
- `Toggle` — The family ON/OFF pill (3618): active  accent fill with cream text,

### marketing
- `Hero` — Full-bleed marketing hero on the near-black field: brand lockup, house-voice
- `ProductCard` — Catalog card for one instrument: near-black visual band with the product

### structure
- `ModulePanel` — Module card  the panel every THETA plugin is assembled from: accent border
- `PluginHeader` — The 72px plugin header strip: triangle-theta mark, THETA AUDIO RESEARCH
- `SectionHeading` — Centered section label between gold hairline rules  the marketing-page
