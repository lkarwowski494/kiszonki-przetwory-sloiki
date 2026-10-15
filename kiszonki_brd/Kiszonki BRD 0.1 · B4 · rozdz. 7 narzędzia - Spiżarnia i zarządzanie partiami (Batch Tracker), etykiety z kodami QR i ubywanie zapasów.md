# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B4: Spiżarnia i zarządzanie partiami (Rozdz. 7)**

Moduł odpowiada za cyfrową ewidencję gotowych przetworów, kontrolę dat ważności i etykiety QR. Obejmuje wymagania od `BR-SPIN-001` do `BR-SPIN-036`.

---

### **BR-SPIN-001: Widok Spiżarni z podziałem na kategorie i lokalizacje**
* **Opis:** Katalog przetworów pogrupowany według kategorii (Kiszonki, Pikle octowe, Dżemy i powidła, Przetwory pomidorowe, Mięsa i ryby, Napoje probiotyczne, Syropy) oraz opcjonalnego podziału na fizyczne lokalizacje (Piwnica, Spiżarnia kuchenna, Półka w garażu, Lodówka).
* **Persona:** P2 (Babcia Stasia), P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:**
  1. Wyświetlenie sumarycznego paska statystyk: łączna liczba słoików, łączna objętość w litrach, najstarszy aktywny rocznik.
  2. Szybkie filtry: „Tylko gotowe do spożycia”, „W trakcie dojrzewania”, „Kończące się zapasy ($\le 2$ słoiki)”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-002: Szybkie zmniejszanie stanu magazynowego („-1 słoik ze spiżarni”)**
* **Opis:** Jedno dotknięcie na liście partii dekrementuje stan magazynowy o 1 sztukę (np. po wyniesieniu słoika do obiadu).
* **Persona:** P2 (Babcia Stasia).
* **Kryteria akceptacji:**
  1. Zmiana stanu zapisuje się natychmiast w bazie SQLite.
  2. Po osiągnięciu 0 partia automatycznie przechodzi do sekcji „Zapasy wyczerpane” z opcją powtórzenia przepisu jednym kliknięciem.
  3. Pływający pasek powiadomienia (Toast) umożliwia natychmiastowe cofnięcie akcji (Undo) przez 5 sekund.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-003: Generator etykiet na słoiki (PNG o wysokiej rozdzielczości)**
* **Opis:** Generuje estetyczną, wektorową etykietę graficzną w rozdzielczości 300 DPI gotową do wydruku na domowej drukarce lub przesłania przez AirDrop/AirPrint.
* **Persona:** P2, P3.
* **Kryteria akceptacji:** Etykieta zawiera nazwę przetworu, rok nastawu, kluczowe składniki, stężenie soli/cukru, piktogram ostrości/kwaśności oraz kod identyfikacyjny partii.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-004: Obsługa kodów URI i kodów QR partii**
* **Opis:** Każda wygenerowana etykieta zawiera kod QR kodujący głęboki link URL (`sloik://batch/<uuid>`). Zeskanowanie aparatem iPhone'a natychmiast otwiera aplikację bezpośrednio na karcie danego słoika.
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Pełna obsługa offline bez konieczności połączenia z internetem.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SPIN-005…BR-SPIN-036: Kompletny katalog wymagań modułu spiżarni:**
* `BR-SPIN-005`: Przypomnienia o zbliżającym się zalecanym terminie spożycia (Best Before).
* `BR-SPIN-006`: Kalkulator kosztu surowców w przeliczeniu na 1 słoik (ekonomia domowa).
* `BR-SPIN-007`: Wyszukiwarka pełnotekstowa (Full-Text Search) w spiżarni po nazwie, roku i składnikach.
* `BR-SPIN-008`: Sortowanie spiżarni: wg daty nastawu, liczby słoików, alfabetycznie, wg lokalizacji.
* `BR-SPIN-009`: Ręczna korekta stanu słoików w partii (+1, -1, edycja liczby całkowitej).
* `BR-SPIN-010`: Rejestracja słoików podarowanych znajomym (funkcja „Podaruj słoik”).
* `BR-SPIN-011`: Ocena gwiazdkowa partii (1–5 gwiazdek) po otwarciu pierwszego słoika.
* `BR-SPIN-012`: Oznaczanie słoików z wadami (np. rozszczelnione, zbyt kwaśne).
* `BR-SPIN-013`: Eksport ewidencji spiżarni do pliku CSV zgodnego z arkuszem kalkulacyjnym.
* `BR-SPIN-014`: Generator arkuszy etykiet samoprzylepnych w formacie PDF (standardy Avery A4).
* `BR-SPIN-015`: Dedykowany szablon etykiet na małe wieczka Twist-Off ($\varnothing 43\,\text{mm}$ i $\varnothing 66\,\text{mm}$).
* `BR-SPIN-016`: Oznaczanie słoików wymagających przechowywania w lodówce.
* `BR-SPIN-017`: Automatyczna sugestia ponownego nastawu przed nadejściem sezonu warzywnego.
* `BR-SPIN-018`: Filtrowanie partii według zawartości alergenów (gorczyca, seler).
* `BR-SPIN-019`: Dziennik otwarcia słoika: rejestracja daty otwarcia i sugerowany czas na spożycie po rozpieczętowaniu.
* `BR-SPIN-020`: Tryb inwentaryzacji spiżarni (szybkie skanowanie słoików aparatem jeden po drugim).
* `BR-SPIN-021`: Dołączanie notatki o źródle surowca (np. „Ogórki z targu od pani Marysi”).
* `BR-SPIN-022`: Podgląd historii ubywania zapasów w postaci wykresu liniowego.
* `BR-SPIN-023`: Obsługa etykiet w stylu retro (imitacja papieru kraftowego).
* `BR-SPIN-024`: Obsługa etykiet minimalistycznych nowoczesnych (styl laboratoryjny).
* `BR-SPIN-025`: Grupowe przenoszenie słoików między lokalizacjami (np. z kuchni do piwnicy).
* `BR-SPIN-026`: Rejestracja zwrotu pustych słoików od obdarowanych znajomych.
* `BR-SPIN-027`: Zabezpieczenie przed usunięciem partii z dodatnimi zapasami.
* `BR-SPIN-028`: Wsparcie dla czytników kodów kreskowych Bluetooth (dla entuzjastów).
* `BR-SPIN-029`: Rejestracja wilgotności względnej w piwnicy (optymalnie $<70\%$ dla ochrony pokrywek przed korozją).
* `BR-SPIN-030`: Oznaczanie słoików przeznaczonych na konkursy kulinarne lub jarmarki.
* `BR-SPIN-031`: Wyliczanie całkowitej wagi zapasów (dla kontroli nośności półek drewnianych w piwnicy).
* `BR-SPIN-032`: Integracja spiżarni z widżetem na ekranie początkowym iOS.
* `BR-SPIN-033`: Wskaźnik rotacji zapasów (FIFO — First In, First Out).
* `BR-SPIN-034`: Oznaczanie słoików eksperymentalnych (np. test nowego szczepu LAB).
* `BR-SPIN-035`: Dzielenie partii na podpartie (np. 6 słoików łagodnych, 4 słoiki z chili).
* `BR-SPIN-036`: Roczne podsumowanie sezonu: infografika przetwórcza z podsumowaniem litrów.

