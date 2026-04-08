# Seth Rininger Portfolio — Project Context

> **Purpose**: This file captures all decisions, constraints, architecture, and current state so any new session can pick up seamlessly. Last updated: April 8, 2026.

---

## Owner & Contact

- **Name**: Seth Rininger (goes by Seth)
- **Wife**: Brandi Rininger — eXp Realty broker in Western North Carolina
- **Email**: sethr@hey.com
- **LinkedIn**: https://www.linkedin.com/in/seth-rininger-004036a3/
- **Location**: Franklin, NC
- **Current Role**: Senior iOS Developer at CBS Sports / Paramount

---

## Domain & Hosting

- **Domain**: sethrininger.dev (purchased April 2026)
- **Git Repo**: git@github.com:Sethmr/sethrininger.git (origin remote, branch: main)
- **Hosting**: Static HTML/CSS/JS — intended for GitHub Pages (DNS configured, code not yet pushed)
- **Architecture**: No frameworks. Vanilla HTML, CSS, JS. Each page is self-contained with inline `<style>` blocks plus shared `assets/effects.js` and `assets/effects.css`.

---

## Site Structure

```
sethrininger.dev/
├── index.html          # Homepage — hero, services, testimonials, about, contact
├── ios.html            # iOS/Mobile dev — career timeline, tech stack, strengths
├── seo.html            # SEO services — process, 3 clients, services grid
├── ai.html             # AI research — multi-AI workflow, bed remote case study
├── gamedev.html        # Game dev — Manu Idle showcase with lightbox screenshots
├── video.html          # Video — Kyra's Corner, UnityNow!, Living In WNC, VidSummit
├── realestate.html     # Brandi Rininger's real estate page (eXp Realty)
├── 404.html            # Custom 404 with terminal humor
├── CNAME               # sethrininger.dev
├── sitemap.xml         # All 7 pages
├── robots.txt          # Allow all
├── favicon.ico         # 32px favicon
├── assets/
│   ├── effects.js      # Shared interactive effects (~14KB)
│   ├── effects.css     # Shared styles: nav, hamburger, glass, preloader, etc. (~8KB)
│   └── images/         # All images with WebP versions (see below)
```

---

## Navigation (all 7 pages)

Order: `Home | iOS Dev | SEO | AI Research | Game Dev | Video | Real Estate | [Let's Talk CTA]`

