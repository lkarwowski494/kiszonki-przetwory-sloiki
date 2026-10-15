# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B8: Diagnostyk problemów przetwórstwa (Troubleshooting Doctor) (Rozdz. 7)**

Moduł odpowiada za ratowanie partii i eliminację ryzyka zatruć pokarmowych. Obejmuje wymagania od `BR-DOK-001` do `BR-DOK-018`.

---

### **BR-DOK-001: Interaktywne drzewo decyzyjne analizy wad przetworu**
* **Opis:** 40-węzłowe drzewo decyzyjne prowadzące użytkownika przez serię pytań o wygląd, strukturę, kolor, zapach i zachowanie słoika.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:** 100% determinizm, brak losowości, brak generatywnego AI.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-002: Węzeł różnicowania: Drożdże kożuchujące (Kahm) vs Pleśń mikotoksynowa**
* **Opis:**
  * Weryfikacja struktury: matowa, cienka błonka z pofałdowaniami $\to$ Drożdże Kahm (bezpieczne po zebraniu łyżką).
  * Weryfikacja puszystości: meszek, kłaczki, wznoszące się zarodniki w kolorze zielonym, niebieskim, czarnym $\to$ Pleśń (bezwzględny nakaz wyrzucenia).
* **Persona:** P1, P2, P3.
* **Kryteria akceptacji:** Wyświetlenie zdjęć porównawczych w wysokiej rozdzielczości z zaznaczonymi cechami kluczowymi.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-003…BR-DOK-018: Pozostałe węzły diagnostyczne:**
* `BR-DOK-003`: Diagnoza mięknięcia ogórków (aktywność pektynazy vs brak soli vs za wysoka temperatura).
* `BR-DOK-004`: Diagnoza zielenienia i niebieszczenia czosnku (bezpieczne barwniki pirolowe).
* `BR-DOK-005`: Diagnoza spuchniętego wieczka Twist-Off po pasteryzacji (rozwój bakterii gnilnych lub *Bacillus* $\to$ nakaz utylizacji).
* `BR-DOK-006`: Diagnoza braku „kliknięcia” wieczka po ostygnięciu słoika (rozszczelnienie).
* `BR-DOK-007`: Diagnoza śluzowacenia solanki (rozwój *Leuconostoc dextranicum* produkującego dekstrany).
* `BR-DOK-008`: Diagnoza intensywnego zmętnienia solanki w korniszonach octowych (błąd pasteryzacji).
* `BR-DOK-009`: Diagnoza zapachu acetonu lub zmywacza do paznokci (zbyt wysoka temperatura fermentacji mlekowej $>28^\circ\text{C}$).
* `BR-DOK-010`: Diagnoza ciemnienia wierzchniej warstwy kiszonki (utlenianie polifenoli z powodu braku zalewy).
* `BR-DOK-011`: Diagnoza pękania skórek w kiszonych pomidorach (za szybka osmoza, brak nakłuwania).
* `BR-DOK-012`: Diagnoza wykrystalizowania cukru w powidłach i dżemach (zbyt wysoki Brix $>70^\circ\text{Bx}$).
* `BR-DOK-013`: Diagnoza braku żelowania dżemu (za wysokie pH $>3.5$ lub brak naturalnej pektyny).
* `BR-DOK-014`: Diagnoza białego osadu na dnie słoika z ogórkami (martwe bakterie kwasu mlekowego LAB — w 100% bezpieczne).
* `BR-DOK-015`: Diagnoza brunatnienia marynowanych grzybów (kontakt z żelazem lub brak obgotowania z kwasem).
* `BR-DOK-016`: Diagnoza obecności muszek owocówek w słoju z octem (nieszczelna gaza).
* `BR-DOK-017`: Diagnoza nadmiernej goryczy w kiszonych cytrynach (niedostateczny czas dojrzewania).
* `BR-DOK-018`: Generowanie raportu ratunkowego z podsumowaniem kroków naprawczych.

