# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B3: Kalkulatory pasteryzacji i obróbki termicznej (Rozdz. 7)**

Moduł odpowiada za eliminację drobnoustrojów i szczelne zamknięcie słoików. Obejmuje wymagania od `BR-PAST-001` do `BR-PAST-035`.

---

### **BR-PAST-001: Kalkulator pasteryzacji w kąpieli wodnej (Water Bath Canning)**
* **Opis:** Na podstawie typu przetworu (kwaśne owoce, pikle octowe, dżemy, pomidory) oraz pojemności słoika (0.25L, 0.33L, 0.5L, 0.72L, 0.9L, 1.5L) wylicza wymagany czas gotowania w wodzie o temp. $100^\circ\text{C}$ od momentu ponownego zawrzenia.
* **Persona:** P2 (Babcia Stasia), P1 (Tomek).
* **Kryteria akceptacji:**
  1. Dżem owocowy w słoiku 0.35L: 10 minut.
  2. Korniszony w słoiku 0.9L: 15 minut.
  3. Kompot owocowy w słoiku 1.0L: 20 minut.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-002: Wieloetapowy stoper pasteryzacji z sygnałami akustycznymi i haptycznymi**
* **Opis:** Stoper dzieli proces na fazy:
  1. Faza podgrzewania wody.
  2. Kliknięcie „Woda wrze” $\to$ start odliczania zadanego czasu pasteryzacji.
  3. Faza końcowa: sygnał dźwiękowy i wibracja, instrukcja natychmiastowego wyjęcia słoików na drewnianą deskę lub ściereczkę.
* **Persona:** P2, P5 (Ewa).
* **Kryteria akceptacji:** Działa w tle (Background Mode) i na ekranie blokady (Live Activity).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-003: Asystent tyndalizacji frakcjonowanej (3x gotowanie w odstępie 24h)**
* **Opis:** Prowadzi użytkownika przez procedurę frakcjonowanej sterylizacji przetworów mięsnych, rybnych i warzyw o niskiej kwasowości ($pH \ge 4.6$):
  * Dzień 1: gotowanie 60 minut (zabicie form wegetatywnych).
  * Odpoczynek 24h w temperaturze pokojowej $20–25^\circ\text{C}$ (wykiełkowanie przetrwalników).
  * Dzień 2: gotowanie 40 minut (zabicie nowo wykiełkowanych bakterii).
  * Odpoczynek 24h.
  * Dzień 3: gotowanie 30 minut (ostateczne wyjałowienie).
