# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B5: Baza naczyń i przestrzeń nagłowna (Headspace) (Rozdz. 7)**

Moduł odpowiada za geometrię, mechanikę fizyczną zamknięć i szczelność naczyń. Obejmuje wymagania od `BR-NACZ-001` do `BR-NACZ-024`.

---

### **BR-NACZ-001: Baza 25 predefiniowanych typów naczyń i słoików**
* **Opis:** Zawiera charakterystyki fizyczne i modele geometryczne najpopularniejszych naczyń:
  1. **Słoiki Weck:** typ Tulip, Cylinder, Deco, Mold (pojemności 220ml, 370ml, 580ml, 850ml, 1062ml, 1590ml) ze spinkami sprężynowymi i uszczelkami kauczukowymi.
  2. **Słoiki Twist-Off:** standardowe słoiki dżemowe i ogórkowe (pojemności 200ml, 315ml, 540ml, 720ml, 900ml) z wieczkami 4- i 6-zaczepowymi z uszczelką plastizolową i przyciskiem próżniowym (klik).
  3. **Słoiki typu Mason / Ball (USA):** Regular Mouth i Wide Mouth (pojemności Half-Pint 240ml, Pint 480ml, Quart 950ml, Half-Gallon 1900ml) z wieczkiem dwuczęściowym (blaszka dociskowa + gwintowany pierścień).
  4. **Słoiki z klamrą drutową (Fido / Bormioli / Kilner):** gruba uszczelka gumowa, stały zacisk stalowy.
  5. **Kamionki fermentacyjne:** tradycyjne garnki gliniane szkliwione (3L, 5L, 10L) oraz kamionki z hermetycznym rowkiem wodnym.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:** Wybór naczynia automatycznie konfiguruje parametry pasteryzacji, siłę dokręcenia i wymagany headspace.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-002: Dynamiczny kalkulator przestrzeni nagłownej (Headspace Calculator)**
* **Opis:** Wylicza precyzyjną wolną przestrzeń między powierzchnią wsadu a krawędzią słoika:
  * Dżemy, galaretki i powidła pektynowe: $0.6–1.0\,\text{cm}$ ($1/4\,\text{cala}$).
  * Kiszonki, owoce i pikle w zalewie wodno-octowej: $1.2–1.5\,\text{cm}$ ($1/2\,\text{cala}$).
  * Przetwory mięsne, pasztety i fasolka szparagowa: $2.0–2.5\,\text{cm}$ ($1\,\text{cal}$) ze względu na rozszerzalność cieplną białek i tłuszczów.
* **Persona:** P1, P4.
* **Kryteria akceptacji:** Wizualny model słoika z animowaną podziałką w milimetrach pokazujący prawidłowy poziom napełnienia.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-003: Weryfikator siły dokręcania „Fingertip Tight” dla słoików Mason i Twist-Off**
* **Opis:** Instruktaż i procedury dokręcania nakrętek przed pasteryzacją:
  * Słoiki Mason: dokręcanie pierścienia wyłącznie siłą opuszków palców bez użycia siły nadgarstka (umożliwia ujście rozszerzającego się powietrza).
  * Słoiki Weck: założenie 2 sprężynujących spinek naprzeciwko siebie (spinki działają jak zawór jednokierunkowy).
* **Persona:** P1, P2.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-004…BR-NACZ-024: Pozostałe wymagania modułu naczyń:**
* `BR-NACZ-004`: Dobór średnicy i wagi docisku szklanego (Fermentation Glass Weight) w zależności od średnicy szyjki słoika.
* `BR-NACZ-005`: Obsługa definiowania naczynia niestandardowego (Custom Jar) przez podanie pojemności i typu zamknięcia.
* `BR-NACZ-006`: Ostrzeżenie przed pasteryzacją słoików z klamrą drutową Fido (ryzyko pęknięcia szkła pod stałym naciskiem drutu).
* `BR-NACZ-007`: Test szczelności uszczelek gumowych Weck (rozciąganie gumki w dłoniach pod kątem mikropęknięć).
* `BR-NACZ-008`: Procedura wyparzania i sterylizacji naczyń przed napełnieniem.
* `BR-NACZ-009`: Weryfikacja powłoki lakierniczej na wieczkach Twist-off (zakaz używania wieczek z rysami do kwasów).
* `BR-NACZ-010`: Kalkulator pojemności użytkowej garnka do pasteryzacji (ile słoików danego typu zmieści się na jednym poziomie).
* `BR-NACZ-011`: Instrukcja piętrowania słoików w wysokim garnku pasteryzacyjnym z przekładką.
* `BR-NACZ-012`: Wskaźnik odporności termicznej szkła (maksymalny bezpieczny szok termiczny $\Delta T \le 40^\circ\text{C}$).
* `BR-NACZ-013`: Dedykowane wytyczne dla butelek z zamknięciem pałąkowym (Swing-Top) do kombuchy.
* `BR-NACZ-014`: Ostrzeżenie przed używaniem butelek dekoracyjnych o cienkich ściankach do napojów gazowanych.
* `BR-NACZ-015`: Rejestracja wieku i liczby cykli użycia uszczelek gumowych.
* `BR-NACZ-016`: Asystent doboru rurki fermentacyjnej (bulgotki plastikowej vs szklanej).
* `BR-NACZ-017`: Instrukcja napełniania rowka wodnego kamionki (olej jadalny na wierzch wody zapobiegający odparowywaniu).
* `BR-NACZ-018`: Kalkulator rozszerzalności termicznej zalewy octowej w funkcji temperatury.
* `BR-NACZ-019`: Procedura usuwania pęcherzyków powietrza (Debubbling) za pomocą niemetalowej łopatki przed zamknięciem słoika.
* `BR-NACZ-020`: Weryfikacja czystości rantu słoika (przecieranie krawędzi ręcznikiem papierowym przed nałożeniem pokrywki).
* `BR-NACZ-021`: Baza rekomendowanych producentów szkła rzemieślniczego.
* `BR-NACZ-022`: Zapisywanie ulubionego naczynia domyślnego dla profilu użytkownika.
* `BR-NACZ-023`: Instrukcja otwierania zawekowanego słoika Weck przez pociągnięcie języczka uszczelki.
* `BR-NACZ-024`: Ostrzeżenie przed podważaniem nożem wieczek Twist-Off (niszczenie gwintu słoika).

