# Macierz Testów — Słoik (Jarwise)

*Automatycznie wygenerowano przez `scripts/test-matrix.mjs` — stan na: 2026-10-17*

| Kategoria | Element / Identyfikator | Źródło | Pokrycie testami | Status |
| :--- | :--- | :--- | :--- | :---: |
| **EKRAN** | `/dojrzewalnia` | `app/(tabs)/dojrzewalnia.tsx` | `.maestro/03-fermentacja-timeline.yaml`<br>`.maestro/04-spizarnia-etykieta.yaml`<br>`.maestro/08-paszport-sloika.yaml`<br>`tests/screens.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/` | `app/(tabs)/index.tsx` | `.maestro/01-receptury.yaml`<br>`.maestro/02-kreator-solanki.yaml`<br>`.maestro/07-laboratorium-eksperymentow.yaml`<br>`src/core/__tests__/corpus-brine-topup.test.ts`<br>`src/core/__tests__/corpus-safety-usda.test.ts`<br>`src/core/__tests__/cost-calculator.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/notifications-pdf.test.ts`<br>`src/lib/__tests__/backup.test.ts`<br>`tests/audit-fixes.test.tsx`<br>`tests/close-button-guard.test.tsx`<br>`tests/i18n-no-polish-in-en.test.tsx`<br>`tests/interaction-guards.test.ts`<br>`tests/maestro-runner.test.ts`<br>`tests/matrix-a11y.test.tsx`<br>`tests/public-repo.test.ts`<br>`tests/screens.test.tsx`<br>`tests/state-machine.prop.test.ts`<br>`tests/swipe-delete.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/wiedza` | `app/(tabs)/wiedza.tsx` | `.maestro/01-receptury.yaml`<br>`.maestro/05-ratownik-doktor.yaml`<br>`tests/screens.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/batch/[id]` | `app/batch/[id].tsx` | `.maestro/08-paszport-sloika.yaml` | ✅ Pokryty |
| **EKRAN** | `/experiments` | `app/experiments.tsx` | `.maestro/07-laboratorium-eksperymentow.yaml`<br>`tests/screens.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/pasteurizer` | `app/pasteurizer.tsx` | `.maestro/06-pasteryzator-timer.yaml`<br>`tests/maestro-runner.test.ts`<br>`tests/screens.test.tsx` | ✅ Pokryty |
| **EKRAN** | `/settings` | `app/settings.tsx` | `.maestro/01-receptury.yaml`<br>`src/data/__tests__/database.test.ts`<br>`tests/screens.test.tsx` | ✅ Pokryty |
| **UI** | `ActiveFocusTimer` | `src/ui/components/ActiveFocusTimer.tsx` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **UI** | `NumInput` | `src/ui/components/NumInput.tsx` | `tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CraftHeader` | `node_modules/@apps4craft/ui` | `src/ui/__tests__/interaction-guards.test.ts`<br>`tests/close-button-guard.test.tsx` | ✅ Pokryty |
| **UI** | `CraftModal` | `node_modules/@apps4craft/ui` | `src/ui/__tests__/interaction-guards.test.ts`<br>`tests/close-button-guard.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CraftButton` | `node_modules/@apps4craft/ui` | `src/ui/__tests__/interaction-guards.test.ts`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CraftCard` | `node_modules/@apps4craft/ui` | `src/ui/__tests__/interaction-guards.test.ts`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CraftStatDisplay` | `node_modules/@apps4craft/ui` | `src/ui/__tests__/interaction-guards.test.ts`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `SensoryRadarChart` | `src/ui/components/SensoryRadarChart.tsx` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **UI** | `Missing` | `src/ui/components/Missing.tsx` | `tests/audit-fixes.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `SearchField` | `src/ui/components/SearchField.tsx` | `tests/audit-fixes.test.tsx`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **UI** | `CustomRecipeModal` | `src/ui/components/CustomRecipeModal.tsx` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **UI** | `CustomEquipmentModal` | `src/ui/components/CustomEquipmentModal.tsx` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **TEKST** | `i18n-dictionary-pl` | `src/lib/i18n.ts` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **TEKST** | `i18n-dictionary-en` | `src/lib/i18n.en.ts` | `src/core/__tests__/corpus-safety-usda.test.ts`<br>`src/core/__tests__/doctor-engine.test.ts`<br>`src/core/__tests__/emergency-recovery.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/safety-guard.test.ts`<br>`src/core/__tests__/sensory-radar.test.ts`<br>`src/lib/__tests__/backup.test.ts`<br>`src/ui/__tests__/batch-passport.test.ts`<br>`tests/audit-fixes.test.tsx`<br>`tests/corpus-oracle.test.ts`<br>`tests/domain-coverage.test.ts`<br>`tests/i18n-no-polish-in-en.test.tsx`<br>`tests/matrix-a11y.test.tsx`<br>`tests/public-repo.test.ts`<br>`tests/state-machine.prop.test.ts` | ✅ Pokryty |
| **TEKST** | `i18n-no-polish-in-en` | `tests/i18n-no-polish-in-en.test.tsx` | `tests/i18n-no-polish-in-en.test.tsx` | ✅ Pokryty |
| **TEKST** | `check-i18n` | `scripts/check-i18n.mjs` | `tests/i18n-no-polish-in-en.test.tsx` | ✅ Pokryty |
| **LOGIKA** | `calculateBrine` | `src/core/brine/brine-calculator.ts` | `src/core/__tests__/brine-calculator.test.ts`<br>`src/core/__tests__/corpus-brine-topup.test.ts`<br>`src/core/__tests__/corpus-recipe-scaling.test.ts`<br>`src/core/__tests__/emergency-recovery.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`tests/corpus-oracle.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `evaluatePasteurizationSafety` | `src/core/safety/safety-guard.ts` | `src/core/__tests__/corpus-safety-usda.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/safety-guard.test.ts`<br>`src/ui/__tests__/batch-passport.test.ts`<br>`tests/corpus-oracle.test.ts` | ✅ Pokryty |
| **LOGIKA** | `BOTULISM_PH_CRITICAL` | `src/core/safety/safety-guard.ts` | `src/core/__tests__/corpus-safety-usda.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getDiagnosis` | `src/core/doctor/doctor-engine.ts` | `src/core/__tests__/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `DOCTOR_DECISION_TREE` | `src/core/doctor/doctor-engine.ts` | `src/core/__tests__/doctor-engine.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateFermentationTimeline` | `src/core/timeline/fermentation-timeline.ts` | `src/core/__tests__/corpus-fermentation-kinetics.test.ts`<br>`src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/notifications-pdf.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `generateJarLabel` | `src/core/pantry/label-generator.ts` | `src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/label-generator.test.ts` | ✅ Pokryty |
| **LOGIKA** | `MASTER_RECIPES` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/corpus-fermentation-kinetics.test.ts`<br>`src/core/__tests__/corpus-recipe-scaling.test.ts`<br>`src/core/__tests__/invariants.test.ts`<br>`src/core/__tests__/notifications-pdf.test.ts`<br>`src/core/__tests__/recipes-data.test.ts`<br>`tests/maestro-runner.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getRecipeById` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/fermentation-timeline.test.ts`<br>`src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `getRecipesByCategory` | `src/core/recipes/recipes-data.ts` | `src/core/__tests__/recipes-data.test.ts` | ✅ Pokryty |
| **LOGIKA** | `LocalDatabaseStore` | `src/data/db/database.ts` | `src/data/__tests__/database.test.ts`<br>`tests/audit-fixes.test.tsx`<br>`tests/state-machine.prop.test.ts` | ✅ Pokryty |
| **LOGIKA** | `announcePasteurizationComplete` | `src/core/announce.ts` | `src/core/__tests__/audio-accessibility.test.ts` | ✅ Pokryty |
| **LOGIKA** | `confirmAction` | `src/core/confirm.ts` | `src/core/__tests__/audio-accessibility.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `notifyTimerFinished` | `src/core/timer-audio.ts` | `src/core/__tests__/audio-accessibility.test.ts` | ✅ Pokryty |
| **LOGIKA** | `scheduleFermentationAlerts` | `src/core/notifications/kitchen-notifications.ts` | `src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `generateA4SheetHtml` | `src/core/pantry/pdf-sheet-generator.ts` | `src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `exportLabelSheetAsPdf` | `src/core/pantry/pdf-sheet-generator.ts` | `src/core/__tests__/notifications-pdf.test.ts` | ✅ Pokryty |
| **LOGIKA** | `createSplitBatchExperiment` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateSensoryScore` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `rankVariants` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `promoteVariantToCustomRecipe` | `src/core/experiments/experiment-engine.ts` | `src/core/__tests__/experiments.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateBrineTopUp` | `src/core/doctor/emergency-recovery.ts` | `src/core/__tests__/corpus-brine-topup.test.ts`<br>`src/core/__tests__/emergency-recovery.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `EMERGENCY_PROCEDURES` | `src/core/doctor/emergency-recovery.ts` | `src/core/__tests__/emergency-recovery.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateJarBatchCost` | `src/core/pantry/cost-calculator.ts` | `src/core/__tests__/cost-calculator.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateRadarCoordinates` | `src/core/sensory-radar.ts` | `src/core/__tests__/corpus-sensory-radar.test.ts`<br>`src/core/__tests__/sensory-radar.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `celsiusToFahrenheit` | `src/core/unit-converter.ts` | `src/core/__tests__/corpus-unit-converter.test.ts`<br>`src/core/__tests__/unit-converter.test.ts`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `formatProduceWeight` | `src/core/unit-converter.ts` | `src/core/__tests__/corpus-unit-converter.test.ts`<br>`src/core/__tests__/unit-converter.test.ts` | ✅ Pokryty |
| **LOGIKA** | `buildBackup` | `src/lib/backup.ts` | `src/lib/__tests__/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `exportBatchesToCsv` | `src/lib/backup.ts` | `src/lib/__tests__/backup.test.ts` | ✅ Pokryty |
| **LOGIKA** | `appAccessService` | `src/core/access/app-access.ts` | `src/core/__tests__/app-access.test.ts` | ✅ Pokryty |
| **LOGIKA** | `wInKeep` | `src/core/units/unit-keep.ts` | `tests/audit-fixes.test.tsx`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `normalizeNumString` | `src/core/units/unit-keep.ts` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **LOGIKA** | `startTimerTimestamp` | `src/core/timer/background-timer.ts` | `tests/audit-fixes.test.tsx`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `calculateRemainingTimerSec` | `src/core/timer/background-timer.ts` | `tests/audit-fixes.test.tsx`<br>`tests/domain-coverage.test.ts` | ✅ Pokryty |
| **LOGIKA** | `escapeCsvCell` | `src/lib/backup.ts` | `tests/audit-fixes.test.tsx` | ✅ Pokryty |
| **WYMIAR** | `min-touch-target-44pt` | `src/ui/theme.ts` | `src/ui/__tests__/interaction-guards.test.ts`<br>`tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **WYMIAR** | `screen-width-320pt` | `src/ui/theme.ts` | `tests/matrix-a11y.test.tsx` | ✅ Pokryty |
| **WYMIAR** | `wcag-contrast-aa` | `scripts/gen-theme-contrast-corpus.py` | `tests/corpus-oracle.test.ts` | ✅ Pokryty |
| **WYMIAR** | `voiceover-swipe-delete` | `tests/swipe-delete.test.tsx` | `tests/swipe-delete.test.tsx` | ✅ Pokryty |
| **WYMIAR** | `tabular-nums` | `src/ui/components/NumInput.tsx` | `tests/matrix-a11y.test.tsx` | ✅ Pokryty |

### Podsumowanie pokrycia macierzy: **63 / 63 (100.0%)**

- **EKRAN:** 100% tras pokryte testami E2E Maestro lub testami integracyjnymi
- **UI:** 100% komponentów i wzorców dotykowych pokryte testami RNTL
- **TEKST:** 100% słowników i higieny językowej zweryfikowane
- **LOGIKA:** 100% funkcji silnika przetwórczego, kalkulatorów i bazy pokryte testami jednostkowymi
- **WYMIAR:** 100% wymogów dostępności i wymiarów ekranu (44pt, 320pt, WCAG AA)
