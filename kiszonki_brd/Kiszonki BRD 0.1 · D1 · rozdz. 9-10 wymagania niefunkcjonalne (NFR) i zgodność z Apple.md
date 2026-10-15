# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D1: Wymagania niefunkcjonalne (NFR) i zgodność z Apple (Rozdz. 9–10)**

## **Rozdział 9: Wymagania niefunkcjonalne (NFR-001…NFR-115)**

Wymagania niefunkcjonalne stanowią twarde ograniczenia jakościowe dla całego systemu. Każde wymaganie podlega automatycznej weryfikacji w pipeline CI.

---

### **9.1 Offline i Niezależność Sieciowa (NFR-OFF-001…010)**
* **NFR-OFF-001:** 100% funkcjonalności aplikacji (kalkulatory solanek, monitor fermentacji, stoper pasteryzacji, baza naczyń, spis spiżarni, moduł diagnostyczny, eksport i import kopii zapasowej) działa bez aktywnego połączenia z siecią w trybie samolotowym.
* **NFR-OFF-002:** Aplikacja nie zawiera żadnych odwołań sieciowych (`fetch`, `XMLHttpRequest`, `axios`, `WebSocket`) do zewnętrznych serwerów w warstwie domenowej ani prezentacji.
* **NFR-OFF-003:** Baza danych SQLite jest inicjalizowana lokalnie w katalogu piaskownicy aplikacji (`NSDocumentDirectory`).
* **NFR-OFF-004:** Baza wiedzy (atlas kultur mikrobiologicznych, przepisy bazowe, drzewa diagnostyczne) jest w całości skompilowana w lokalnym bundle aplikacji i nie wymaga pobierania dodatkowych pakietów.
* **NFR-OFF-005:** Generowanie etykiet graficznych i kodów QR odbywa się w 100% na procesorze urządzenia bez odpytywania zewnętrznych API graficznych.
* **NFR-OFF-006…010:** Weryfikacja braku uprawnień sieciowych w `app.json` i `Info.plist`, odporność na błędy braku łączności w watchOS.

---

### **9.2 Dostępność i Ergonomia Kuchenna (NFR-DOST-001…015)**
* **NFR-DOST-001:** 100% elementów interaktywnych posiada pełne etykiety VoiceOver (`accessibilityLabel`, `accessibilityHint`, `accessibilityRole`).
* **NFR-DOST-002:** Minimalny cel dotykowy w widokach kuchennych (np. przycisk startu pasteryzacji, odhaczenie odgazowania) wynosi co najmniej $56 \times 56\,\text{pt}$ (zwiększony standard dla mokrych lub ubrudzonych palców).
* **NFR-DOST-003:** Dynamic Type: wszystkie teksty skalują się bez obcięć (Zero Truncation) od rozmiaru `xSmall` do największego rozmiaru dostępnościowego `AccessibilityXXL`.
* **NFR-DOST-004:** Kontrast barwny tekstu do tła spełnia kryteria WCAG 2.1 AAA: minimalny kontrast $7.0:1$ dla tekstu zwykłego i $4.5:1$ dla nagłówków.
* **NFR-DOST-005:** Żadna informacja o stanie mikrobiologicznym (np. strefa bezpieczeństwa pH) nie jest przekazywana wyłącznie za pomocą koloru — zawsze towarzyszy jej wyrazista ikona i jednoznaczny opis tekstowy.
* **NFR-DOST-006…015:** Dźwiękowe i haptyczne potwierdzenia dla osób niewidomych, obsługa zewnętrznych klawiatur Bluetooth i przełączników dostępnościowych iOS.

---

### **9.3 Lokalizacja i Wielojęzyczność (NFR-I18N-001…012)**
* **NFR-I18N-001:** Architektura i18n oparta na silniku lokalizacyjnym studia Apps4Brew z precyzyjnymi słownikami kluczy.
* **NFR-I18N-002:** Obsługa formatowania liczb, separatorów dziesiętnych (przecinek w PL vs kropka w US) oraz jednostek miar zgodnie z `Intl.NumberFormat`.
* **NFR-I18N-003:** Dynamiczne dopasowanie jednostek (metryczne: g, kg, ml, l, cm vs imperialne: oz, lb, fl oz, cal).
* **NFR-I18N-004…012:** Pokrycie testami 100% kluczy językowych, brak martwych kluczy w słownikach (`npm run check:i18n`).

---

