# Camino Sanctus — Product & UX Notes
> Last updated: 2026-06-05 — Session 1 (first full test run)

---

## App Overview
Catholic/Orthodox prayer app. Users describe their burden → choose their tradition → receive a personalized prayer + Scripture foundation. Designed to feel calm, intimate, and spiritually serious.

---

## Screen-by-Screen Audit

### 1. `burden.tsx` — Onboarding Step 1
**What it does:** User types their burden/suffering in free text. Min 20 characters to continue.

**What's working ✅**
- Clean layout, warm parchment background
- Character counter ("16 caracteres más para continuar") is helpful
- Multiline input feels natural
- "Continuar" button correctly disabled until valid

**Issues / Improvements 🔧**
- No back button — if user lands here and already has a profile, no way out
- Keyboard toolbar (mic, emoji, etc.) overlaps the button on some devices — visible in screenshot
- No progress indicator (step 1 of 3) — user doesn't know how long onboarding is
- Placeholder "Escribe aquí…" is fine but could be more inviting

**UX Notes**
- The 20-char minimum is good friction — forces real reflection
- Consider: should the prompt be more specific? "¿Qué te pesa más hoy?" feels more immediate than the current longer question

---

### 2. `tradition.tsx` — Onboarding Step 2
**What it does:** User picks their tradition (Católico / Ortodoxo / Todavía lo estoy discerniendo).

**What's working ✅**
- Three clear options with subtitles
- Selected state visible (teal border/highlight)
- "Todavía lo estoy discerniendo" — smart inclusive option

**Issues / Improvements 🔧**
- No progress indicator
- "Registro neutro y pastoral" as subtitle for "discerniendo" — a bit clinical. Could be warmer.
- No Protestant option — intentional? Worth noting for future scope.

**UX Notes**
- Selection + button pattern feels right. Don't add auto-advance on select — too aggressive for a spiritual app.

---

### 3. `name.tsx` — Onboarding Step 3
**What it does:** User enters their name → triggers prayer generation → routes to prayer screen.

**What's working ✅**
- Single input, auto-focused
- "Generar mi oración" is a good CTA — feels personal

**Issues / Improvements 🔧**
- No progress indicator
- No back button visible in screenshots
- Floating menu button (hamburger) visible in one screenshot — unclear what it does or where it came from

**UX Notes**
- This is the moment of anticipation — user is about to receive their prayer. Consider a brief transition ("Preparando tu oración…") before loading.

---

### 4. `prayer.tsx` — Prayer Screen
**What it does:** Displays generated prayer, Bible passages (FUNDAMENTO BÍBLICO), priest pointer, and feedback buttons.

**What's working ✅**
- Prayer text renders beautifully in Cormorant font
- "FUNDAMENTO BÍBLICO" section with gold verse references — looks high quality
- Two curated verses per emotional state, with full text in italic
- Priest pointer ("Un sacerdote puede acompañarte…") — spiritually appropriate
- Feedback buttons (Me ayudó / No me ayudó) with correct highlight on selection
- 1.4s delay before routing to paywall — enough time to see selection

**Issues / Improvements 🔧**
- Prayer text was starting too close to top — fixed with `paddingTop: Spacing.xxxl`
- Bible passages not showing on paywall's "trial active" view — needs fix
- Priest pointer duplicating (showing twice) in some cases — partially fixed, needs recheck
- No way to share the prayer
- No way to save/bookmark a prayer
- Scroll can feel long — no visual anchor at bottom before feedback

**UX Notes**
- The Cormorant font for prayer text is excellent — feels like a missal
- Gold (`colors.candle`) for verse references is the right call
- "FUNDAMENTO BÍBLICO" label in all-caps small caps — clean and liturgical
- Consider adding a small cross or divider between prayer and passages

---

### 5. `paywall.tsx` — Paywall Screen
**What it does:** Shows partial prayer preview (blurred/cut), trial CTA, pricing options.

**What's working ✅**
- 21-day trial copy
- Habit science line: "Completa tu racha de 21 días y gana un mes gratis. La ciencia muestra que los hábitos comienzan a formarse en tan solo 21 días."
- "PRUEBA ACTIVA" badge after trial starts
- Correct routing to today screen after trial activation
- Pricing options visible (Mensual $4.99 / Anual $39.99)

