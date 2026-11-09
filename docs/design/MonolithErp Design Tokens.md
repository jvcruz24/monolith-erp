# MonolithErp Design Tokens

Version 1.0 · Figma Variables + Tokens Studio + CSS custom properties · Mobile-first, light and dark

These tokens are tuned to the MonolithErp direction (minimal, cinematic, sparse editorial): warm neutrals do most of the work, one restrained accent carries emphasis, and semantic colors are reserved for status. Brand-specific values (the accent hue, the display typeface) are placeholders until the brand kit is finalized. Swap the primitive values and everything downstream follows.

## 0. Architecture and naming

### Three tiers

| Tier | Purpose | Example | Used by |
| --- | --- | --- | --- |
| Primitive | Raw values, no meaning | `color.neutral.900` | Only semantic tokens |
| Semantic | Meaning and role, switches in dark mode | `color.text.primary` | Components, screens |
| Component | Optional, scoped overrides | `button.primary.bg` | Single components |

Rule: designers and developers consume semantic tokens only. Primitives are never referenced directly in a component. This is what makes dark mode and rebranding a values change, not a refactor.

### Naming convention

Pattern: `{category}.{group}.{role}.{state}`, all lowercase, dot-separated in JSON and Figma, hyphen-separated in CSS.

| Surface | Format | Example |
| --- | --- | --- |
| JSON / Tokens Studio | dot path | `color.action.primary.bg-hover` |
| Figma Variables | slash groups | `color/action/primary/bg-hover` |
| CSS | `--mon-` prefix, hyphens | `--mon-color-action-primary-bg-hover` |
| Scales | number or t-shirt | `space.4`, `radius.md`, `font-size.lg` |

State suffixes: `-hover`, `-active`, `-disabled`, `-focus`. Scale numbers for space follow the 4px grid (`space.4` = 16px).

### Figma setup

- Collection **Primitives**: one mode. Groups `color/neutral`, `color/accent`, `color/success`, and so on, plus numeric variables for space, radius, font size.
- Collection **Semantic**: two modes, **Light** and **Dark**. Every semantic color aliases a primitive.
- Collection **Layout**: modes **Mobile**, **Tablet**, **Desktop** for responsive spacing and type steps if you want them to switch per frame.
- Text styles and effect styles are built from these variables (see sections 2 and 5).
- To sync with code, use Tokens Studio with the JSON in section 7, then Style Dictionary to emit CSS.

## 1. Color tokens

### 1.1 Primitives

**Neutral (warm gray)** is the brand's backbone. The primary brand color is Ink (`neutral.950`).

| Token | Value | Typical use |
| --- | --- | --- |
| neutral.0 | #FFFFFF | Raised surfaces, text on dark fills |
| neutral.50 | #FAF9F7 | Page canvas (light) |
| neutral.100 | #F3F2EF | Subtle fills, table stripes |
| neutral.200 | #E7E5E1 | Hairline borders |
| neutral.300 | #D3D0CA | Default borders, dividers |
| neutral.400 | #A8A49C | Disabled text, placeholders |
| neutral.500 | #7C7870 | Tertiary text, strong borders |
| neutral.600 | #5E5B54 | Secondary text |
| neutral.700 | #46443F | Borders (dark) |
| neutral.800 | #2B2A27 | Raised surfaces (dark) |
| neutral.850 | #221F1D | Subtle fills (dark) |
| neutral.900 | #1A1917 | Primary text (light), surface (dark) |
| neutral.950 | #0F0F0E | Ink: primary actions (light), canvas (dark) |

**Accent: Dusk (violet)**, the single brand accent. Placeholder hue.

| Token | Value |
| --- | --- |
| accent.50 | #F1EFFC |
| accent.100 | #E2DEF8 |
| accent.300 | #A89DEB |
| accent.500 | #6D5DD3 |
| accent.600 | #5A4AB8 |
| accent.700 | #473A94 |
| accent.900 | #251E4D |

**Semantic hues** (each has 50 for tint, 300 for dark-mode text, 500 solid, 600 hover/text-on-tint):

| Hue | 50 | 300 | 500 | 600 |
| --- | --- | --- | --- | --- |
| success | #EAF6EE | #7CC79A | #2E7D4F | #256640 |
| error | #FBEAEA | #F29A9A | #C62828 | #A61F1F |
| warning | #FCF3DF | #EDC373 | #B7791F | #946116 |
| info | #E6F1FA | #7CBCEA | #0B79C4 | #0A62A0 |

