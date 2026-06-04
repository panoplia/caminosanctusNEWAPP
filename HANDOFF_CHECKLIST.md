# HANDOFF CHECKLIST — Camino Sanctus Prayer App
**Generated:** 2026-06-04  
**Status:** Autonomous build DONE (Tier A — bundle + tests green). Tier B/C require human action.

---

## TIER A — AUTONOMOUS DONE (all green ✓)
- [x] Phase 1: prayer-engine — 50 prayers generated, all closing lines present, crisis case (tc-036) verified, tsc clean, vitest 5/5
- [x] Phase 2: app shell — design system, domain, DB, services (mock), onboarding, prayer, feedback — tsc clean, vitest 15/15, expo export ✓
- [x] Phase 3: paywall, trial, plans, today, rhythm, edge fn (Deno) — tsc clean, vitest 37/37, expo export 3.8MB ✓
- [x] `prayer-app/HANDOFF_CHECKLIST.md` generated
- [x] PROGRESS LEDGER updated (§11)
- [x] Commits made after each phase

---

## CRITICAL — DO BEFORE ANYTHING ELSE

### 🔒 API KEY SECURITY
The original `prayer-engine/.env.example` had a REAL Anthropic API key committed to git history.
- **ACTION REQUIRED:** Revoke that key immediately at https://console.anthropic.com → API Keys
- Generate a new key and put ONLY in `prayer-engine/.env` (git-ignored)
- Rewrite git history to remove the old key (BFG Repo Cleaner or `git filter-branch`)
- The `.env.example` has been sanitized (placeholder only) in the current commit

---

## PHASE 1 — PRIEST REVIEW (prayer quality)

- [ ] **Priest reviews 10 prayers** in `prayer-engine/output/prayers-review.md` — confirm or revise `system.v1.md`
- [ ] Populate `prayer-engine/data/passages.seed.json` to ~500 grounded, tradition-tagged passages from:
  - Biblia de Jerusalén (catholic/shared) — PDFs in Proyecto-Panoplia/
  - Byzantine/Majority Text NT in Spanish (orthodox) — PDFs in corpus/
  - Mark all plans in `src/data/plans/index.ts` as `draft: false` after priest verification
- [ ] Verify safety behavior: `tc-036` (self-harm signal) — confirm output leads with human help, not prayer

---

## PHASE 2 — ACCOUNTS & INFRASTRUCTURE

### Supabase
- [ ] Create Supabase project (Pro plan — $25/mo; **free tier auto-pauses after 1 week**)
- [ ] Set `EXPO_PUBLIC_SUPABASE_URL` and anon key in `prayer-app/.env`
- [ ] Deploy Edge Function: `supabase functions deploy generate-prayer`
- [ ] Set `ANTHROPIC_API_KEY` as a Supabase function secret (NOT in client bundle): `supabase secrets set ANTHROPIC_API_KEY=<key>`
- [ ] Verify rate limits in edge function: 5/day free, 30/day paid (cost control)
- [ ] Enable Supabase Auth; wire `liveAuthService` in `src/services/auth/live.ts`

### RevenueCat
- [ ] Create RevenueCat account; add iOS + Android apps
- [ ] Create entitlement `premium`
- [ ] Create products: Monthly $4.99 + Annual $39.99 (both with **17-day intro offer**)
- [ ] **Enable Argentina local-currency pricing** (USD pricing is 5-10x too expensive at ARS rates)
- [ ] Implement Android grace periods + in-app payment-update prompt (32.2% of Play Store cancellations are billing errors)
- [ ] Wire RevenueCat SDK key in `src/services/subscription/live.ts`

### Almsgiving paywall copy
- [ ] The sponsorship line is commented out in `paywall.tsx` — **DO NOT uncomment until:**
  - RevenueCat gifted-subscription promo code pool is set up
  - 5% of net revenue monthly replenishment is operational
  - Each patron-access priest has 2 promo codes/month to distribute
  - Only then: uncomment lines 48-50 in `src/app/paywall.tsx`

---

## PHASE 3 — STORE NAME / BRAND COLLISION