**Issues / Improvements 🔧**
- Bible passages not showing in the trial-active view (shows prayer body but skips passages)
- Priest pointer shows in trial-active view but passages don't — inconsistent
- Blur effect over prayer is not a real blur — it's a solid parchment overlay. Should be a proper blur veil to tease the content better
- "Restaurar compra" link at bottom — functional placeholder but not wired to real RevenueCat
- Pricing buttons (Mensual / Anual) don't do anything yet
- No terms of service / privacy policy link — required for App Store approval

**UX Notes**
- The partial preview concept is good but the solid overlay feels like a hard wall. A real blur (expo-blur) would feel more premium.
- "Esta oración fue escrita para ti." — strong copy, keep it.
- 21-day trial is a strong differentiator. Keep the streak-reward mechanic.

---

### 6. `today.tsx` — Home / Today Screen
**What it does:** Main app dashboard — personalized greeting, daily reading, check-in CTA, primary actions.

**What's working ✅**
- Personalized greeting with name and date (e.g., "Buen día, Marlon. viernes, 5 de junio")
- Daily reading card (Flp 4,6-7 with reflection line)
- "¿Cómo llegas hoy?" check-in prompt with "Orar →" link
- "Nueva oración" and "Ver mi ritmo" buttons
- Clean hierarchy and spacing

**Issues / Improvements 🔧**
- "Nueva oración" was showing cached prayer — fixed (now clears store before navigating)
- No navigation bar — getting back to this screen from other screens is unclear
- Gear icon (settings) does nothing — dead end
- "Día 1 de tu plan" counter — doesn't advance over time (plan day logic not wired to real dates)
- Reading card shows only a short reflection line — no way to tap and read full passage
- No pull-to-refresh or visual feedback when data loads

**UX Notes**
- Layout is clean. The warm card for the check-in with teal/candle accent is the right visual hierarchy.
- The reading card is underutilized — it should be tappable and open a full Scripture view
- Consider: show streak status on the home screen (not just in rhythm screen)

---

### 7. `checkin.tsx` — Daily Mood Check-In
**What it does:** 8-option mood grid. User selects how they're arriving today → routes to prayer.

**What's working ✅**
- 8 moods in a 2-column grid with emoji + label
- Selection state visible (teal border + background tint)
- "Orar desde aquí" disabled until selection — correct
- "Continuar sin responder" skip option

**Issues / Improvements 🔧**
- "Sequedad" (spiritual dryness) — unfamiliar to non-religious users. Consider adding subtitle: "Sin sentir nada"
- "Alegría" emoji is ✨ — works but a sun or smile might be more universally readable
- After selecting mood and routing to prayer — the prayer doesn't change based on mood yet (still uses onboarding's emotional state). Mood tag is saved to DB but not passed to the prayer generator.
- No confirmation of what mood was selected when prayer loads

**UX Notes**
- The grid layout is clean and scannable
- Emoji + label pairing works well — keeps it human, not clinical
- This screen is the core daily retention hook — it should feel frictionless and warm

---

### 8. `rhythm.tsx` — Streak / Rhythm Screen
**What it does:** Shows user's consistency streak using a rope metaphor with 4 states.

**What's working ✅**
- 4 rope states with labels and colors:
  - Woven (gold) — "Cuerda tejida — sin faltar"
  - Fraying (amber) — "Algunas hebras sueltas — sigue adelante"
  - Frayed (red-brown) — "Tensa pero entera — puede reanudarse"
  - Reset (green) — "Ventana nueva — todo puede retejerse"
- Grace days system (3 grace days before streak breaks)
- "La cuerda no se corta — puede retejerse siempre." — excellent copy

**Issues / Improvements 🔧**
- Visual is just a thin vertical bar (8px wide, 80px tall) — far too minimal. Needs a real rope illustration or richer graphic
- No calendar or day grid — user can't see which days they prayed
- No streak count displayed (e.g., "7 días seguidos")
- Grace days counter shows "3 de 3 días de gracia restantes" on day 1 — a bit confusing
- No connection to the 21-day trial / streak reward mechanic yet

**UX Notes**
- The rope metaphor is original and spiritually resonant — don't abandon it
- "Cuerda tejida" language is beautiful. Keep the poetic register throughout.
- This screen needs to be much richer visually — it's the retention / gamification layer
- Consider: a 21-day grid showing checked days, with the rope growing visually as it fills

---