### 1.2 Semantic tokens with dark mode

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| color.bg.canvas | neutral.50 | neutral.950 | App background behind everything |
| color.bg.surface | neutral.0 | neutral.900 | Cards, panels, tables |
| color.bg.raised | neutral.0 | neutral.800 | Menus, popovers, modals |
| color.bg.subtle | neutral.100 | neutral.850 | Table headers, zebra rows, input fills |
| color.bg.overlay | rgba(15,15,14,0.5) | rgba(0,0,0,0.65) | Scrim behind modals and drawers |
| color.text.primary | neutral.900 | neutral.50 | Body copy, headings, table values |
| color.text.secondary | neutral.600 | neutral.400 | Labels, helper text, metadata |
| color.text.tertiary | neutral.500 | neutral.500 | Timestamps, captions (non-essential only) |
| color.text.disabled | neutral.400 | neutral.600 | Disabled controls |
| color.text.inverse | neutral.0 | neutral.950 | Text on solid dark/light fills |
| color.text.link | accent.600 | accent.300 | Inline links |
| color.border.subtle | neutral.200 | neutral.800 | Hairlines inside a surface |
| color.border.default | neutral.300 | neutral.700 | Inputs, cards, dividers |
| color.border.strong | neutral.500 | neutral.500 | Hover borders, selected outlines |
| color.action.primary.bg | neutral.950 | neutral.50 | Primary button fill |
| color.action.primary.bg-hover | neutral.800 | neutral.200 | Primary button hover |
| color.action.primary.text | neutral.0 | neutral.950 | Primary button label |
| color.action.accent.bg | accent.600 | accent.500 | Highlight CTA, selected nav, key charts |
| color.action.accent.bg-hover | accent.700 | accent.300 | Accent hover |
| color.action.accent.text | neutral.0 | neutral.0 | Label on accent fill |
| color.focus.ring | accent.500 | accent.300 | Keyboard focus outline |
| color.status.success.bg | success.50 | #10261A | Success banners, paid/complete badges |
| color.status.success.text | success.600 | success.300 | Text and icons on success tint |
| color.status.success.solid | success.500 | success.500 | Solid dots, progress, charts |
| color.status.error.bg | error.50 | #2E1313 | Error banners, field error background |
| color.status.error.text | error.600 | error.300 | Error messages, overdue badges |
| color.status.error.solid | error.500 | error.500 | Destructive buttons, error borders |
| color.status.warning.bg | warning.50 | #2E2410 | Warnings, low-stock badges |
| color.status.warning.text | warning.600 | warning.300 | Warning messages |
| color.status.warning.solid | warning.500 | warning.500 | Warning indicators |
| color.status.info.bg | info.50 | #0F2433 | Informational banners, neutral notices |
| color.status.info.text | info.600 | info.300 | Info messages |
| color.status.info.solid | info.500 | info.500 | Info indicators |

### 1.3 Usage guidelines

- **Ink and neutrals carry the interface.** Default to `bg.canvas`, `bg.surface`, and `text.primary`. A screen should look almost monochrome before any accent appears.
- **One accent per view.** Use `action.accent` for the single most important thing or the current selection. If three things are violet, none of them is important.
- **Status colors mean status.** Never use success, error, warning, or info for decoration or branding. In an ERP they signal money and risk (paid, overdue, low stock, failed sync).
- **Never rely on color alone.** Pair status colors with an icon or label (a red amount also gets a minus sign or "Overdue" text).
- **Contrast.** Aim for WCAG AA: 4.5:1 for body text, 3:1 for large text and UI boundaries. Verify the final pairs in your contrast checker after the accent hue is locked; the table above is a starting point, not a certified result.
- **Dark mode is not inverted light mode.** Surfaces get lighter as they rise (950 → 900 → 800), shadows are replaced by borders and lighter fills, and status text steps to the 300 shade for legibility.
- **Data visualization:** use accent first, then neutral.500, then the semantic solids only when the data is actually good/bad/warning.

## 2. Typography tokens

### 2.1 Font families

| Token | Value | Usage |
| --- | --- | --- |
| font.family.display | "Instrument Serif", Georgia, "Times New Roman", serif | Marketing headlines, empty states, large numerals in dashboards. Placeholder for the brand's editorial face. |
| font.family.sans | "Inter", system-ui, -apple-system, "Segoe UI", sans-serif | All product UI: forms, tables, navigation, buttons |
| font.family.mono | "JetBrains Mono", ui-monospace, "Cascadia Code", Consolas, monospace | IDs, SKUs, invoice numbers, code, API keys |

