# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B6: Refraktometria Brix i pH-metria (Rozdz. 7)**

Moduł odpowiada za analizę laboratoryjną parametrów fizykochemicznych nastawu. Obejmuje wymagania od `BR-BRIX-001` do `BR-BRIX-020`.

---

### **BR-BRIX-001: Cyfrowy rejestrator kwasowości pH z kompasem bezpieczeństwa**
* **Opis:** Rejestracja odczytu kwasowości pH z cyfrowego pH-metru lub paska lakmusowego z natychmiastową interpretacją sanitarną:
  * $\text{pH} \le 4.20$: Strefa bezpieczna (kolor zielony) — aktywność bakterii LAB lub octu wystarczająca.
  * $4.21 \le \text{pH} \le 4.59$: Strefa ostrzegawcza (kolor żółty) — niepewny stan mikrobiologiczny, zalecenie dokwaszenia.
  * $\text{pH} \ge 4.60$: Strefa krytyczna (kolor czerwony) — alarm botulinowy! Zakaz zamykania przetworu beztlenowo bez sterylizacji ciśnieniowej.
* **Persona:** P1 (Tomek), P4 (Marek).
* **Kryteria akceptacji:** Wykres historii pH partii od dnia nastawu do zakończenia fermentacji.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-BRIX-002: Kalkulator stopni Brix ($^\circ\text{Bx}$) i punktu żelowania dżemu**
* **Opis:** Przelicza odczyt refraktometru na procent wagowy sacharozy i wylicza stabilność mikrobiologiczną dżemu:
  * $\ge 65^\circ\text{Bx}$: trwałość osmotyczna (wysoki cukier hamuje rozwój pleśni i bakterii).
  * $< 60^\circ\text{Bx}$: obowiązkowa pasteryzacja termiczna.
* **Persona:** P2 (Babcia Stasia), P3 (Claire).
* **Kryteria akceptacji:** Dynamiczne wyliczanie wymaganego dodatku cukru lub odparowania wody do osiągnięcia zadanego Brix.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-BRIX-003…BR-BRIX-020: Pozostałe wymagania modułu pomiarowego:**
* `BR-BRIX-003`: Kompensacja temperatury odczytów refraktometru (automatyczna korekta dla odczytów poza $20^\circ\text{C}$).
* `BR-BRIX-004`: Obliczanie kwasowości miareczkowej (Total Acidity — TA) w przeliczeniu na g/l kwasu mlekowego lub octowego.
* `BR-BRIX-005`: Instrukcja dwupunktowej kalibracji pH-metru z buforami pH 4.01 i pH 7.00.
* `BR-BRIX-006`: Korekta Brix przy obecności alkoholu w fermentacjach kombuchy i octu.
* `BR-BRIX-007`: Rejestracja przewodności elektrycznej solanki (ocena czystości wody).
* `BR-BRIX-008`: Kalkulator proporcji pektyna-cukier-kwas dla dżemów niskosłodzonych z pektyną amidowaną.
* `BR-BRIX-009`: Przelicznik stopni Brix na ciężar właściwy (SG) i stopnie Baumé.
* `BR-BRIX-010`: Wykres kinetyki fermentacji alkoholowej i octowej w produkcji żywego octu.
* `BR-BRIX-011`: Wykrywanie zafałszowania miodu w fermentacjach miodowych na podstawie refraktometru.
* `BR-BRIX-012`: Instrukcja prawidłowego pobierania próbki solanki do pomiaru pH (zakaz wkładania sondy do całego słoika).
* `BR-BRIX-013`: Rejestracja partii papierków lakmusowych i ich zakresu (np. wąski zakres pH 3.8–5.4).
* `BR-BRIX-014`: Alarm o zbyt gwałtownym skoku kwasowości (możliwe zakażenie kwasem octowym w kiszonce).
* `BR-BRIX-015`: Obliczanie zawartości alkoholu potencjalnego na podstawie wyjściowego Brix owoców.
* `BR-BRIX-016`: Dziennik kalibracji sprzętu pomiarowego użytkownika.
* `BR-BRIX-017`: Eksport danych pomiarowych do wykresu wektorowego SVG.
* `BR-BRIX-018`: Filtrowanie mętnych próbek przed odczytem na pryzmacie refraktometru.
* `BR-BRIX-019`: Przelicznik jednostek kwasowości z francuskich stopni kwasowości na pH.
* `BR-BRIX-020`: Sugestia korekty smaku dżemu kwasem cytrynowym w przypadku zbyt mdłego profilu.

