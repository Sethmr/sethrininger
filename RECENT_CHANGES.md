# Recent Changes Log

> Detailed changelog of work done across sessions 4-6 (April 8, 2026). For earlier sessions (1-3), see git history.

---

## Session 6 — Cleanup, Review & Stats Update

### Experience Years Updated (10 → 12)
- Homepage stats bar: `data-target="12"` (was 10)
- Homepage credibility section: "12+" (was "10+"), label changed to "Years in Mobile Dev" (was "Years Experience")
- Homepage service card & meta descriptions: "12+ years"
- ios.html meta description & og:description: "12+ years"
- seo.html hero subtitle & body copy: "12+ years"
- All "10+" references eliminated across the entire site

### Unused Assets Deleted
- `ipad.png` — duplicate of `manu-idle-ipad.png` (was original upload before rename)
- `MyFace.jpg` + `MyFace.webp` — headshot never referenced in any HTML

### Broken Reference Fixed
- Removed `poster="assets/images/muscleup-poster.jpg"` from index.html video tag (file never existed)

### Hamburger Explicit Colors
- Changed hamburger span background from `currentColor` to explicit `#e5e5e5` (dark mode) / `#1a1a1a` (light mode) in effects.css
- Fixes inconsistent inheritance where some pages' nav didn't pass the right color down

### Mobile Hamburger Size Optimization
- Added mobile-specific overrides inside `@media (max-width: 768px)` in effects.css
- Reduced span width: 22px → 18px, gap: 5px → 4px, padding: 0.5rem → 0.25rem
- Updated mobile X animation: `translateY(6px)` (matches 4px gap math)
- Added `overflow: visible` to `.nav-controls` to prevent pill border-radius clipping
- Desktop keeps full-size 22px/5px/7px values

---

## Session 5 — Liquid Glass Nav & Hamburger Unification

### Mobile Liquid Glass Navigation
**Problem**: The solid nav background on mobile couldn't reliably extend into the iPhone status bar safe area. Multiple approaches failed (safe-area padding, JS probes, fixed background elements).

**Solution**: Abandoned solid nav background entirely. Replaced with two frosted glass pill-shaped bubbles — one for the brand name, one for the controls (theme toggle + hamburger).

**Implementation**:
- effects.css `@media (max-width: 768px)`: nav goes `background: transparent`, `.nav-brand` and `.nav-controls` get glass treatment (`backdrop-filter: blur(20px) saturate(180%)`, `rgba(40, 40, 40, 0.55)`, `border-radius: 50px`)
- Both pills locked to `height: 40px` with `display: flex; align-items: center` for consistent sizing
- Light mode variants included
- `padding-top: calc(0.75rem + env(safe-area-inset-top, 0px))` pushes pills below status bar
- Glass styles duplicated in BOTH effects.css AND each page's inline `<style>` mobile media query (cascade reliability)

### Nav Hide Animation Fix
- Restored `translateY(calc(-100% - 60px))` for `.nav-hidden` — the 60px overshoot is needed to fully clear iPhone safe area + glass bubbles
- This was previously reverted to `translateY(-100%)` which left bubbles visible

### Hamburger Centralization
**Problem**: Hamburger base styles and X animation were scattered across 7 pages with inconsistencies (different widths: 22px vs 24px, different transforms: `translateY(10px)` vs `translate(8px, 8px)`, 4 pages had NO active animation at all).

**Solution**: Moved everything to effects.css as single source of truth.
- Removed ALL per-page `.hamburger { }` and `.hamburger span { }` definitions
- Removed ALL per-page `.hamburger.active span:nth-child(N)` rules
- effects.css now defines: base hamburger layout, span styling (`background: currentColor`), and the X animation
- Each page only needs `.hamburger { display: flex; }` in its mobile media query
- X animation: `translateY(7px) rotate(45deg)` / `translateY(-7px) rotate(-45deg)` — mathematically correct for 2px spans + 5px gap (7px center-to-center distance)

