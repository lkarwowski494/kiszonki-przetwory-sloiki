# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B2: Monitor fermentacji i osie czasu (Rozdz. 7)**

Moduł odpowiada za prowadzenie partii przez cały wielotygodniowy cykl biologiczny. Obejmuje wymagania od `BR-FERM-001` do `BR-FERM-038`.

---

### **BR-FERM-001: Cyfrowa karta partii nastawu (Batch Card)**
* **Opis:** Każdy rozpoczęty nastaw otrzymuje unikalną kartę zawierającą: unikalny identyfikator UUID, nazwę własną, typ surowca, datę i godzinę startu, pojemność i markę naczynia, stężenie soli, status mikrobiologiczny oraz przewidywaną datę dojrzałości.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:**
  1. Utworzenie partii wymaga mniej niż 30 sekund w uproszczonym kreatorze (3 kroki).
  2. Karta partii trwale zapisuje się w lokalnej bazie SQLite.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-002: Dynamiczna oś czasu z podziałem na fazy mikrobiologiczne**
* **Opis:** Oś czasu wizualizuje 3 fazy fermentacji mlekowej:
  * **Faza 1 (Dni 1–2):** Rozwój *Leuconostoc mesenteroides*, powstawanie $CO_2$ i kwasu mlekowego, gwałtowne obniżanie pH poniżej 5.0.
  * **Faza 2 (Dni 3–7):** Faza burzliwa, dominacja *Lactobacillus plantarum* i *Lactobacillus brevis*, intensywne zakwaszanie, piana na powierzchni.
  * **Faza 3 (Dni 8+):** Faza cicha / stabilizacja, dominacja homofermentatywnych pałeczek kwasu mlekowego, dojrzewanie bukietu estrowego.
* **Persona:** P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:** Pasek postępu z kolorystycznym oznaczeniem faz i opisem procesów wewnątrz słoika.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-003: Harmonogram alertów o odgazowaniu („odbiciu” / burping)**
* **Opis:** Dla słoików bez rurki fermentacyjnej aplikacja generuje lokalne powiadomienia przypominające o uchyleniu wieczka:
  * W fazie 1–2: 2 razy na dobę (np. 9:00 i 20:00).
  * W fazie 3: raz na 48 godzin.
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Kliknięcie powiadomienia odhacza odgazowanie na karcie partii bez konieczności odblokowywania telefonu.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-004: Adaptacja tempa fermentacji do temperatury otoczenia**
* **Opis:** Użytkownik podaje przybliżoną temperaturę pomieszczenia ($16–19^\circ\text{C}$ piwnica/chłodny pokój, $20–23^\circ\text{C}$ kuchnia, $24–28^\circ\text{C}$ upały letnie). Silnik dynamicznie skraca lub wydłuża czas trwania faz fermentacji zgodnie ze współczynnikiem $Q_{10} \approx 2.0$.
* **Persona:** P1, P2.
* **Kryteria akceptacji:** W temperaturze $26^\circ\text{C}$ ogórki małosolne osiągają gotowość po 48h; w $18^\circ\text{C}$ po 96h.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-005…BR-FERM-038: Pozostałe wymagania modułu monitora:**
* `BR-FERM-005`: Dziennik notatek sensorycznych (zapach, piana, mętność solanki, chrupkość).
* `BR-FERM-006`: Asystent dwuetapowej fermentacji Kombuchy (F1 tlenowa 7–14 dni $\to$ F2 butelkowa 2–4 dni).
* `BR-FERM-007`: Monitor żywych octów owocowych z matką octową (fermentacja 4–8 tygodni).
* `BR-FERM-008`: Specjalny tryb fermentacji czosnku w miodzie (odwracanie słoika codziennie przez pierwsze 14 dni).
* `BR-FERM-009`: Asystent japońskich pikli Nukazuke (przypomnienie o codziennym ręcznym mieszaniu podłoża otrębowego).
* `BR-FERM-010`: Monitor fermentacji Shio-koji (mieszanie raz dziennie przez 7–10 dni w temperaturze pokojowej).
* `BR-FERM-011`: Obsługa wieloetapowego kiszenia Kimchi (etap solenia kapusty w misce $\to$ płukanie $\to$ fermentacja w słoiku).
* `BR-FERM-012`: Oznaczanie partii jako „Przeniesiona do chłodzenia / Spiżarni”.
* `BR-FERM-013`: Rejestracja temperatury chłodzenia w lodówce ($4^\circ\text{C}$) spowalniającej fermentację 10-krotnie.
* `BR-FERM-014`: Archiwum partii historycznych z możliwością klonowania receptury do nowego nastawu.
* `BR-FERM-015`: Wykres historii pomiarów kwasowości pH w czasie dla danej partii.
* `BR-FERM-016`: Alert o zbliżającym się optymalnym oknie degustacyjnym.
* `BR-FERM-017`: Dedykowany tryb kwasu chlebowego (fermentacja 24–48h, szybkie chłodzenie).
* `BR-FERM-018`: Dedykowany tryb zakwasu buraczanego (fermentacja 5–7 dni, odcedzanie buraków).
* `BR-FERM-019`: Dedykowany tryb zakwasu żytniego na żur (dokarmianie mąką i wodą).
* `BR-FERM-020`: Wykrywanie opóźnionego startu fermentacji (brak bąbelków po 72h).
* `BR-FERM-021`: Dołączanie do 3 zdjęć dokumentujących etapy rozwoju partii.
* `BR-FERM-022`: Zabezpieczenie przed przypadkowym skasowaniem aktywnej partii (wymóg potwierdzenia).
* `BR-FERM-023`: Eksport karty partii do formatu PDF lub karty graficznej do udostępnienia.
* `BR-FERM-024`: Kategoryzacja partii tagami (np. #ostre, #eko, #działka, #eksperyment).
* `BR-FERM-025`: Monitor fermentacji kiszonej rzepy Torshi Left (wyjęcie buraka po uzyskaniu koloru).
* `BR-FERM-026`: Monitor dojrzewania cytryn marokańskich (4–6 tygodni w ciemnym miejscu).
* `BR-FERM-027`: Przypomnienie o kontroli poziomu wody w rowku kamionki fermentacyjnej (uzupełnianie odparowanej wody).
* `BR-FERM-028`: Obsługa fermentacji w workach próżniowych (Vacuum Fermentation wg techniki Noma).
* `BR-FERM-029`: Alerty o konieczności nakłucia kapusty w celu uwolnienia gazów siarkowodorowych.
* `BR-FERM-030`: Rejestracja partii zepsutej z wyborem przyczyny w celach statystycznych.
* `BR-FERM-031`: Wyliczanie śladu węglowego i oszczędności zero-waste (uratowane warzywa).
* `BR-FERM-032`: Wyciszanie powiadomień w godzinach nocnych (DND / Tryb skupienia iOS).
* `BR-FERM-033`: Współdzielenie postępu partii w Chmurze rodzinnej (Family Sharing).
* `BR-FERM-034`: Kalkulator przewidywanej zawartości probiotyków CFU/ml w zależności od dnia fermentacji.
* `BR-FERM-035`: Obsługa fermentacji alkoholowo-kwasowej cydru domowego.
* `BR-FERM-036`: Kontrola zapachu acetonu przy przegrzaniu nastawu ($>30^\circ\text{C}$).
* `BR-FERM-037`: Tryb dla fermentacji amazake (utrzymywanie $55–60^\circ\text{C}$ przez 8–10h).
* `BR-FERM-038`: Podsumowanie miesięczne: liczba aktywnych litrów fermentacji w domu.