Use the display serif sparingly (one large moment per screen). In dense ERP screens, use sans with tabular numerals.

### 2.2 Font sizes (about 1.25 ratio, rem on a 16px root)

| Token | rem | px | Usage |
| --- | --- | --- | --- |
| font.size.2xs | 0.6875 | 11 | Legal, chart axis labels (minimum) |
| font.size.xs | 0.75 | 12 | Captions, badges, table meta |
| font.size.sm | 0.875 | 14 | Default UI text, table cells, form labels |
| font.size.md | 1 | 16 | Body copy, inputs (16 avoids iOS zoom) |
| font.size.lg | 1.125 | 18 | Lead paragraphs, card titles |
| font.size.xl | 1.25 | 20 | Section headings (H4) |
| font.size.2xl | 1.5 | 24 | Page subheadings (H3) |
| font.size.3xl | 1.875 | 30 | Page titles (H2) |
| font.size.4xl | 2.25 | 36 | Dashboard KPIs, hero (mobile) |
| font.size.5xl | 3 | 48 | Hero (tablet) |
| font.size.6xl | 4.5 | 72 | Hero (desktop), display only |

### 2.3 Weights, line heights, letter spacing

| Token | Value | Usage |
| --- | --- | --- |
| font.weight.regular | 400 | Body text |
| font.weight.medium | 500 | Labels, nav items, table headers |
| font.weight.semibold | 600 | Buttons, headings in UI |
| font.weight.bold | 700 | Rare emphasis, KPI figures |
| line-height.none | 1 | Single-line display numerals |
| line-height.tight | 1.1 | Display and hero headings |
| line-height.snug | 1.25 | Headings in UI |
| line-height.normal | 1.5 | Body text |
| line-height.relaxed | 1.65 | Long-form reading, documentation |
| letter-spacing.tighter | -0.03em | Large display type (48px and up) |
| letter-spacing.tight | -0.015em | Headings 24 to 36px |
| letter-spacing.normal | 0 | Body and UI |
| letter-spacing.wide | 0.02em | Small text (12px) and buttons |
| letter-spacing.caps | 0.12em | Uppercase eyebrows and section labels |

### 2.4 Text styles (composite tokens)

| Style | Family | Size | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- | --- |
| display.xl | display | 6xl | 400 | tight | tighter |
| display.lg | display | 4xl | 400 | tight | tighter |
| heading.lg | sans | 3xl | 600 | snug | tight |
| heading.md | sans | 2xl | 600 | snug | tight |
| heading.sm | sans | xl | 600 | snug | normal |
| body.lg | sans | lg | 400 | normal | normal |
| body.md | sans | md | 400 | normal | normal |
| ui.md | sans | sm | 400 | normal | normal |
| ui.label | sans | sm | 500 | normal | normal |
| caption | sans | xs | 400 | normal | wide |
| eyebrow | sans | xs | 500 | normal | caps (uppercase) |
| data.md | mono | sm | 400 | normal | normal |
| data.numeric | sans | sm | 500 | normal | normal, `font-variant-numeric: tabular-nums` |

### 2.5 Usage guidelines

- Right-align and set `tabular-nums` on every column of figures so digits line up.
- Limit lines to roughly 60 to 75 characters for reading text.
- Use at most three sizes on a single dense screen. Hierarchy comes from weight and color before size.
- Do not go below `font.size.xs` for anything a user must read. `2xs` is for chart axes and legal footers only.
- Set inputs at `font.size.md` (16px) on mobile to prevent browser auto-zoom.

## 3. Spacing tokens

Base unit: **4px**. All spacing, padding, and gaps are multiples of it.

| Token | px | rem | When to use |
| --- | --- | --- | --- |
| space.0 | 0 | 0 | Reset, flush edges |
| space.1 | 4 | 0.25 | Icon-to-text gap, tight badge padding |
| space.2 | 8 | 0.5 | Inline gaps between related controls, compact cell padding |
| space.3 | 12 | 0.75 | Input vertical padding, dense list item padding |
| space.4 | 16 | 1 | Default padding in cards, gap between form fields |
| space.5 | 20 | 1.25 | Comfortable card padding on larger screens |
| space.6 | 24 | 1.5 | Gap between groups inside a section |
| space.8 | 32 | 2 | Gap between distinct blocks, modal padding |
| space.10 | 40 | 2.5 | Page gutter on desktop |
| space.12 | 48 | 3 | Space between sections |
| space.16 | 64 | 4 | Large section spacing, hero padding |
| space.20 | 80 | 5 | Marketing section rhythm |
| space.24 | 96 | 6 | Cinematic breathing room (editorial layouts) |

