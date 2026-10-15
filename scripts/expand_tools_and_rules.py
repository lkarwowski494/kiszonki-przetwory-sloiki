# -*- coding: utf-8 -*-
"""
Expander for Tools (B1 to B8) and Domain Rules (C2, C3, C5)
Brings the BRD to full institutional depth (~115-120 standardized pages)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# B1 Solanki Full Detail
f_b1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B1 · rozdz. 7 narzędzia - Kalkulatory solanek (masowe vs objętościowe, całkowita masa nastawu) i rozkładu soli.md")
with open(f_b1, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B1: Kalkulatory solanek i rozkładu soli (Rozdz. 7)**

Moduł odpowiada za eliminację błędów w dawkowaniu soli i ochronę przed zepsuciem biologicznym nastawów. Obejmuje wymagania od `BR-SOL-001` do `BR-SOL-032`.

---

### **BR-SOL-001: Kalkulator stężenia solanki w całkowitej masie nastawu ($M_{tot}$)**
* **Opis:** Użytkownik podaje wagę przygotowanych warzyw/owoców oraz wagę planowanej do dolania wody (lub pojemność słoika). Silnik wylicza wymaganą masę soli $M_{\text{sól}}$ według laboratoryjnego wzoru stechiometrycznego:
  $$M_{\text{sól}} = \frac{p}{100 - p} \cdot (M_{\text{surowiec}} + M_{\text{woda}})$$
  gdzie $p$ to pożądane stężenie soli w % masy (np. $2.2\%$).
* **Persona:** P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:**
  1. Przy $M_{\text{surowiec}} = 650\,\text{g}$, $M_{\text{woda}} = 350\,\text{g}$ i $p = 2.0\%$, kalkulator zwraca dokładnie $20.4\,\text{g}$ soli (zaokrąglane do $0.1\,\text{g}$ lub $1\,\text{g}$ wg preferencji).
  2. Suwak wartości stężenia posiada predefiniowane punkty skokowe (haptic snap): 1.5% (bardzo łagodne małosolne), 2.0% (standard Noma/klasyka), 2.5% (ostre papryki i kapusta), 3.0% (wysokie bezpieczeństwo letnie), 5.0% (długie dojrzewanie).
  3. Przekroczenie wartości granicznych ($<1.5\%$ lub $>10\%$) wyświetla dynamiczny alert ostrzegawczy z wyjaśnieniem biologicznym.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-002: Tradycyjny kalkulator stężenia solanki zalewowej (% masowy w wodzie)**
* **Opis:** Klasyczny kalkulator dla użytkowników przyzwyczajonych do przepisów typu „30 g soli na 1 litr wody”.
* **Persona:** P2 (Babcia Stasia).
* **Kryteria akceptacji:**
  1. Przy podaniu objętości wody $V = 1000\,\text{ml}$ i $p = 3.0\%$, kalkulator zwraca $30.0\,\text{g}$ soli.
  2. Pod wynikiem wyświetla się wyraźna wskazówka informacyjna: „Uwaga: po wlaniu do słoika z ogórkami realne stężenie soli w całej objętości spadnie na skutek osmozy do ok. 1.3–1.5%”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-003: Symulator stanu równowagi osmotycznej po 48h i 14 dniach**
* **Opis:** Oblicza teoretyczne stężenie soli w tkance warzywa i w roztworze po zakończeniu dyfuzji osmotycznej, uwzględniając zawartość wody w surowcu (ogórki 95%, kapusta 92%, marchew 88%, rzodkiew 94%).
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Wykres słupkowy obrazujący stan początkowy (roztwór 3.0%, warzywo 0.0%) $\to$ stan równowagi (roztwór 1.35%, warzywo 1.35%).
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SOL-004: Selektor i przelicznik typów soli spożywczej**
* **Opis:** Użytkownik wybiera rodzaj używanej soli: kamienna kłodawska niejodowana, morska gruboziarnista, sól koszerna (Diamond Crystal / Morton), sól warzona drobna. Silnik przelicza gęstość nasypową przy odmierzaniu łyżkami.
* **Persona:** P2, P1.
* **Kryteria akceptacji:**
  1. Wybór soli z antyzbrylaczem ($E536$ żelazocyjanek potasu) wyświetla ostrzeżenie: „Antyzbrylacz może powodować zmętnienie solanki i szary osad na dnie słoika”.
  2. Wybór soli jodowanej wyświetla informację: „Jod może spowalniać start bakterii kwasu mlekowego w pierwszych 24h”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-005: Kalkulator solenia na sucho (Dry-Salting) dla kapusty i kimchi**
* **Opis:** Oblicza wagę soli niezbędną do zasolenia szatkowanej kapusty (standardowo 2.0%–2.5% masy kapusty) w celu uwolnienia soków komórkowych bez dodawania ani kropli wody.
* **Persona:** P2 (Babcia Stasia), P1 (Tomek).
* **Kryteria akceptacji:** Wpisanie 5.0 kg kapusty przy stężeniu 2.2% zwraca 110 g soli oraz sugerowany czas ugniatania (15–20 minut do całkowitego pokrycia sokiem).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-006: Dozownik soli pektynującej — Chlorek wapnia ($CaCl_2$)**
* **Opis:** Oblicza apteczną dawkę chlorku wapnia spożywczego ($0.05\% - 0.10\%$ masy) do zapobiegania mięknięciu enzymatycznemu ogórków konserwowych i kiszonych.
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Zabezpieczenie przed przedawkowaniem: dawka $>0.15\%$ wywołuje alarm o gorzkim, metalicznym posmaku.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SOL-007: Kalkulator dodatków garbnikowych (Tanin)**
* **Opis:** Sugeruje liczbę liści dębu, wiśni, porzeczki lub chrzanu na 1 litr słoika, hamujących poligalakturonazę (enzym rozkładający pektyny).
* **Persona:** P2, P1.
* **Kryteria akceptacji:** Wyświetlenie bazy 6 naturalnych roślin garbnikowych z zalecaną liczbą liści na słój 1L.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-008: Przelicznik objętości łyżek/łyżeczek na gramy według gradacji soli**
* **Opis:** Przelicza gramaturę na łyżki stołowe (15 ml) i łyżeczki (5 ml) z uwzględnieniem różnic gęstości (Diamond Crystal 10.5g/łyżka vs sól warzona drobna 18.0g/łyżka).
* **Persona:** P2.
* **Kryteria akceptacji:** Wyświetlenie wyniku w formacie ułamkowym przyjaznym kucharzowi (np. „1 pełna łyżka i 1 płaska łyżeczka”).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-009…BR-SOL-032: Kompletny katalog wymagań szczegółowych modułu solanek:**
* `BR-SOL-009`: Kalkulator stężenia solanki dla całych główek kapusty kiszonej w beczce (solanka 4.0%).
* `BR-SOL-010`: Kalkulator wstępnego solenia rzodkwi daikon na Kkakdugi (czas 45 min, płukanie pod bieżącą wodą).
* `BR-SOL-011`: Kalkulator solanki do piklowania jaj w occie (solanka 5% z dodatkiem kwasu).
* `BR-SOL-012`: Kalkulator solanki do fermentacji grzybów leśnych (rydze, maślaki — solanka 2.5% z probiotykiem).
* `BR-SOL-013`: Przelicznik twardości wody kranowej: zalecenie wody średnio-twardej ($15–20^\circ\text{dH}$) dla optymalnej chrupkości ogórków.
* `BR-SOL-014`: Dozownik witaminy C (kwas L-askorbinowy, 0.1%) jako przeciwutleniacza zapobiegającego ciemnieniu wierzchniej warstwy kiszonek.
* `BR-SOL-015`: Kalkulator solanki dla kiszonych cytryn po marokańsku (sól 12–15% masy cytryn).
* `BR-SOL-016`: Kalkulator solanki dla oliwek zielonych ługowanych (solanka fermentacyjna 8–10%).
* `BR-SOL-017`: Obsługa wag kuchennych z dokładnością do 0.1g (dla kultur mikrobiologicznych i $CaCl_2$).
* `BR-SOL-018`: Przełącznik jednostek metrycznych na imperialne (gramy $\leftrightarrow$ uncje / funty).
* `BR-SOL-019`: Kalkulator solanki dla fermentowanego czosnku w miodzie (wilgotność miodu $<18\%$).
* `BR-SOL-020`: Rejestracja temperatury początkowej wody zalewowej (chłodna przegotowana vs wrzątek).
* `BR-SOL-021`: Algorytm korygujący stężenie soli w obecności cukru dodawanego do pikli słodko-kwaśnych.
* `BR-SOL-022`: Weryfikacja czystości soli morskiej (brak mikroplastików, certyfikaty spożywcze).
* `BR-SOL-023`: Automatyczne generowanie listy zakupowej soli dla zadanej liczby słoików.
* `BR-SOL-024`: Zabezpieczenie przed wpisaniem wartości ujemnych lub nieliczbowych w polach wagowych.
* `BR-SOL-025`: Kalkulator solanki dla kiszonych pomidorów (nakłuwanie skórki wykałaczką).
* `BR-SOL-026`: Dozowanie gorczycy białej i czarnej jako naturalnego bakteriostatyku.
* `BR-SOL-027`: Symulator wypierania objętości wody przez ciasno upakowane warzywa w słoiku.
* `BR-SOL-028`: Asystent solanki dla kwasu chlebowego (woda, suchary żytnie, cukier, rodzynki).
* `BR-SOL-029`: Zapisywanie ulubionych profili solankowych użytkownika do szybkiego wywołania.
* `BR-SOL-030`: Integracja z VoiceOver dla dynamicznie zmieniających się wyników wagowych.
* `BR-SOL-031`: Obliczanie siły jonowej roztworu dla zaawansowanych fermentacji laboratoryjnych.
* `BR-SOL-032`: Zabezpieczenie przed przelaniem naczynia przy zbyt dużej ilości dolanej wody.

""")