- [ ] **Decide the store-name/brand question:** this prayer app and the KMP intercept app (`kmp-intercept-app/`) are both named "Camino Sanctus." They have different bundle IDs (`com.panoplia.caminosanctus.app` vs `com.panoplia.caminosanctus`) but identical store names will cause ASO and user confusion.
  - Option A: Keep both as "Camino Sanctus" — differentiate with subtitles ("Prayer Companion" vs "Digital Fast")
  - Option B: Rename this app (prayer app) to "Oratio" or another name per `ORATIO_MASTER_BRIEF.md` §0
  - Decide before App Store submission

---

## PHASE 4 — EAS DEV BUILD (Tier B: device render)

Per Appendix F of `CAMINO_SANCTUS_APP_BUILD_PLAN.md`:

```bash
# Run these manually (interactive, needs Expo account + cloud build time)
eas login
eas build --profile development --platform android   # builds cloud APK
# Install APK on Android device
npx expo start --dev-client                          # long-running: human
# -> VERIFY Tier B: screens render, navigation, mock prayer on device
```

- [ ] Create Expo account at https://expo.dev
- [ ] `eas login`
- [ ] `eas build --profile development --platform android`
- [ ] Install APK on Android device and verify screens render

---

## PHASE 5 — LIVE INTEGRATION (Tier C)

After Supabase + RevenueCat accounts and dev build:
- [ ] Set `EXPO_PUBLIC_APP_MODE=live` in `.env`
- [ ] Smoke-test: real prayer from Edge Function + RevenueCat sandbox purchase
- [ ] `eas build --profile preview --platform android` → internal APK
- [ ] iOS: `eas build --profile development --platform ios` (Expo handles signing in cloud — no Mac needed)

---

## PHASE 6 — STORE SUBMISSION

- [ ] Apple Developer account ($99/yr) — https://developer.apple.com
- [ ] Google Play developer account ($25) — https://play.google.com/console
- [ ] ASO keyword research (ASOMobile free tier): `oración personalizada`, `plan de oración diaria`, etc.
- [ ] Store screenshots showing **real prayer output** (not abstract imagery)
- [ ] `eas build --profile production --platform all`
- [ ] `eas submit -p android ; eas submit -p ios`
- [ ] OTA updates for copy fixes: `eas update`

---

## PHASE 7 — CONTENT (if building Cuaresma 2027 campaign)

- [ ] January 2027: priest outreach wave 2 (Cuaresma framing, patron access + promo codes)
- [ ] February 15: Begin Cuaresma content calendar on Panoplia (Temporal Bridge format)
- [ ] February 28: ASO subtitle update with Cuaresma/Lent keyword
- [ ] March 1-April 20: Push notification series (40 days, pre-written January)
- [ ] March 5: TikTok campaign launch ($5/day, Lenten creative)

---

## OPEN DEVIATIONS & NOTES

| Item | Note |
|---|---|
| API key in git history | `prayer-engine/.env.example` had key committed; sanitized now but history must be cleaned |
| Template components | Expo 56 default template files (animated-icon, app-tabs, etc.) left in place — remove before production if desired |
| Plans all `draft:true` | All 24 reading plans need priest verification of passage refs before marking `draft:false` |
| Rhythm exhaustion UX | `rhythm.tsx` shows rope visualization placeholder — per brief §3.3, final design is a human decision |
| Almsgiving paywall | Commented out — must not ship live without operational promo-code program |
| Node 24 / Expo 56 | Expo 56 on Node 24 — no hard failures encountered; `npx expo install --fix` available if needed later |

---

## RESOLVED DEPENDENCY VERSIONS (npm install results)

| Package | Version |
|---|---|
| expo | ~56.0.8 |
| expo-router | ~56.2.8 |
| expo-sqlite | ~56.0.4 |
| expo-blur | ~56.0.3 |
| @expo-google-fonts/cormorant | ^0.4.2 |
| @expo-google-fonts/inter | ^0.4.2 |
| react-native-purchases | ^10.2.1 |
| zustand | ^5.0.14 |
| @anthropic-ai/sdk (engine) | ^0.100.1 |
| dotenv (engine) | ^17.4.2 |
| vitest | ^4.1.8 |
| typescript | ~6.0.3 |