### Semantic spacing aliases

| Token | Maps to | Usage |
| --- | --- | --- |
| space.inline.xs / sm / md | space.1 / 2 / 4 | Horizontal gaps between siblings |
| space.stack.sm / md / lg | space.2 / 4 / 6 | Vertical gaps between stacked elements |
| space.inset.sm / md / lg | space.2 / 4 / 6 | Padding inside components |
| space.gutter | space.4 mobile, space.6 tablet, space.10 desktop | Page side margins |
| space.section | space.12 mobile, space.16 desktop | Vertical rhythm between page sections |

### Usage guidelines

- Closer means related. Use 4 to 8px inside a unit, 16 to 24px between units, 48px or more between sections.
- Prefer the semantic aliases in components; use raw `space.n` for one-off layout.
- Density: data-heavy ERP screens (tables, ledgers) use `space.2` and `space.3`; marketing and onboarding screens use `space.8` and up. Do not invent values like 10px or 18px.
- Touch targets stay at least 44px tall on mobile regardless of visual padding.

## 4. Border radius tokens

The look is sparse and editorial, so radii stay small. Round corners signal interactivity, not decoration.

| Token | Value | Usage |
| --- | --- | --- |
| radius.none | 0 | Tables, full-bleed images, editorial dividers |
| radius.xs | 2px | Badges, tags, tiny chips |
| radius.sm | 4px | Checkboxes, small buttons, tooltips |
| radius.md | 6px | Default: buttons, inputs, selects |
| radius.lg | 10px | Cards, panels, dropdown menus |
| radius.xl | 16px | Modals, drawers, large media cards |
| radius.full | 9999px | Avatars, pills, switches, status dots |

Guidelines: nested corners should step down (a `lg` card containing an `md` button). Keep one radius per component family, and do not mix `full` pills and `md` buttons in the same toolbar.

## 5. Shadow tokens

Elevation is used only for things that float above the page. Resting content uses borders, not shadows.

| Token | Light definition | Dark treatment | Usage |
| --- | --- | --- | --- |
| shadow.0 | none | none | Flat content, table rows |
| shadow.1 | 0 1px 2px rgba(15,15,14,0.06) | none; use border.subtle | Cards on hover, sticky headers |
| shadow.2 | 0 2px 6px -1px rgba(15,15,14,0.08), 0 1px 2px rgba(15,15,14,0.06) | 0 2px 6px rgba(0,0,0,0.4) | Dropdowns, popovers, tooltips |
| shadow.3 | 0 8px 20px -4px rgba(15,15,14,0.12), 0 2px 6px rgba(15,15,14,0.06) | 0 8px 20px rgba(0,0,0,0.5) | Floating toolbars, date pickers |
| shadow.4 | 0 20px 40px -8px rgba(15,15,14,0.18), 0 4px 10px rgba(15,15,14,0.08) | 0 20px 40px rgba(0,0,0,0.6) | Modals, command palette, drawers |
| shadow.focus | 0 0 0 2px bg.canvas, 0 0 0 4px focus.ring | same, with dark tokens | Keyboard focus on every interactive element |

Guidelines: pair each level with the matching surface (`shadow.2` with `bg.raised`). In dark mode, rely on lighter surfaces and a 1px `border.subtle` for separation, with shadows as a secondary cue. Never stack two elevated elements at the same level.

## 6. Breakpoint tokens

Mobile-first: styles apply from the breakpoint **up** (`min-width`).

| Token | Min width | Typical device | Layout behavior |
| --- | --- | --- | --- |
| breakpoint.xs | 0 | Small phones | Single column, bottom nav, stacked tables become cards |
| breakpoint.sm | 640px | Large phones, landscape | Two-column forms, horizontal scroll tables |
| breakpoint.md | 768px | Tablets | Collapsible side nav (icons only), 2 to 3 column grids |
| breakpoint.lg | 1024px | Small laptops | Persistent side nav, full data tables |
| breakpoint.xl | 1280px | Desktops | Wider content, optional right detail panel |
| breakpoint.2xl | 1536px | Large monitors | Cap content width, add side margins |

Guidelines:

- Design the mobile layout first and add complexity upward.
- Cap readable content at roughly 1200px (`container.max`) and center it. Dashboards and tables may go full width.
- CSS custom properties cannot be used inside `@media` queries. Keep breakpoints in the JSON, generate them into Sass variables, Tailwind config, or `@custom-media` rules with Style Dictionary.
- In Figma, create frames at 375, 768, 1024, 1280, and 1536 wide and use the Layout collection modes for responsive spacing.

## 7. Code: tokens in DTCG JSON

Compatible with Tokens Studio and Style Dictionary (W3C Design Tokens format). Shown in full for primitives and one example per semantic group; extend by following the same pattern from the tables above.

```json
{
  "color": {
    "neutral": {
      "$type": "color",
      "0": { "$value": "#FFFFFF" },
      "50": { "$value": "#FAF9F7" },
      "100": { "$value": "#F3F2EF" },
      "200": { "$value": "#E7E5E1" },
      "300": { "$value": "#D3D0CA" },
      "400": { "$value": "#A8A49C" },
      "500": { "$value": "#7C7870" },
      "600": { "$value": "#5E5B54" },
      "700": { "$value": "#46443F" },
      "800": { "$value": "#2B2A27" },
      "850": { "$value": "#221F1D" },
      "900": { "$value": "#1A1917" },
      "950": { "$value": "#0F0F0E" }
    },
    "accent": {
      "$type": "color",
      "50": { "$value": "#F1EFFC" },
      "100": { "$value": "#E2DEF8" },
      "300": { "$value": "#A89DEB" },
      "500": { "$value": "#6D5DD3" },
      "600": { "$value": "#5A4AB8" },
      "700": { "$value": "#473A94" },
      "900": { "$value": "#251E4D" }
    },
    "success": { "$type": "color", "50": { "$value": "#EAF6EE" }, "300": { "$value": "#7CC79A" }, "500": { "$value": "#2E7D4F" }, "600": { "$value": "#256640" } },
    "error":   { "$type": "color", "50": { "$value": "#FBEAEA" }, "300": { "$value": "#F29A9A" }, "500": { "$value": "#C62828" }, "600": { "$value": "#A61F1F" } },
    "warning": { "$type": "color", "50": { "$value": "#FCF3DF" }, "300": { "$value": "#EDC373" }, "500": { "$value": "#B7791F" }, "600": { "$value": "#946116" } },
    "info":    { "$type": "color", "50": { "$value": "#E6F1FA" }, "300": { "$value": "#7CBCEA" }, "500": { "$value": "#0B79C4" }, "600": { "$value": "#0A62A0" } }
  },
  "semantic": {
    "light": {
      "color": {
        "bg": {
          "canvas":  { "$type": "color", "$value": "{color.neutral.50}" },
          "surface": { "$type": "color", "$value": "{color.neutral.0}" }
        },
        "text": {
          "primary":   { "$type": "color", "$value": "{color.neutral.900}" },
          "secondary": { "$type": "color", "$value": "{color.neutral.600}" }
        },
        "action": {
          "primary": {
            "bg":       { "$type": "color", "$value": "{color.neutral.950}" },
            "bg-hover": { "$type": "color", "$value": "{color.neutral.800}" },
            "text":     { "$type": "color", "$value": "{color.neutral.0}" }
          }
        },
        "status": {
          "error": {
            "bg":    { "$type": "color", "$value": "{color.error.50}" },
            "text":  { "$type": "color", "$value": "{color.error.600}" },
            "solid": { "$type": "color", "$value": "{color.error.500}" }
          }
        }
      }
    },
    "dark": {
      "color": {
        "bg": {
          "canvas":  { "$type": "color", "$value": "{color.neutral.950}" },
          "surface": { "$type": "color", "$value": "{color.neutral.900}" }
        },
        "text": {
          "primary":   { "$type": "color", "$value": "{color.neutral.50}" },
          "secondary": { "$type": "color", "$value": "{color.neutral.400}" }
        },
        "action": {
          "primary": {
            "bg":       { "$type": "color", "$value": "{color.neutral.50}" },
            "bg-hover": { "$type": "color", "$value": "{color.neutral.200}" },
            "text":     { "$type": "color", "$value": "{color.neutral.950}" }
          }
        },
        "status": {
          "error": {
            "bg":    { "$type": "color", "$value": "#2E1313" },
            "text":  { "$type": "color", "$value": "{color.error.300}" },
            "solid": { "$type": "color", "$value": "{color.error.500}" }
          }
        }
      }
    }
  },
  "font": {
    "family": {
      "display": { "$type": "fontFamily", "$value": ["Instrument Serif", "Georgia", "serif"] },
      "sans":    { "$type": "fontFamily", "$value": ["Inter", "system-ui", "sans-serif"] },
      "mono":    { "$type": "fontFamily", "$value": ["JetBrains Mono", "ui-monospace", "monospace"] }
    },
    "size": {
      "$type": "dimension",
      "2xs": { "$value": "0.6875rem" }, "xs": { "$value": "0.75rem" }, "sm": { "$value": "0.875rem" },
      "md": { "$value": "1rem" }, "lg": { "$value": "1.125rem" }, "xl": { "$value": "1.25rem" },
      "2xl": { "$value": "1.5rem" }, "3xl": { "$value": "1.875rem" }, "4xl": { "$value": "2.25rem" },
      "5xl": { "$value": "3rem" }, "6xl": { "$value": "4.5rem" }
    },
    "weight": {
      "$type": "fontWeight",
      "regular": { "$value": 400 }, "medium": { "$value": 500 },
      "semibold": { "$value": 600 }, "bold": { "$value": 700 }
    }
  },
  "line-height": {
    "$type": "number",
    "none": { "$value": 1 }, "tight": { "$value": 1.1 }, "snug": { "$value": 1.25 },
    "normal": { "$value": 1.5 }, "relaxed": { "$value": 1.65 }
  },
  "letter-spacing": {
    "$type": "dimension",
    "tighter": { "$value": "-0.03em" }, "tight": { "$value": "-0.015em" }, "normal": { "$value": "0em" },
    "wide": { "$value": "0.02em" }, "caps": { "$value": "0.12em" }
  },
  "space": {
    "$type": "dimension",
    "0": { "$value": "0px" }, "1": { "$value": "4px" }, "2": { "$value": "8px" }, "3": { "$value": "12px" },
    "4": { "$value": "16px" }, "5": { "$value": "20px" }, "6": { "$value": "24px" }, "8": { "$value": "32px" },
    "10": { "$value": "40px" }, "12": { "$value": "48px" }, "16": { "$value": "64px" },
    "20": { "$value": "80px" }, "24": { "$value": "96px" }
  },
  "radius": {
    "$type": "dimension",
    "none": { "$value": "0px" }, "xs": { "$value": "2px" }, "sm": { "$value": "4px" }, "md": { "$value": "6px" },
    "lg": { "$value": "10px" }, "xl": { "$value": "16px" }, "full": { "$value": "9999px" }
  },
  "shadow": {
    "1": { "$type": "shadow", "$value": { "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px", "color": "rgba(15,15,14,0.06)" } },
    "2": { "$type": "shadow", "$value": [
      { "offsetX": "0px", "offsetY": "2px", "blur": "6px", "spread": "-1px", "color": "rgba(15,15,14,0.08)" },
      { "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px", "color": "rgba(15,15,14,0.06)" } ] },
    "3": { "$type": "shadow", "$value": [
      { "offsetX": "0px", "offsetY": "8px", "blur": "20px", "spread": "-4px", "color": "rgba(15,15,14,0.12)" },
      { "offsetX": "0px", "offsetY": "2px", "blur": "6px", "spread": "0px", "color": "rgba(15,15,14,0.06)" } ] },
    "4": { "$type": "shadow", "$value": [
      { "offsetX": "0px", "offsetY": "20px", "blur": "40px", "spread": "-8px", "color": "rgba(15,15,14,0.18)" },
      { "offsetX": "0px", "offsetY": "4px", "blur": "10px", "spread": "0px", "color": "rgba(15,15,14,0.08)" } ] }
  },
  "breakpoint": {
    "$type": "dimension",
    "xs": { "$value": "0px" }, "sm": { "$value": "640px" }, "md": { "$value": "768px" },
    "lg": { "$value": "1024px" }, "xl": { "$value": "1280px" }, "2xl": { "$value": "1536px" }
  }
}
```