print("Expanded B1 written successfully.")

# B2 Monitor Fermentacji Full Detail
f_b2 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B2 · rozdz. 7 narzędzia - Monitor fermentacji, osie czasu, krzywe fazowe (burzliwa, cicha) i powiadomienia sensoryczne.md")
with open(f_b2, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B2: Monitor fermentacji i osie czasu (Rozdz. 7)**

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

""")

print("Expanded B2 written successfully.")

# C2, C3, C5 Domain Rules Expanded
f_c2 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C2 · rozdz. 8 reguły dziedzinowe - RD-01 do RD-16 (matematyka solanek, osmoza, twardość wody, taniny, chlorek wapnia).md")
with open(f_c2, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C2: Reguły dziedzinowe RD-01 do RD-16 (Rozdz. 8)**

Każda reguła posiada deterministyczny wzór matematyczny, uzasadnienie i kompletne wektory testowe dla modułu weryfikacji.

---

### **RD-01: Całkowite masowe stężenie solanki (Total Batch Salinity)**
* **Wzór:**
  $$M_{\text{sól}} = \frac{p}{100 - p} \cdot (M_{\text{surowiec}} + M_{\text{woda}})$$
  gdzie $p$ to pożądany procent stężenia w całym układzie, $M_{\text{surowiec}}$ to waga warzyw w gramach, $M_{\text{woda}}$ to waga dolanej wody w gramach.
* **Źródło:** Noma Guide to Fermentation, Food and Agriculture Organization (FAO) Bulletin 134.
* **Wektor testowy 1 (Ogórki kiszone standard):**
  * *Wejście:* $M_{\text{surowiec}} = 650\,\text{g}$, $M_{\text{woda}} = 350\,\text{g}$, $p = 2.2\%$.
  * *Oczekiwane:* $M_{\text{sól}} = \frac{2.2}{97.8} \cdot 1000 = 22.49\,\text{g}$ (zaokrąglenie do $22.5\,\text{g}$).
* **Wektor testowy 2 (Ostre papryki mash bez wody):**
  * *Wejście:* $M_{\text{surowiec}} = 1200\,\text{g}$, $M_{\text{woda}} = 0\,\text{g}$, $p = 2.5\%$.
  * *Oczekiwane:* $M_{\text{sól}} = \frac{2.5}{97.5} \cdot 1200 = 30.77\,\text{g}$ (zaokrąglenie do $30.8\,\text{g}$).

### **RD-02: Stężenie solanki zalewowej (Water-Only Salinity)**
* **Wzór:**
  $$M_{\text{sól}} = \frac{p_{\text{wod}}}{100} \cdot M_{\text{woda}}$$
* **Wektor testowy:**
  * *Wejście:* $M_{\text{woda}} = 1000\,\text{g}$, $p_{\text{wod}} = 3.0\%$.
  * *Oczekiwane:* $M_{\text{sól}} = 30.0\,\text{g}$.

### **RD-03: Równowaga osmotyczna rozcieńczenia solanki zalewowej**
* **Wzór:**
  $$p_{\text{eq}} = \frac{M_{\text{sól}}}{M_{\text{surowiec}} \cdot w_{\text{woda}} + M_{\text{woda}} + M_{\text{sól}}} \cdot 100\%$$
  gdzie $w_{\text{woda}}$ to ułamek wody w surowcu (ogórek: 0.95, kapusta: 0.92, marchew: 0.88, rzodkiew: 0.94).
* **Wektor testowy:**
  * *Wejście:* $M_{\text{surowiec}} = 600\,\text{g}$ (ogórek, $w=0.95$), $M_{\text{woda}} = 400\,\text{g}$, $M_{\text{sól}} = 12\,\text{g}$ (3% w wodzie).
  * *Kalkulacja:* Woda w ogórkach $= 600 \cdot 0.95 = 570\,\text{g}$. Łączna ciecz $= 570 + 400 = 970\,\text{g}$.
  * *Oczekiwane:* $p_{\text{eq}} = \frac{12}{970 + 12} \cdot 100\% = 1.22\%$. (Wyświetlenie alertu: „Stężenie równowagowe 1.22% jest poniżej progu bezpieczeństwa 1.8%!”).

### **RD-04: Solenie na sucho kapusty (Dry Salting)**
* **Wzór:**
  $$M_{\text{sól}} = \frac{p}{100} \cdot M_{\text{kapusta}}$$
* **Wektor testowy:**
  * *Wejście:* $M_{\text{kapusta}} = 10000\,\text{g}$ (10 kg), $p = 2.0\%$.
  * *Oczekiwane:* $M_{\text{sól}} = 200.0\,\text{g}$.

### **RD-05: Dawkowanie chlorku wapnia ($CaCl_2$) dla chrupkości**
* **Wzór:**
  $$M_{CaCl_2} = \frac{p_{Ca}}{100} \cdot (M_{\text{surowiec}} + M_{\text{woda}})$$
  gdzie $p_{Ca} \in [0.05\%, 0.10\%]$.
* **Wektor testowy:**
  * *Wejście:* $M_{tot} = 1000\,\text{g}$, $p_{Ca} = 0.08\%$.
  * *Oczekiwane:* $M_{CaCl_2} = 0.80\,\text{g}$. Alarm przy dawce $>1.5\,\text{g}$.

### **RD-06: Przelicznik objętości łyżek stołowych soli względem gęstości nasypowej**
* **Tabela gęstości:**
  * Sól warzona drobna: $1.20\,\text{g/ml}$ (1 płaska łyżka 15 ml = $18.0\,\text{g}$).
  * Sól kamienna gruba niejodowana: $1.05\,\text{g/ml}$ (1 łyżka = $15.8\,\text{g}$).
  * Sól koszerna Diamond Crystal: $0.70\,\text{g/ml}$ (1 łyżka = $10.5\,\text{g}$).
  * Sól koszerna Morton: $0.95\,\text{g/ml}$ (1 łyżka = $14.2\,\text{g}$).
* **Wektor testowy:**
  * *Wejście:* Wymagane $30\,\text{g}$ soli. Typ: Diamond Crystal Kosher.
  * *Oczekiwane:* $2.86$ łyżki stołowej (aplikacja podaje: „2 łyżki i 3/4”).

### **RD-07: Hamowanie enzymów pektynolitycznych taninami roślinnymi**
* **Zasada:** Enzymy pektynolityczne (egzo- i endo-poligalakturonaza) syntetyzowane przez pleśnie i naturalną mikroflorę kwiatostanów ogórka rozkładają protopektynę blaszki środkowej komórek roślinnych, powodując wiotczenie i mięknięcie kiszonek. Taniny (związki polifenolowe) wiążą się nieodwracalnie z resztami białkowymi enzymów, powodując ich denaturację.
* **Wzór dawkowania:**
  $$N_{\text{liście}} = \max\left(2, \left\lceil \frac{V_{\text{słój}}}{500} \right\rceil\right)$$
* **Wektor testowy:** Słój 1500 ml wymaga min. 3 liści dębu lub wiśni.

### **RD-08: Wyporność i objętość dolanej wody w słoiku (Packing Density Heuristic)**
* **Zasada:** Świeże ogórki ciasno upakowane w słoiku zajmują od 58% do 65% objętości geometrycznej naczynia. Pozostałą objętość (35%–42%) stanowi solanka zalewowa.
* **Wzór:**
  $$V_{\text{woda\_est}} = V_{\text{słój}} \cdot (1 - \eta_{\text{upak}})$$
  gdzie $\eta_{\text{upak}} \approx 0.62$.
* **Wektor testowy:** Słoik 1000 ml mieści ok. 620 g ogórków i wymaga ok. 380 ml solanki.

### **RD-09…RD-16: Kompletny katalog reguł chemii roztworów:**
* `RD-09`: Kompensacja twardości węglanowej wody studziennej: jony wapnia $Ca^{2+}$ i magnezu $Mg^{2+}$ wzmacniają mostki pektynianowe.
* `RD-10`: Zmniejszanie aktywności wody $a_w$ przez sól: przy 2.5% soli $a_w \approx 0.985$, przy 10% soli $a_w \approx 0.935$.
* `RD-11`: Rozpuszczalność $CO_2$ w solance w funkcji temperatury: w $15^\circ\text{C}$ rozpuszczalność gazu jest o 38% wyższa niż w $25^\circ\text{C}$.
* `RD-12`: Kwasowość wyjściowa kapusty i wpływ nawożenia azotowego na zawartość cukrów fermentowalnych.
* `RD-13`: Kationowa wymiana w naczyniach glinianych i kamionkach szkliwionych.
* `RD-14`: Wpływ dodatku chrzanu (izotiocyjaniany allilu) na zahamowanie rozwoju bakterii gnilnych.
* `RD-15`: Wpływ promieniowania UV na degradację chlorofilu w ogórkach (konieczność fermentacji w ciemnym miejscu).
* `RD-16`: Dyfuzja soli w czosnku w łupinach vs czosnku obranym (2-krotnie szybsza penetracja w ząbkach obranych).

""")

print("Expanded C2 written successfully.")
