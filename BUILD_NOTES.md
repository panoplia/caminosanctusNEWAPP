# Build Notes — Camino Sanctus

## ⚠️ WARNING: NEVER SHIP A DEV BUILD TO REAL USERS

The current build (`development` profile) is for internal testing only.

**Why it's dangerous to ship:**
- Code is NOT obfuscated — source is readable by anyone
- Debug mode is ON — internal logs and error overlays are exposed
- Code is NOT minified — full source included in the binary
- Signed with a debug keystore — not the real production key
- Expo Dev Client is bundled — exposes Metro bundler connection points
- ~100-150MB — unacceptable size for end users

---

## Checklist Before Shipping to Real Users

### 1. App Store Accounts
- [ ] Apple Developer Account ($99/year) — required for iOS App Store
- [ ] Google Play Developer Account ($25 one-time) — required for Play Store

### 2. App Configuration
- [ ] Final app icon (1024x1024 PNG, no transparency) for iOS
- [ ] Final splash screen
- [ ] Correct bundle ID / package name (`com.panoplia.caminosanctus.app`)
- [ ] Version number set correctly in `app.json`
- [ ] All environment variables set in EAS for the `production` environment
- [ ] No hardcoded secrets or debug flags in code

### 3. Signing
- [ ] iOS: Distribution certificate + provisioning profile (EAS handles this)
- [ ] Android: Production keystore generated and stored securely (EAS handles this)

### 4. Services
- [ ] RevenueCat (`react-native-purchases`) configured with production API keys
- [ ] Push notifications configured with production APNs/FCM credentials
- [ ] All backend URLs pointing to production (not localhost or staging)

### 5. Build the Production APK/AAB
```bash
# Android — produces .aab for Play Store
npx eas-cli build --platform android --profile production

# iOS — produces .ipa for App Store
npx eas-cli build --platform ios --profile production
```

### 6. Submit to Stores
```bash
# Android
npx eas-cli submit --platform android

# iOS
npx eas-cli submit --platform ios
```

---

## Build Profiles Summary

| Profile | Purpose | Size | Safe for users? |
|---|---|---|---|
| `development` | Internal dev/testing | ~150MB | ❌ NO |
| `preview` | Internal QA / stakeholder review | ~40MB | ⚠️ Limited |
| `production` | App stores | ~20-40MB | ✅ YES |
