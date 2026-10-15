# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3c: Etapy wdrożenia, nakład pracy i warianty (Rozdz. 6.3–6.5)**

## **6.3 Szczegółowy harmonogram etapów (Roadmapa wydań)**

Projekt prowadzony jest w rygorystycznym cyklu iteracyjnym studia Apps4Brew:

```text
[Faza 0: Fundamenty] ──> [Faza 1: MVP v1.0] ──> [Faza 2: Rozszerzenie v1.1] ──> [Faza 3: v1.2 & v2.0]
   - Baza SQLite DDL         - Rdzeń kalkulatorów     - Etykiety PDF Avery        - Wagi Bluetooth BLE
   - Czysta domena           - Monitor fermentacji    - Zaawansowany Brix/pH      - OCR refraktometru
   - 9 warstw testów         - Stoper pasteryzacji    - Kompensacja n.p.m.        - Moduł Koji i Miso
   - watchOS i LiveAct       - Baza 25 słoików        - 35 języków                - Społeczność lokalna
                             - Strażnik botulinowy
```

### **Faza 1: Wersja 1.0 (MVP) — Czas trwania: 3–4 tygodnie (28–38 dni roboczych agenta)**
* **Pakiet narzędziowy (MUST):**
  * Kalkulator solanek masowych ($M_{tot}$) i tradycyjnych zalewowych (% w wodzie).
  * Kalkulator solenia na sucho dla kapusty i kimchi.
  * Monitor partii z osiami czasu, fazami (Leuconostoc $\to$ L. plantarum) i alertami odgazowania.
  * Wielofazowy stoper pasteryzacji (kąpiel wodna, piekarnik z korektą, tyndalizacja 3x24h).
  * Samodzielny klient watchOS z cyfrową koronką i wibracją Taptic Engine.
  * Widget Live Activity na ekranie blokady iPhone'a i w Dynamic Island.
  * Baza 25 popularnych słoików (Weck, Twist-Off, Mason, Kamionka) i kalkulator Headspace.
  * Cyfrowa spiżarnia do 5 aktywnych partii w wersji bezpłatnej z szybkim przyciskiem „-1 słoik”.
  * Generator etykiet graficznych PNG w wysokiej rozdzielczości (300 DPI) z kodami QR.
  * Twardy strażnik biologiczny blokujący pasteryzację wodną dla $pH \ge 4.60$.
  * Troubleshooting Doctor: 25 najczęstszych problemów (w tym różnicowanie Kahm vs pleśń).
  * 100% Offline-First SQLite z transakcjami WAL i darmowym eksportem/importem JSON.

### **Faza 2: Wersja 1.1 — Czas trwania: 2–3 tygodnie po debiucie MVP**
* Nielimitowana spiżarnia wersji Pro z obsługą wielu lokalizacji (piwnica, szafki, lodówka).
* Generator wektorowych arkuszy etykiet samoprzylepnych w formacie PDF (standardy Avery A4).
* Kompensacja wysokości n.p.m. w kalkulatorze pasteryzacji.
* Pasteryzacja precyzyjna sous-vide z kontrolą wartości $P_0$.
* Rozszerzenie bazy tradycji kulinarnych do 150 przepisów z całego świata.
* Wskaźnik rotacji zapasów FIFO.
* Dostępność we wszystkich 35 językach studia Apps4Brew.

### **Faza 3: Wersja 1.2 i 2.0 — Przyszłość projektu**
* Integracja z inteligentnymi wagami kuchennymi Bluetooth (BLE).
* Fotograficzny asystent rozpoznawania skali refraktometru i pasków pH na urządzeniu.
* Moduł fermentacji enzymatycznej koji, amazake i garum w stałej temperaturze komory.
* Obsługa tagów NFC naklejanych na wieczka wielorazowe.

---

## **6.4 Struktura podziału pracy (Work Breakdown Structure — WBS)**

Poniższa tabela przedstawia nakład pracy agentów z podziałem na specjalizacje zgodnie z systemem ról `.claude/agents/`:

| Rola agenta | Zadania i odpowiedzialność | Dni robocze (Wariant b+ Rekomendowany) |
| :--- | :--- | :--- |
| **Architekt & Inżynier Core** | Czysta domena TypeScript (wzory solanek, kinetyka pasteryzacji, równowaga osmotyczna), schemat SQLite DDL, transakcje WAL, migracje `migrate()`, mechanizm kopii zapasowej JSON. | 8 dni roboczych |
| **Programista UI (Expo/React Native)** | 5 głównych zakładek aplikacji, komponenty suwaków, model geometrii słoika, oś czasu fermentacji, generator etykiet graficznych PNG. | 8 dni roboczych |
| **Inżynier watchOS & System Bridges** | Natywny klient Apple Watch w SwiftUI, integracja cyfrowej koronki, Live Activity, powiadomienia krytyczne, most `WatchConnectivity`. | 4 dni robocze |
| **Badacz Merytoryczny (Food Science)** | Opracowanie bazy 25 kultur mikrobiologicznych, 11 tradycji świata, drzewa decyzyjnego 40 węzłów Troubleshooting, weryfikacja wektorów testowych RD-01..55. | 5 dni roboczych |
| **Inżynier Jakości (QA & Automation)** | Implementacja 9 warstw weryfikacji jakości: 100% testów jednostkowych, testy mutacyjne Stryker $\ge 90\%$, testy property-based fast-check, scenariusze E2E Maestro, testy strażników architektury. | 5 dni roboczych |
| **Tłumacz & Lokalizator** | Kompleksowe tłumaczenie i weryfikacja terminologiczna w języku polskim i angielskim, kontrola spójności kluczy i18n (`check:i18n`). | 2 dni robocze |
| **Koordynator & Audytor Wydań** | Audyt bezpieczeństwa, weryfikacja zgodności z Apple App Store Guidelines, konfiguracja pipeline GitHub Actions (`ci.yml`, `testflight.yml`). | 3 dni robocze |
| **RAZEM** | **Pełna realizacja wariantu rekomendowanego (b+)** | **35 dni roboczych agenta** |

*Uwaga: W środowisku wieloagentowym studia Apps4Brew (równoległa praca 2–3 agentów) rzeczywisty czas kalendarzowy wynosi **3 do 4 tygodni**.*

---

## **6.5 Bramki jakościowe i kryteria przejścia (Milestone Gates)**

Każdy etap wdrożenia podlega rygorystycznemu odbiorowi technicznemu przed przejściem do kolejnej fazy:
1. **Bramka 1 (Core Domain Frozen):** 100% pokrycia linii i gałęzi w `src/core/domain/`, 0 błędów TypeScript (`npx tsc --noEmit`), testy mutacyjne Stryker $\ge 90\%$.
2. **Bramka 2 (Data Layer Certified):** Testy atomowości SQLite, brak wycieków pamięci w trybie WAL, weryfikacja roundtrip eksportu i importu kopii JSON.
3. **Bramka 3 (Kitchen UI & Accessibility):** Kontrola celów dotykowych $\ge 56\,\text{pt}$, test ścieżki VoiceOver, brak ucinania tekstu w Dynamic Type AX.
4. **Bramka 4 (Watch & Native Verified):** Test stopera na symulatorze watchOS, sprawdzenie działania Live Activity w tle.
5. **Bramka 5 (Sanitary Audit):** Niezależna weryfikacja wszystkich formuł kwasowości i pasteryzacji z korpusem referencyjnym USDA.
6. **Bramka 6 (Release Readiness):** Przejście wszystkich scenariuszy Maestro E2E, zielony pipeline CI, wygenerowany Privacy Manifest z odznaką „Data Not Collected”.