### Removed Code
- `.status-bar-bg` CSS class and `initStatusBarBg()` JS function (didn't work)
- JS safe area probe code and padding manipulation (didn't work)
- All per-page hamburger base styles and X animations

---

## Session 4 — Real Estate Page, SEO Client, Audit & Nav Fixes

### New: realestate.html
- Full dedicated page for Brandi Rininger (Seth's wife), eXp Realty broker
- Written from Seth's perspective with professional affection
- `<body data-preloader-name="Brandi Rininger">` for custom preloader text
- Sections: Hero (Call/Text/Message CTAs), Meet Brandi, Why Work With Brandi, Areas We Serve, Family First, Living In WNC, Contact
- Phone-centric contact (no email): 828-371-6980
- SMS contact form using `sms:` URI with iOS/Android detection
- Schema.org RealEstateAgent structured data
- Bio: decade as Publix customer service manager (NOT Keller Williams — user corrected this)

### Brandi Added as SEO Client
- seo.html: Added "Brandi Rininger — eXp Realty" as third client card
- index.html: Updated "Local Businesses Ranked" stat from 2 → 3
- index.html: Added eXp to credibility logos
- seo.html: Updated metrics note from "Both" to "All three"

### Game Dev Lightbox
- Made game screenshots tappable with fullscreen lightbox overlay
- iPhone, desktop, and iPad screenshots all tappable
- Mobile: true fullscreen (solid black bg, 100dvh, no border-radius)
- Desktop: softer (rounded corners, semi-transparent dark bg)

### iPad Screenshot Added
- Converted uploaded iPad image to WebP
- Added to gamedev.html screenshot stack below desktop image
- Added `.screenshot-tablet` to lightbox JS selector

### Smart Nav Fixes (extensive debugging)
- **Root cause 1**: `if (!hasFinePointer) return;` on line 18 of effects.js IIFE skipped ALL code on touch devices. Fixed by restructuring: universal features init before the guard.
- **Root cause 2**: `position: sticky` + `transform: translateY(-100%)` doesn't work reliably in Safari. Fixed by switching to `position: fixed` via JS with spacer div.
- **Root cause 3**: `translateY(-100%)` wasn't enough to clear iPhone safe area. Fixed with `translateY(calc(-100% - 60px))` hardcoded overshoot.
- **Hamburger missing on gamedev.html**: CSS source-order bug — base `.hamburger { display: none }` at line 634 appeared AFTER mobile media query at line 135. Fixed by reordering.
- **Custom cursor appearing on mobile**: When effects.js was restructured, cursor code ran on all devices. Fixed by wrapping in `if (hasFinePointer) { }`.

### "Living In WNC" Added to Video Page
- New section between Personal Tribute Films and VidSummit
- Links to Brandi's @LivingInWNC YouTube channel
- Less emphasized than main content sections

### Content Fixes
- "in every decision" (was "and every decision") in video.html
- "Apple's language Swift" (was "Apple's langue Swift") in index.html and ios.html
- ios.html hero: "Writing Swift since the year it launched in 2014"
- ios.html: Added `loading="lazy"` to all 7 timeline app icons
- Brandi bio: "decade as customer service manager at Publix" (was incorrectly "four years at Keller Williams")

### Navigation Updates
- Added "Real Estate" link to nav on all pages (after Video)
- Extracted inline "Let's Talk" button styles to shared `.nav-cta` class in effects.css

### SEO Audit Fixes
- 404.html: Added `<meta name="robots" content="noindex">` and font preconnect
- Verified all images have WebP versions with `<picture>` tags

---

## Bugs Fixed & Lessons Learned

### iPhone Safe Area (recurring pain point)
Multiple approaches tried and failed:
1. `translateY(calc(-100% - 2px))` — insufficient
2. `translateY(calc(-100% - env(safe-area-inset-top)))` — env() didn't resolve in transform
3. `padding-top: calc(1rem + env(safe-area-inset-top))` on nav — didn't work
4. JS probe via element with `height: env(...)` — didn't measure correctly
5. JS `getComputedStyle().paddingTop` — still didn't work
6. Permanent `.status-bar-bg` fixed element — user said "that didn't work and I don't care"

**What worked**: Hardcoded -60px overshoot + transparent nav with glass pills (eliminates the safe area background problem entirely).

### CSS Cascade with External vs Inline Styles
effects.css loads before each page's inline `<style>`. Even with `!important`, shorthand vs longhand property interactions (`background` vs `background-color`) can be unreliable across browsers. **Solution**: Duplicate critical mobile overrides in both effects.css AND inline styles.

### effects.js IIFE Structure
The entire file is wrapped in an IIFE. The `hasFinePointer` guard originally blocked all code on mobile. **Lesson**: Universal features must init before any pointer-type guard. Desktop-only features go after the guard with explicit `if (!hasFinePointer) return;`.

### Hamburger CSS Source Order
With same specificity, later declarations win. If base styles (`.hamburger { display: none }`) appear after mobile media queries, the `display: none` overrides `display: flex`. **Solution**: Centralize in effects.css to eliminate ordering issues entirely.
