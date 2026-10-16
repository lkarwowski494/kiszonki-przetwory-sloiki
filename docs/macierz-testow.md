# Macierz Testów — Słoik (Jarwise)

*Automatycznie wygenerowano przez `scripts/test-matrix.mjs` — stan na: 2026-10-16*

| Kategoria | Element / Identyfikator | Źródło | Pokrycie testami | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EKRAN** | `/fermentacja` | `app/(tabs)/fermentacja.tsx` | `.maestro/03-fermentacja-timeline.yaml` | ✅ Pokryty |
| **EKRAN** | `/` | `app/(tabs)/index.tsx` | `.maestro/01-receptury.yaml`<br>`src/core/__tests__/brine-calculator.test.ts`<br>`src/core/__tests__/doctor-engine.test.ts`<br>`src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/label-generator.test.ts`<br>`src/core/__tests__/recipes-data.test.ts`<br>`src/core/__tests__/safety-guard.test.ts`<br>`src/data/__tests__/database.test.ts`<br>`src/ui/__tests__/interaction-guards.test.ts` | ✅ Pokryty |
| **EKRAN** | `/kreator` | `app/(tabs)/kreator.tsx` | `.maestro/02-kreator-solanki.yaml` | ✅ Pokryty |
| **EKRAN** | `/ratownik` | `app/(tabs)/ratownik.tsx` | `.maestro/05-ratownik-doktor.yaml` | ✅ Pokryty |
| **EKRAN** | `/spizarnia` | `app/(tabs)/spizarnia.tsx` | `.maestro/04-spizarnia-etykieta.yaml` | ✅ Pokryty |
| **EKRAN** | `/pasteurizer` | `app/pasteurizer.tsx` | `.maestro/06-pasteryzator-timer.yaml` | ✅ Pokryty |
| **EKRAN** | `/settings` | `app/settings.tsx` | `.maestro/01-receptury.yaml` | ✅ Pokryty |
| **LOGIKA** | `calculateBrine` | `src/core/brine/brine-calculator.ts` | `src/core/__tests__/brine-calculator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `evaluatePasteurizationSafety` | `src/core/safety/safety-guard.ts` | `src/core/__tests__/safety-guard.test.ts` | ✅ Pokryty |
| **LOGIKA** | `BOTULISM_PH_CRITICAL` | `src/core/safety/safety-guard.ts` | `src/core/__tests__/safety-guard.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getDiagnosis` | `src/core/doctor/doctor-engine.ts` | `src/core/__tests__/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `DOCTOR_DECISION_TREE` | `src/core/doctor/doctor-engine.ts` | `src/core/__tests__/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateFermentationTimeline` | `src/core/timeline/fermentation-timeline.ts` | `src/core/__tests__/fermentation-timeline.test.ts` | ✅ Pokryty |
| **LOGIKA** | `generateJarLabel` | `src/core/pantry/label-generator.ts` | `src/core/__tests__/label-generator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `MASTER_RECIPES` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getRecipeById` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getRecipesByCategory` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `LocalDatabaseStore` | `src/data/db/database.ts` | `src/data/__tests__/database.test.ts` | ✅ Pokryty |

### Podsumowanie pokrycia macierzy: **18 / 18 (100.0%)**

- **EKRANY:** 100% tras pokryte testami E2E Maestro lub testami integracyjnymi
- **LOGIKA:** 100% funkcji silnika przetwórczego, kalkulatorów i bazy pokryte testami jednostkowymi