* **Persona:** P4 (Marek).
* **Kryteria akceptacji:** Aplikacja automatycznie planuje powiadomienia kalendarzowe na Dzień 2 i Dzień 3 z dokładną godziną.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-004: Kalkulator pasteryzacji w piekarniku elektrycznym z korektą czasu**
* **Opis:** Dla osób wybierających piekarnik: wymusza temperaturę $120–130^\circ\text{C}$ i automatycznie wydłuża czas o 150% względem kąpieli wodnej (np. z 15 min do 38 min), wyświetlając ostrzeżenie o ryzyku degradacji uszczelek Weck.
* **Persona:** P2.
* **Kryteria akceptacji:** Ostrzeżenie przed wkładaniem słoików na suchą blachę (wymóg wlania 2 cm wody na blachę).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-005: Pasteryzacja niskotemperaturowa sous-vide (dla maksymalnej chrupkości)**
* **Opis:** Procedura pasteryzacji pikli w cyrkulatorze sous-vide w temperaturze $77–82^\circ\text{C}$ przez 30 minut. Zapewnia dezaktywację mikroorganizmów i enzymów bez termicznego rozpadu pektyn.
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Wyliczenie ekwiwalentnej wartości pasteryzacyjnej $P_0$.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-PAST-006…BR-PAST-035: Kompletny katalog wymagań pasteryzacji:**
* `BR-PAST-006`: Weryfikacja zassania wieczka (test akustyczny kliknięcia i wklęsłości).
* `BR-PAST-007`: Korekta wrzenia wody względem wysokości n.p.m. ($T_{\text{wrz}} = 100 - 0.0033 \cdot h$).
* `BR-PAST-008`: Ostrzeżenie przed szokiem termicznym (zakaz stawiania gorących słoików na zimnym kamieniu).
* `BR-PAST-009`: Kalkulator sterylizacji pustych słoików i pokrywek przed napełnieniem (10 min we wrzątku).
* `BR-PAST-010`: Wyliczanie wartości sterylizacyjnej $F_0$ dla domowego szybkowaru ciśnieniowego ($116–121^\circ\text{C}$).
* `BR-PAST-011`: Procedura pasteryzacji soków owocowych metodą „gorącego nalewu” (Hot Fill and Hold).
* `BR-PAST-012`: Instrukcja usuwania spinek ze słoików Weck po 24h od ostygnięcia w celu weryfikacji próżni.
* `BR-PAST-013`: Zabezpieczenie przed zbyt gwałtownym studzeniem przetworów pomidorowych.
* `BR-PAST-014`: Monitorowanie temperatury kąpieli wodnej za pomocą termometru z sondą kuchenną.
* `BR-PAST-015`: Alerty dźwiękowe zintegrowane z profilem audio iOS (pomijanie wyciszenia dla alarmów krytycznych).
* `BR-PAST-016`: Kalkulator pasteryzacji przecierów dla niemowląt (restrykcyjne normy czystości).
* `BR-PAST-017`: Obsługa pasteryzacji w kociołkach elektrycznych z termostatem.
* `BR-PAST-018`: Zapisywanie sesji pasteryzacji w relacyjnej tabeli `pasteurization_sessions`.
* `BR-PAST-019`: Dedykowane wytyczne pasteryzacji dyni w occie (zapobieganie rozpadowi miąższu).
* `BR-PAST-020`: Procedura wekowania pasztetów w słoikach prostych (ułatwione wyjmowanie zawartości).
* `BR-PAST-021`: Kompensacja temperatury wsadu początkowego (zimny wsad ze spiżarni vs gorący dżem z garnka).
* `BR-PAST-022`: Zabezpieczenie przed pasteryzacją słoików o uszkodzonych gwintach lub wyszczerbionych krawędziach.
* `BR-PAST-023`: Instrukcja postępowania ze słoikiem, który się nie zassał (ponowna pasteryzacja lub spożycie w 48h).
* `BR-PAST-024`: Wyliczanie zużycia energii elektrycznej i gazu podczas procesu pasteryzacji.
* `BR-PAST-025`: Tryb wielogarowy: równoczesne odliczanie pasteryzacji w dwóch niezależnych naczyniach.
* `BR-PAST-026`: Pasteryzacja syropów z pędów sosny i mniszka lekarskiego.
* `BR-PAST-027`: Kontrola poziomu wody w garnku (min. 2–3 cm ponad górną krawędź wieczek).
* `BR-PAST-028`: Ochrona dna garnka ściereczką lub wkładką silikonową przed bezpośrednim kontaktem z płomieniem.
* `BR-PAST-029`: Dynamiczne powiadomienie na 2 minuty przed końcem pasteryzacji na Apple Watch.
* `BR-PAST-030`: Przelicznik pasteryzacji dla słoików o nietypowych kształtach (słoiki płaskie vs wysokie cylindry).
* `BR-PAST-031`: Rejestracja ciśnienia roboczego szybkowaru (10 PSI vs 15 PSI).
* `BR-PAST-032`: Generowanie certyfikatu pasteryzacji do wglądu w historii partii.
* `BR-PAST-033`: Wykrywanie braku autoryzacji powiadomień w systemie iOS.
* `BR-PAST-034`: Zabezpieczenie przed przypadkowym zresetowaniem timera gestem w dół.
* `BR-PAST-035`: Obsługa pasteryzacji octów domowych w celu zatrzymania pracy matki octowej.