Each page has a `<nav>` with:
- `.nav-brand` — links to index.html
- `.nav-links` — the page links (hidden on mobile, shown via hamburger)
- `.nav-controls` — contains `.nav-cta` (Let's Talk), `.theme-toggle`, `.hamburger`

**IMPORTANT**: The nav `<nav>` element is set to `position: fixed` by effects.js (NOT CSS). The JS also inserts a spacer div to prevent content jumping. The original inline CSS says `position: sticky` but JS overrides it to `fixed` for reliable Safari transform behavior.

---

## Shared Assets Architecture

### effects.css — What It Controls

This file is the **single source of truth** for all cross-page behaviors. Each page's inline `<style>` handles page-specific layout only. effects.css provides:

1. **Skip-to-content link** — Accessibility, fixed top, z-index 200000
2. **Page preloader** — Full-screen overlay with character animation, `#page-preloader`
3. **Staggered text reveal** — `.text-reveal-word` / `.word-inner` with IntersectionObserver
4. **Noise/grain texture** — `body::after` pseudo-element, SVG noise filter
5. **Focus states** — `:focus-visible` with blue outline, `:focus:not(:focus-visible)` removes for mouse
6. **Nav CTA button** — `.nav-cta` with blue gradient, shared across all pages
7. **Hamburger icon + X animation** — FULLY centralized in effects.css. Per-page styles removed.
   - Base: `display: none; flex-direction: column; gap: 5px;` 3 spans × 22px × 2px
   - Spans use `background: currentColor` to inherit text color
   - Active X: `translateY(7px) rotate(45deg)` / `translateY(-7px) rotate(-45deg)`, middle fades + scales to 0
   - Each page's mobile media query just sets `.hamburger { display: flex; }`
8. **Smart navbar hide/show** — `nav.nav-hidden { transform: translateY(calc(-100% - 60px)) }` — the -60px overshoot ensures full clearance past iPhone safe area
9. **Mobile liquid glass nav** — `@media (max-width: 768px)`:
   - Nav background → transparent
   - `.nav-brand` and `.nav-controls` → frosted glass pills (40px height, `backdrop-filter: blur(20px) saturate(180%)`, `border-radius: 50px`)
   - Both pills locked to `height: 40px` with `display: flex; align-items: center` so they match
   - Light mode variants with white glass
   - Safe area handled via `padding-top: calc(0.75rem + env(safe-area-inset-top, 0px))`
10. **Back-to-top button** — Fixed bottom-right, appears after 500px scroll
11. **prefers-reduced-motion** — Disables all animations, transitions, hides cursor, preloader, etc.

**CRITICAL**: The mobile glass nav styles are ALSO duplicated in each page's inline `<style>` mobile media query. This was necessary because effects.css loads before the inline styles, and relying on `!important` from the external sheet was not reliably winning the cascade on all devices. Both locations must stay in sync.

### effects.js — What It Controls

IIFE structure with clear universal vs desktop-only split:

**Universal features** (run on ALL devices including mobile):
- `initSkipLink()` — Injects skip-to-content link
- `initSmartNav()` — Converts nav to position:fixed, adds spacer, handles scroll hide/show with requestAnimationFrame, 10px threshold, 20px top dead zone
- `initBackToTop()` — Injects back-to-top button, throttled scroll listener

**Desktop-only features** (guarded by `const hasFinePointer = window.matchMedia('(pointer: fine)').matches`):
- Custom cursor with lerp interpolation (`animateCursor` rAF loop)
- Magnetic buttons (0.3 strength pull)
- 3D card tilt (8° max, perspective 800px)
- Scroll progress indicator (2px gradient bar)
- Page preloader (reads `document.body.dataset.preloaderName` — defaults to "Seth Rininger", realestate.html uses "Brandi Rininger")
- Staggered text reveal on h1/h2

**Init flow**:
```javascript
// Universal: runs immediately or on DOMContentLoaded
initUniversalFeatures();

// Guard: if (!hasFinePointer) return;
// Desktop: initPreloader(), initTextReveal(), initMagnetic(), initTilt(), initScrollIndicator()
```

---

## Design System

### Colors
| Variable | Dark Mode | Light Mode |
|----------|-----------|------------|
| Background primary | #0a0a0a | #ffffff |
| Background secondary | #1a1a1a | #f5f5f5 / #f9f9f9 |
| Text primary | #e5e5e5 | #1a1a1a |
| Text secondary | #b0b0b0 | #666666 |
| Accent blue | #3b82f6 | #3b82f6 |
| Accent amber | #f59e0b | #f59e0b |
| Border | rgba(229,229,229,0.1) | rgba(0,0,0,0.1) |

### Typography
- **Body**: Inter (400, 500, 600, 700)
- **Headings**: Space Grotesk (400, 500, 600, 700), letter-spacing: -0.02em
- **Google Fonts import** on every page via `<link>` in `<head>`

### Glass Effect Values (mobile nav)
- Dark: `background: rgba(40, 40, 40, 0.55)`, `backdrop-filter: blur(20px) saturate(180%)`, `border: 1px solid rgba(255, 255, 255, 0.12)`
- Light: `background: rgba(255, 255, 255, 0.55)`, `border: 1px solid rgba(0, 0, 0, 0.08)`

---

## Per-Page Details

### index.html
- Hero with typing animation terminal effect (`--deploy production`)
- Stats bar: 12 Years iOS (animated counter), 5 AIs Used Daily, 3 Local Businesses Ranked, 1 Game Shipping
- Services grid: iOS dev, SEO, AI, Video/Content
- Credibility logos (styled text, not actual logos): CBS Sports, Vimvest, Monorail, eXp (Brandi)
- 3 testimonials from LinkedIn (Atharva Vats, Todd Clemens, Evan Williams)
- About section with muscle-up video and headshot
- Contact form (Formspree — placeholder endpoint, needs setup)
- `<body>` has no `data-preloader-name` (defaults to "Seth Rininger")

### ios.html
- Hero with "Writing Swift since the year it launched in 2014" subheading
- Career timeline: 6 entries (CBS Sports → EiValue) with app icons (`loading="lazy"`)
- 9-category tech stack in compact row layout
- 6 strength cards
- 3 Vimvest/Monorail embedded testimonials

### seo.html
- 3 SEO client cards: Palisade Roofing, Sol & Son Painting, Brandi Rininger — eXp Realty
- Metrics note: "All three clients are active engagements"
- Process timeline, services grid, AI advantage callout
- CSS variables: `--bg`, `--text` (slightly different naming from other pages)

### ai.html
- Multi-AI workflow section (Claude, ChatGPT, Grok, Gemini, Cursor, Copilot)
- Bed remote case study: before/after photos, OpenSCAD render, STL download
- Chronological image order: before → specs → OpenSCAD → after

### gamedev.html
- Manu Idle showcase with tappable screenshot lightbox
- Screenshots: iPhone, desktop (Mac), iPad — all tappable
- Lightbox: fullscreen on mobile (solid black, 100dvh), softer on desktop (rounded, semi-transparent bg)
- Lightbox JS targets `.screenshot-phone, .screenshot-desktop, .screenshot-tablet`
- First-party framework callout: SwiftUI, Combine, SwiftData, CloudKit

### video.html
- Kyra's Corner showcase: 30K+ subs, 97 videos, 12.6M views, full social links
- UnityNow! podcast section
- "Living In WNC" section (Brandi's real estate YouTube — less emphasized, between Personal Tribute Films and VidSummit)
- VidSummit research section with 4 group photos
- Video poster image `muscleup-poster.jpg` referenced but doesn't exist

### realestate.html
- **Dedicated page for Brandi Rininger**, written from Seth's perspective ("my wife")
- `<body data-preloader-name="Brandi Rininger">` for custom preloader
- Hero with Call/Text/Message CTAs (phone: 828-371-6980)
- Sections: Meet Brandi (Rookie of Year photo), Why Work With Brandi (4 cards), Areas We Serve (6 WNC area cards), Family First (2 family photos), Living In WNC (YouTube embed card), Contact
- Bio: decade as Publix customer service manager before real estate (NOT Keller Williams)
- Contact: phone-centric (no email), SMS form that sends formatted text via `sms:` URI with iOS/Android detection (`&` vs `?` separator)
- Schema.org RealEstateAgent structured data
- Website: https://brandirininger.exprealty.com
- Google Business Profile linked

### 404.html
- Terminal-themed humor
- `<meta name="robots" content="noindex">`
- Font preconnect directives

---

## Known CSS Inconsistencies

- Some pages use `--bg-primary` / `--bg-dark`, seo.html uses `--bg` / `--text`. Values are equivalent.
- Light mode toggle class is `body.light-mode` on all pages (standardized).
- Each page has its own inline `<style>` for layout. Cross-page behaviors (nav, hamburger, glass, preloader, back-to-top) are in effects.css but mobile glass nav is intentionally duplicated in inline styles too for cascade reliability.

---

## Critical Content Constraints

### DO NOT include
- **BetFusion 2.0** or any specific CBS Sports internal project names
- **Actual company logos** — Use styled text only (trademark concern)
- **Specific metrics for SEO clients** — All 3 are active with no permission to share metrics yet

### Content that IS approved
- Paraphrased qualities from CBS Sports internal review
- LinkedIn testimonials (Atharva Vats, Todd Clemens, Evan Williams)
- Kyra's Corner stats (30K+ subs, 97 videos, 12.6M views)
- Construction background ("over a decade of manual labor")
- Brandi's real estate info (phone, website, YouTube, GBP)

---

## Image Assets

All images have WebP versions. Use `<picture>` tags with WebP + original fallback. All non-hero images should have `loading="lazy"`.

| File | Description |
|------|-------------|
| Brandi_rookie-of-the-year.jpg/webp | Brandi's Rookie of Year award photo |
| Family.jpg/webp | Family photo (index.html about + realestate) |
| family2.jpg/webp | Second family photo (realestate) |
| manu-idle-icon.png/webp | Game app icon |
| manu-idle-iphone.png/webp | iPhone screenshot (woodcutting) |
| manu-idle-desktop.png/webp | Mac screenshot (combat UI) |
| manu-idle-ipad.png/webp | iPad screenshot |
| muscleup.mp4 | About section muscle-up video (no poster image) |
| og-preview.png | 1200x630 Open Graph social preview |
| remote-before.jpg/webp | AI case study: worn remote |
| remote-after.jpg/webp | AI case study: fixed remote |
| remote-specs.png/webp | AI case study: measurement diagram |
| openscad-render.png/webp | AI case study: 3D model |
| okin_rf365a_button_pad.stl | STL file (mentioned in text, not linked for download) |
| vidsummit-1 through 4.jpg/webp | VidSummit conference photos |
| *@3x.png/webp | iOS timeline app icons (CBS, Vimvest, Monorail, EiValue, ItWorks, ManuIdle, redswipe) |

**Deleted**: `ipad.png` (duplicate of manu-idle-ipad.png), `MyFace.jpg/webp` (unreferenced headshot)

---

## External Links (all verified)

### App Store
- CBS Sports: https://apps.apple.com/us/app/cbs-sports-app-scores-news/id307184892
- Monorail: https://apps.apple.com/us/app/monorail-americas-invest-app/id1253602285

### Social / Professional
- LinkedIn: https://www.linkedin.com/in/seth-rininger-004036a3/
- YouTube (Kyra's Corner): https://www.youtube.com/@KyrasCorner
- YouTube (Living In WNC): https://www.youtube.com/@LivingInWNC
- Brandi's website: https://brandirininger.exprealty.com
- Brandi's phone: 828-371-6980

### Projects
- Manu Games: https://manugames.com
- Palisade Roofing: https://palisaderoofingtn.com

---

## Pending / Future Work

- [ ] **Deploy to GitHub Pages** (DNS configured, code not pushed)
- [ ] **Set up Formspree endpoint** (user needs account, currently placeholder)
- [ ] **Mobile dropdown menu styling** — When hamburger opens `.nav-links.active`, each page has solid `background: var(--bg-dark)` for the dropdown. This has NOT been given a glass treatment to match the nav pills. May want to address.
- [ ] **STL download link** — `okin_rf365a_button_pad.stl` exists but is only mentioned in text on ai.html, not linked for download
- [ ] SEO page needs real metrics once client permission is granted
- [ ] Consider adding: Core ML, XCTest, Accessibility/VoiceOver, WidgetKit to tech stack
- [ ] User mentioned providing "fun photos" for About section later
- [ ] CSS variable naming still differs across pages (functional but inconsistent)
- [ ] Some images use direct `<img>` tags without `<picture>` WebP wrappers (app icons, some photos)

---

## Career & Experience Summary

| Company | Role | Duration | Key Details |
|---------|------|----------|-------------|
| CBS Sports / Paramount | Senior iOS Developer | Jun 2022–Present | Major sports app, SwiftUI leadership, GraphQL/Apollo |
| Vimvest → Monorail | Lead Front-End Dev (Mobile) | Jun 2017–Jun 2022 | First hire, 1000+ compile sources, app still live |
| It Works! Global | iOS Developer | Mar–Jun 2017 | Built "Wired" app |
| EiValue / Energy Sense Finance | Lead Mobile Dev & UI/UX Designer | Feb 2016–Feb 2017 | First end-to-end design, iOS + Android |
| Consulting | Freelance | 2016–2020 | Trilogy Education, Casanova, RedSwipe (Xamarin) |
| Manu Games LLC | Founder/Developer | ~2024–Present | Manu Idle game, iPhone/iPad/Mac |
| Kyra's Corner | Channel Manager/Editor | 3+ years | 30K+ YouTube subscribers, children's content |
| UnityNow! Podcast | Video Editor + Contributor | — | Weekly discussions, editorial decisions, live OBS |

### Education
- B.S. Computer Science, Freed-Hardeman University

### Personal
- Over a decade of manual labor before software (roofing, concrete, pipeline)
- Runs half marathons, does CrossFit, raises chickens in Franklin, NC
- Girl dad, wife Brandi is an eXp Realty broker in WNC
- Video production is passion-project only, not a consulting service

---

## Site Tone & Constraints

- Professional but millennial
- Interactive features (cursor, tilt, magnetic, preloader) — desktop only
- Not over-the-top self-promotion (user asked to tone down boastful language)
- Brandi's page written from Seth's perspective with genuine affection
- No email on Brandi's contact — phone and text only