## 8. Code: CSS custom properties

This is what Style Dictionary would emit. Components reference only the semantic `--mon-color-*` variables.

```css
:root {
  /* Primitives */
  --mon-neutral-0: #FFFFFF;   --mon-neutral-50: #FAF9F7;  --mon-neutral-100: #F3F2EF;
  --mon-neutral-200: #E7E5E1; --mon-neutral-300: #D3D0CA; --mon-neutral-400: #A8A49C;
  --mon-neutral-500: #7C7870; --mon-neutral-600: #5E5B54; --mon-neutral-700: #46443F;
  --mon-neutral-800: #2B2A27; --mon-neutral-850: #221F1D; --mon-neutral-900: #1A1917;
  --mon-neutral-950: #0F0F0E;
  --mon-accent-300: #A89DEB;  --mon-accent-500: #6D5DD3;  --mon-accent-600: #5A4AB8;
  --mon-accent-700: #473A94;
  --mon-success-500: #2E7D4F; --mon-error-500: #C62828;
  --mon-warning-500: #B7791F; --mon-info-500: #0B79C4;

  /* Semantic (light) */
  --mon-color-bg-canvas: var(--mon-neutral-50);
  --mon-color-bg-surface: var(--mon-neutral-0);
  --mon-color-bg-raised: var(--mon-neutral-0);
  --mon-color-bg-subtle: var(--mon-neutral-100);
  --mon-color-text-primary: var(--mon-neutral-900);
  --mon-color-text-secondary: var(--mon-neutral-600);
  --mon-color-text-tertiary: var(--mon-neutral-500);
  --mon-color-text-disabled: var(--mon-neutral-400);
  --mon-color-text-inverse: var(--mon-neutral-0);
  --mon-color-text-link: var(--mon-accent-600);
  --mon-color-border-subtle: var(--mon-neutral-200);
  --mon-color-border-default: var(--mon-neutral-300);
  --mon-color-border-strong: var(--mon-neutral-500);
  --mon-color-action-primary-bg: var(--mon-neutral-950);
  --mon-color-action-primary-bg-hover: var(--mon-neutral-800);
  --mon-color-action-primary-text: var(--mon-neutral-0);
  --mon-color-action-accent-bg: var(--mon-accent-600);
  --mon-color-action-accent-bg-hover: var(--mon-accent-700);
  --mon-color-focus-ring: var(--mon-accent-500);
  --mon-color-status-error-bg: #FBEAEA;
  --mon-color-status-error-text: #A61F1F;
  --mon-color-status-error-solid: var(--mon-error-500);
  /* repeat the pattern for success, warning, info */

  /* Typography */
  --mon-font-display: "Instrument Serif", Georgia, serif;
  --mon-font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --mon-font-mono: "JetBrains Mono", ui-monospace, Consolas, monospace;
  --mon-font-size-xs: 0.75rem;  --mon-font-size-sm: 0.875rem; --mon-font-size-md: 1rem;
  --mon-font-size-lg: 1.125rem; --mon-font-size-xl: 1.25rem;  --mon-font-size-2xl: 1.5rem;
  --mon-font-size-3xl: 1.875rem; --mon-font-size-4xl: 2.25rem;
  --mon-font-weight-regular: 400; --mon-font-weight-medium: 500;
  --mon-font-weight-semibold: 600; --mon-font-weight-bold: 700;
  --mon-line-height-tight: 1.1; --mon-line-height-snug: 1.25;
  --mon-line-height-normal: 1.5; --mon-line-height-relaxed: 1.65;
  --mon-letter-spacing-tight: -0.015em; --mon-letter-spacing-wide: 0.02em;
  --mon-letter-spacing-caps: 0.12em;

  /* Spacing (4px base) */
  --mon-space-1: 0.25rem; --mon-space-2: 0.5rem;  --mon-space-3: 0.75rem;
  --mon-space-4: 1rem;    --mon-space-5: 1.25rem; --mon-space-6: 1.5rem;
  --mon-space-8: 2rem;    --mon-space-10: 2.5rem; --mon-space-12: 3rem;
  --mon-space-16: 4rem;   --mon-space-20: 5rem;   --mon-space-24: 6rem;

  /* Radius */
  --mon-radius-xs: 2px; --mon-radius-sm: 4px; --mon-radius-md: 6px;
  --mon-radius-lg: 10px; --mon-radius-xl: 16px; --mon-radius-full: 9999px;

  /* Shadow */
  --mon-shadow-1: 0 1px 2px rgba(15, 15, 14, 0.06);
  --mon-shadow-2: 0 2px 6px -1px rgba(15, 15, 14, 0.08), 0 1px 2px rgba(15, 15, 14, 0.06);
  --mon-shadow-3: 0 8px 20px -4px rgba(15, 15, 14, 0.12), 0 2px 6px rgba(15, 15, 14, 0.06);
  --mon-shadow-4: 0 20px 40px -8px rgba(15, 15, 14, 0.18), 0 4px 10px rgba(15, 15, 14, 0.08);
  --mon-shadow-focus: 0 0 0 2px var(--mon-color-bg-canvas), 0 0 0 4px var(--mon-color-focus-ring);
}

/* Dark mode: follows the OS, or force with data-theme="dark" */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark overrides below */ }
}
:root[data-theme="dark"] {
  --mon-color-bg-canvas: var(--mon-neutral-950);
  --mon-color-bg-surface: var(--mon-neutral-900);
  --mon-color-bg-raised: var(--mon-neutral-800);
  --mon-color-bg-subtle: var(--mon-neutral-850);
  --mon-color-text-primary: var(--mon-neutral-50);
  --mon-color-text-secondary: var(--mon-neutral-400);
  --mon-color-text-disabled: var(--mon-neutral-600);
  --mon-color-text-inverse: var(--mon-neutral-950);
  --mon-color-text-link: var(--mon-accent-300);
  --mon-color-border-subtle: var(--mon-neutral-800);
  --mon-color-border-default: var(--mon-neutral-700);
  --mon-color-action-primary-bg: var(--mon-neutral-50);
  --mon-color-action-primary-bg-hover: var(--mon-neutral-200);
  --mon-color-action-primary-text: var(--mon-neutral-950);
  --mon-color-action-accent-bg: var(--mon-accent-500);
  --mon-color-action-accent-bg-hover: var(--mon-accent-300);
  --mon-color-focus-ring: var(--mon-accent-300);
  --mon-color-status-error-bg: #2E1313;
  --mon-color-status-error-text: #F29A9A;
  --mon-shadow-2: 0 2px 6px rgba(0, 0, 0, 0.4);
  --mon-shadow-4: 0 20px 40px rgba(0, 0, 0, 0.6);
}
```