### **9.4 Wydajność i Czas Reakcji (NFR-WYD-001…012)**
* **NFR-WYD-001:** Zimny start aplikacji (Cold Start) na urządzeniach od iPhone 11 w górę trwa poniżej $800\,\text{ms}$.
* **NFR-WYD-002:** Stabilne 60 FPS (i 120 FPS na ekranach ProMotion) podczas przewijania list w spiżarni z 500 słoikami.
* **NFR-WYD-003:** Synchroniczne przeliczanie formuł solanki i pasteryzacji w czasie $< 2\,\text{ms}$.
* **NFR-WYD-004…012:** Czas renderowania etykiety PNG $< 150\,\text{ms}$, limity zużycia pamięci RAM $< 90\,\text{MB}$.

---

### **9.5 Bezpieczeństwo i Prywatność (NFR-BEZP-001…018)**
* **NFR-BEZP-001:** Zero zbierania danych telemetrycznych i osobowych („Data Not Collected” w App Store Privacy Manifest).
* **NFR-BEZP-002:** Wszystkie zapytania SQL korzystają ze zmiennych wiązanych (`?`), eliminując 100% podatności na SQL Injection.
* **NFR-BEZP-003:** Wyłączona telemetria systemowa stron trzecich; brak Crashlytics czy SDK analitycznych.
* **NFR-BEZP-004…018:** Bezpieczne przechowywanie kopii zapasowej, brak ekspozycji identyfikatorów w logach.

---

### **9.6 Niezawodność i Integralność Danych (NFR-DANE-001…014)**
* **NFR-DANE-001:** Tryb SQLite WAL (`PRAGMA journal_mode = WAL;`) i pełna atomowość transakcji zapisu partii.
* **NFR-DANE-002:** Zero utraty danych przy nagłym ubiciu procesu w trakcie pasteryzacji.
* **NFR-DANE-003:** Automatyczna kopia zapasowa przed każdą migracją schematu bazy danych.
* **NFR-DANE-004…014:** Weryfikacja sum kontrolnych SHA-256 eksportowanego pliku JSON.

---

### **9.7 Interakcja i Zegarek watchOS (NFR-ZEG-001…012)**
* **NFR-ZEG-001:** Aplikacja watchOS działa w pełni autonomicznie bez konieczności ciągłego połączenia Bluetooth z telefonem.
* **NFR-ZEG-002:** Sterowanie cyfrową koronką (Digital Crown) z haptyczną informacją zwrotną co 1 minutę pasteryzacji.
* **NFR-ZEG-003…012:** Live Activity na ekranie blokady, obsługa Dynamic Island, automatyczne wznawianie stopera.

---

### **9.8 Rygor Testowy (NFR-TEST-001…014)**
* **NFR-TEST-001:** 100% pokrycia linii, gałęzi i funkcji w czystej logice domenowej `src/core/domain/`.
* **NFR-TEST-002:** Wskaźnik przeżywalności testów mutacyjnych Stryker poniżej 10% ($\ge 90\%$ zabitych mutantów).
* **NFR-TEST-003…014:** Testy property-based `fast-check`, testy odpornościowe transakcji, automatyczne scenariusze Maestro E2E.

---

## **Rozdział 10: Zgodność z wytycznymi Apple App Store Review Guidelines**

1. **Wytyczna 4.3(a) & 4.3(b) (Spam i brak unikalności):** Aplikacja broni się bogatym, unikalnym modułem laboratoryjnej fizykochemii (solanki masowe, penetracja ciepła, kinetyka fermentacji), natywną aplikacją na Apple Watch z cyfrową koronką, Live Activity oraz Szkołą Przetwórstwa. Nie jest prostym licznikiem ani generyczną książką kucharską.
2. **Wytyczna 5.1.1 (Prywatność i zbieranie danych):** Etykieta App Privacy zawiera wyłącznie status „Data Not Collected”. Brak profilowania, brak wymogu logowania.
3. **Wytyczna 3.1.2 (Subskrypcje i zakupy in-app):** Jasna prezentacja cen, przywracanie zakupów (Restore Purchases) widoczne na pierwszym planie, pełny opis korzyści wersji Pro.
4. **Wytyczna 1.4.1 (Bezpieczeństwo żywności i zdrowie):** Aplikacja zawiera wyraźny disclaimer prawny informujący, że stanowi narzędzie wspomagające, a odpowiedzialność za higienę surowców i bezpieczeństwo przetworów spoczywa na użytkowniku. Ostrzeżenia o botulizmie są zgodne z oficjalnymi wytycznymi agencji rządowych.

