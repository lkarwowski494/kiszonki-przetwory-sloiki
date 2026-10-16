# Macierz Testów — Słoik (Jarwise)

*Automatycznie wygenerowano przez `scripts/test-matrix.mjs` — stan na: 2026-10-16*

| Kategoria | Element / Identyfikator | Źródło | Pokrycie testami | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EKRAN** | `/fermentacja` | `app/(tabs)/fermentacja.tsx` | `.maestro/03-fermentacja-timeline.yaml` | ✅ Pokryty |
| **EKRAN** | `/` | `app/(tabs)/index.tsx` | `.maestro/01-receptury.yaml`<br>`src/core/__tests__/app-access.test.ts`<br>`src/core/__tests__/audio-accessibility.test.ts`<br>`src/core/__tests__/brine-calculator.test.ts`<br>`src/core/__tests__/corpus-brine-topup.test.ts`<br>`src/core/__tests__/corpus-fermentation-kinetics.test.ts`<br>`src/core/__tests__/corpus-recipe-scaling.test.ts`<br>`src/core/__tests__/corpus-safety-usda.test.ts`<br>`src/core/__tests__/corpus-sensory-radar.test.ts`<br>`src/core/__tests__/corpus-unit-converter.test.ts`<br>`src/core/__tests__/cost-calculator.test.ts`<br>`src/core/__tests__/doctor-engine.test.ts`<br>`src/core/__tests__/emergency-recovery.test.ts`<br>`src/core/__tests__/experiments.test.ts`<br>`src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/label-generator.test.ts`<br>`src/core/__tests__/notifications-pdf.test.ts`<br>`src/core/__tests__/recipes-data.test.ts`<br>`src/core/__tests__/safety-guard.test.ts`<br>`src/core/__tests__/sensory-radar.test.ts`<br>`src/core/__tests__/unit-converter.test.ts`<br>`src/data/__tests__/database.test.ts`<br>`src/lib/__tests__/backup.test.ts`<br>`src/ui/__tests__/interaction-guards.test.ts` | ✅ Pokryty |
| **EKRAN** | `/kreator` | `app/(tabs)/kreator.tsx` | `.maestro/02-kreator-solanki.yaml` | ✅ Pokryty |
| **EKRAN** | `/ratownik` | `app/(tabs)/ratownik.tsx` | `.maestro/05-ratownik-doktor.yaml` | ✅ Pokryty |
| **EKRAN** | `/spizarnia` | `app/(tabs)/spizarnia.tsx` | `.maestro/04-spizarnia-etykieta.yaml` | ✅ Pokryty |
| **EKRAN** | `/experiments` | `app/experiments.tsx` | `.maestro/07-laboratorium-eksperymentow.yaml`<br>`src/core/__tests__/experiments.test.ts` | ✅ Pokryty |
| **EKRAN** | `/pasteurizer` | `app/pasteurizer.tsx` | `.maestro/06-pasteryzator-timer.yaml` | ✅ Pokryty |
| **EKRAN** | `/settings` | `app/settings.tsx` | `.maestro/01-receptury.yaml`<br>`src/core/__tests__/app-access.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateBrine` | `src/core/brine/brine-calculator.ts` | `src/core/__tests__/brine-calculator.test.ts`<br>`src/core/__tests__/corpus-brine-topup.test.ts`<br>`src/core/__tests__/corpus-recipe-scaling.test.ts`<br>`src/core/__tests__/emergency-recovery.test.ts`<br>`src/core/__tests__/invariants.test.ts` | ✅ Pokryty |
| **LOGIKA** | `evaluatePasteurizationSafety` | `src/core/safety/safety-guard.ts` | `src/core/__tests__/corpus-safety-usda.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/safety-guard.test.ts` | ✅ Pokryty |
| **LOGIKA** | `BOTULISM_PH_CRITICAL` | `src/core/safety/safety-guard.ts` | `src/core/__tests__/corpus-safety-usda.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/safety-guard.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getDiagnosis` | `src/core/doctor/doctor-engine.ts` | `src/core/__tests__/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `DOCTOR_DECISION_TREE` | `src/core/doctor/doctor-engine.ts` | `src/core/__tests__/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateFermentationTimeline` | `src/core/timeline/fermentation-timeline.ts` | `src/core/__tests__/corpus-fermentation-kinetics.test.ts`<br>`src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `generateJarLabel` | `src/core/pantry/label-generator.ts` | `src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/label-generator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `MASTER_RECIPES` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/corpus-fermentation-kinetics.test.ts`<br>`src/core/__tests__/corpus-recipe-scaling.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/notifications-pdf.test.ts`<br>`src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getRecipeById` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getRecipesByCategory` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `LocalDatabaseStore` | `src/data/db/database.ts` | `src/data/__tests__/database.test.ts` | ✅ Pokryty |
| **LOGIKA** | `announcePasteurizationComplete` | `src/core/announce.ts` | `src/core/__tests__/audio-accessibility.test.ts` | ✅ Pokryty |
| **LOGIKA** | `confirmAction` | `src/core/confirm.ts` | `src/core/__tests__/audio-accessibility.test.ts` | ✅ Pokryty |
| **LOGIKA** | `notifyTimerFinished` | `src/core/timer-audio.ts` | `src/core/__tests__/audio-accessibility.test.ts` | ✅ Pokryty |
| **LOGIKA** | `scheduleFermentationAlerts` | `src/core/notifications/kitchen-notifications.ts` | `src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `generateA4SheetHtml` | `src/core/pantry/pdf-sheet-generator.ts` | `src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `exportLabelSheetAsPdf` | `src/core/pantry/pdf-sheet-generator.ts` | `src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `createSplitBatchExperiment` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateSensoryScore` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts` | ✅ Pokryty |
| **LOGIKA** | `rankVariants` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts` | ✅ Pokryty |
| **LOGIKA** | `promoteVariantToCustomRecipe` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateBrineTopUp` | `src/core/doctor/emergency-recovery.ts` | `src/core/__tests__/corpus-brine-topup.test.ts`<br>`src/core/__tests__/emergency-recovery.test.ts` | ✅ Pokryty |
| **LOGIKA** | `EMERGENCY_PROCEDURES` | `src/core/doctor/emergency-recovery.ts` | `src/core/__tests__/emergency-recovery.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateJarBatchCost` | `src/core/pantry/cost-calculator.ts` | `src/core/__tests__/cost-calculator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateRadarCoordinates` | `src/core/sensory-radar.ts` | `src/core/__tests__/corpus-sensory-radar.test.ts`<br>`src/core/__tests__/sensory-radar.test.ts` | ✅ Pokryty |
| **LOGIKA** | `celsiusToFahrenheit` | `src/core/unit-converter.ts` | `src/core/__tests__/corpus-unit-converter.test.ts`<br>`src/core/__tests__/unit-converter.test.ts` | ✅ Pokryty |
| **LOGIKA** | `formatProduceWeight` | `src/core/unit-converter.ts` | `src/core/__tests__/corpus-unit-converter.test.ts`<br>`src/core/__tests__/unit-converter.test.ts` | ✅ Pokryty |
| **LOGIKA** | `buildBackup` | `src/lib/backup.ts` | `src/lib/__tests__/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `exportPantryToCsv` | `src/lib/backup.ts` | `src/lib/__tests__/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `appAccessService` | `src/core/access/app-access.ts` | `src/core/__tests__/app-access.test.ts` | ✅ Pokryty |
| **LOGIKA** | `APPS4BREW_PLANS` | `src/core/access/app-access.ts` | `src/core/__tests__/app-access.test.ts` | ✅ Pokryty |

### Podsumowanie pokrycia macierzy: **39 / 39 (100.0%)**

- **EKRANY:** 100% tras pokryte testami E2E Maestro lub testami integracyjnymi
- **LOGIKA:** 100% funkcji silnika przetwórczego, kalkulatorów i bazy pokryte testami jednostkowymi
