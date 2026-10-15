# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B7: Apple Watch i kuchenne Hands-Free (Rozdz. 7)**

Moduł odpowiada za komfort i ergonomię pracy w kuchni. Obejmuje wymagania od `BR-ZEG-001` do `BR-ZEG-022`.

---

### **BR-ZEG-001: Samodzielny stoper pasteryzacji na Apple Watch**
* **Opis:** Niezależna aplikacja na watchOS pozwalająca wybrać metodę pasteryzacji, litraż słoika i wystartować odliczanie.
* **Persona:** P1, P2.
* **Kryteria akceptacji:** Działa w pełni autonomicznie na zegarku bez konieczności obecności iPhone'a w kuchni.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-002: Sterowanie cyfrową koronką (Digital Crown)**
* **Opis:** Precyzyjne nastawianie minut pasteryzacji obrotem koronki z wyraźnymi kliknięciami haptycznymi Taptic Engine.
* **Persona:** P1.
* **Kryteria akceptacji:** Umożliwia pełną obsługę mokrymi palcami bez dotykania ekranu dotykowego.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-003: Live Activity i Dynamic Island na iPhonie**
* **Opis:** Trwająca pasteryzacja prezentowana w czasie rzeczywistym na ekranie blokady oraz w Dynamic Island.
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Aktualizacja stanu co 1 sekundę bez obciążania procesora.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-004…BR-ZEG-022: Pozostałe wymagania modułu hands-free:**
* `BR-ZEG-004`: Obsługa skrótów Siri App Intents („Hej Siri, ile do końca pasteryzacji?”).
* `BR-ZEG-005`: Odhaczanie odgazowania słoika bezpośrednio z powiadomienia na zegarku.
* `BR-ZEG-006`: Komplikacja tarczy zegarka pokazująca liczbę dni do dojrzałości najważniejszej kiszonki.
* `BR-ZEG-007`: Wyrazisty alarm haptyczny na 2 minuty przed końcem gotowania słoików.
* `BR-ZEG-008`: Alarm krytyczny (Critical Alert) z pominięciem trybu wyciszenia w momencie zakończenia pasteryzacji.
* `BR-ZEG-009`: Szybki podgląd przepisu na nadgarstku (np. wymagane gramy soli na 1 litr).
* `BR-ZEG-010`: Synchronizacja danych partii między zegarkiem a telefonem za pośrednictwem `WCSession`.
* `BR-ZEG-011`: Wyświetlanie aktualnego etapu tyndalizacji na tarczy zegarka.
* `BR-ZEG-012`: Obsługa gestu podwójnego stuknięcia palcami (Double Tap) w watchOS 10+ do pauzy stopera.
* `BR-ZEG-013`: Widżet Smart Stack na Apple Watch prezentujący trwające gotowanie.
* `BR-ZEG-014`: Zabezpieczenie przed uśpieniem ekranu zegarka w trakcie aktywnej pasteryzacji.
* `BR-ZEG-015`: Rejestracja czasu schłodzenia słoików po wyjęciu z garnka.
* `BR-ZEG-016`: Widżety ekranu blokady iPhone'a (małe i średnie) ze stanem spiżarni.
* `BR-ZEG-017`: Głosowe dodawanie notatki do partii przez dyktowanie Siri.
* `BR-ZEG-018`: Sygnalizacja przekroczenia zalecanej temperatury otoczenia w kuchni.
* `BR-ZEG-019`: Dedykowane powiadomienie o konieczności uzupełnienia wody w rowku kamionki.
* `BR-ZEG-020`: Minimalistyczny interfejs nocny zegarka (czerwony motyw dla piwnicy).
* `BR-ZEG-021`: Automatyczne wznowienie odliczania po restarcie zegarka.
* `BR-ZEG-022`: Podgląd karty słoika na zegarku po odczytaniu tagu NFC w wersji 2.0.