## What's Good (Keep)
- **Design language** — parchment, ink, candle gold, Cormorant for prayer text. Feels premium and spiritual.
- **Copy/tone** — Spanish, intimate, non-clinical. "Cuerda tejida", "Esta oración fue escrita para ti" — excellent.
- **Rope metaphor** for streaks — original, memorable, spiritually grounded.
- **"Sequedad"** as a mood option — rare in apps, deeply valued by serious users.
- **FUNDAMENTO BÍBLICO** section — high perceived value for target audience.
- **Tradition-aware priest pointer** — Catholic vs. Orthodox vs. neither handled correctly.
- **21-day trial + streak reward** — strong psychological mechanic.
- **20-character minimum** on burden input — good friction for real reflection.

---

## What Needs to Change Before Shipping

### Critical (blockers)
- [ ] Real AI prayer generation (Supabase + Claude/OpenAI) — mock prayers have no value
- [ ] Real RevenueCat subscription (purchases don't work)
- [ ] Settings screen (gear icon is a dead end)
- [ ] Privacy policy + Terms of Service (required for App Store)
- [ ] Mood from check-in must influence prayer generation

### High Priority
- [ ] Prayer history screen — see all past prayers
- [ ] Full Scripture reader — tap a verse reference, read the full passage
- [ ] Real blur veil on paywall (use expo-blur, not solid overlay)
- [ ] 21-day streak calendar grid in rhythm screen
- [ ] Navigation between main screens (or at minimum a "back to home" flow)
- [ ] Push notifications wired up (daily prayer reminder)
- [ ] Passages showing in paywall trial-active view

### Medium Priority
- [ ] Progress indicator during onboarding (Step 1/3)
- [ ] "Sequedad" subtitle ("Sin sentir nada")
- [ ] Share prayer button
- [ ] Save/bookmark prayer
- [ ] Richer rope visual in rhythm screen
- [ ] Streak count visible on home screen
- [ ] Plan day counter advancing with real dates

### Low Priority / Nice to Have
- [ ] Transition animation before prayer loads ("Preparando tu oración…")
- [ ] Small cross/divider between prayer and FUNDAMENTO BÍBLICO
- [ ] Protestant tradition option (future scope)
- [ ] Guided reflection after prayer ("¿Qué resonó contigo hoy?")
- [ ] Multiple burdens per session

---

## Bugs Fixed This Session
| Bug | Fix |
|---|---|
| `eas-cli` in devDependencies caused EAS build failure | Removed from package.json |
| TypeScript 6.x / lockfile mismatch | Regenerated package-lock.json |
| `useAppStore` object selector causing infinite loop (Zustand v5) | Added `useShallow` in name.tsx, prayer.tsx, paywall.tsx |
| Prayer starting with "Gabriel," | Removed name prefix from mock template |
| Duplicate priest pointer text | Removed closing text from mock body |
| "Nueva oración" showing cached prayer | Clear store before navigating |
| Reload wiped store → "Faltan datos" crash | Hydrate store from SQLite on startup |
| `burdenText` not persisted | Added `burden_text` column to profile table |
| expo-sqlite web wasm error | Created metro.config.js with wasm support |
| iOS icon wrong path in app.json | Fixed to `./assets/images/icon.png` |
| Trial days hardcoded to 17 | Changed to `TRIAL_DAYS = 21` constant |

---

## Known Remaining Issues
| Issue | Screen | Priority |
|---|---|---|
| Bible passages not showing in paywall trial-active view | paywall.tsx | High |
| Priest pointer possibly still duplicating in some flows | prayer.tsx | Medium |
| Gear/settings icon does nothing | All screens | High |
| Mood tag from check-in not passed to prayer generation | checkin.tsx → prayer.tsx | High |
| Plan day not advancing with real dates | today.tsx | Medium |
| Rope visual too minimal | rhythm.tsx | Medium |

---

## Monetization Summary
- **Free:** Full onboarding, first prayer, curated Bible passages
- **21-day trial:** Full app access, daily prayers
- **Trial reward:** Complete 21-day streak → earn 1 free month
- **Paid ($4.99/mo or $39.99/yr):** All features
- **Premium-only (not yet built):** AI-selected Bible passages (vs. curated)

*Source for habit claim: Lally et al. (2010), University College London, European Journal of Social Psychology — habits take 18–254 days, average 66 days. "Comienzan a formarse en tan solo 21 días" is accurate.*