In the CSS, the `prefers-color-scheme` block is a stub: duplicate the `data-theme="dark"` declarations inside it (Style Dictionary can generate both from one source) so the app respects the OS setting by default and a manual toggle still works.

## 9. Usage examples

### Primary button and accent button

```css
.btn {
  font: var(--mon-font-weight-semibold) var(--mon-font-size-sm)/var(--mon-line-height-normal) var(--mon-font-sans);
  letter-spacing: var(--mon-letter-spacing-wide);
  padding: var(--mon-space-2) var(--mon-space-4);
  border-radius: var(--mon-radius-md);
  border: 1px solid transparent;
}
.btn-primary { background: var(--mon-color-action-primary-bg); color: var(--mon-color-action-primary-text); }
.btn-primary:hover { background: var(--mon-color-action-primary-bg-hover); }
.btn-accent  { background: var(--mon-color-action-accent-bg); color: #fff; }
.btn:focus-visible { outline: none; box-shadow: var(--mon-shadow-focus); }
```

### Card and status badge

```css
.card {
  background: var(--mon-color-bg-surface);
  border: 1px solid var(--mon-color-border-default);
  border-radius: var(--mon-radius-lg);
  padding: var(--mon-space-4);
}
.badge-overdue {
  background: var(--mon-color-status-error-bg);
  color: var(--mon-color-status-error-text);
  font: var(--mon-font-weight-medium) var(--mon-font-size-xs)/1 var(--mon-font-sans);
  padding: var(--mon-space-1) var(--mon-space-2);
  border-radius: var(--mon-radius-xs);
}
.amount { font-variant-numeric: tabular-nums; text-align: right; }
```

### Responsive layout

```css
.page { padding-inline: var(--mon-space-4); }
@media (min-width: 768px)  { .page { padding-inline: var(--mon-space-6); } }
@media (min-width: 1024px) { .page { padding-inline: var(--mon-space-10); } .sidebar { display: block; } }
```

### In Figma

- A button is a component with fill bound to `color/action/primary/bg`, text style `ui.label`, corner radius bound to `radius/md`, padding bound to `space/2` and `space/4`. Switching the frame to the Dark mode flips every bound variable with no manual edits.
- A card uses fill `color/bg/surface`, stroke `color/border/default`, radius `radius/lg`, and padding `space/4`.

## 10. Governance checklist

- Never hardcode a hex, pixel, or font value in a component. If a needed value has no token, propose a new semantic token first.
- New primitives require a documented reason; new semantic tokens require a light and a dark value.
- Run a contrast check on every new color pair before it ships.
- Version tokens with semver: removing or renaming a token is a major release, adding is minor, changing a value is a patch.
- Keep this doc as the source of truth and update it by targeted edits rather than regenerating it.
