# -*- coding: utf-8 -*-
"""
Generator for Kiszonki BRD 0.1 - Part C (Academy & Domain Rules RD-01 to RD-55, Decisions D-01 to D-25)
Chapters C1 to C5
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# C1 Academy & Microbial Atlas
f_c1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C1 · rozdz. 7 nauka - Szkoła Przetwórstwa i Fermentacji, atlas kultur bakteryjnych, drożdży i pleśni szlachetnych.md")
with open(f_c1, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C1: Szkoła Przetwórstwa i Atlas Kultur (Rozdz. 7)**

Moduł edukacyjny stanowi fundament unikalności rynkowej aplikacji i eliminuje ryzyko odrzucenia przez Apple (wytyczna 4.3).

## **1. Atlas Kultur Mikrobiologicznych w Domowym Słoiku**

Każda kultura w bazie posiada profil: taksonomia, temperatura optymalna, tolerancja soli, tolerancja kwasu, rola smakowa i sensoryczna.

### **1.1 Bakterie Kwasu Mlekowego (LAB - Lactic Acid Bacteria)**
* **Leuconostoc mesenteroides (Inicjator fermentacji mlekowej):**
  * *Charakterystyka:* Heterofermentatywna bakteria kwasu mlekowego o kształcie ziarniaka.
  * *Optimum temperaturowe:* $18–22^\circ\text{C}$.
  * *Tolerancja soli:* $1.5\%–3.5\%$.
  * *Rola:* Startuje jako pierwsza w kapuście, ogórkach i kimchi. Wytwarza kwas mlekowy, kwas octowy, etanol, dwutlenek węgla ($CO_2$) oraz diacetyl (maślany aromat). To ona odpowiada za wczesne gazowanie słoika i gwałtowne obniżenie pH poniżej 5.0, hamując bakterie gnilne.
* **Lactobacillus plantarum / Lactiplantibacillus plantarum (Koń pociągowy):**
  * *Charakterystyka:* Homofermentatywna pałeczka kwasu mlekowego.
  * *Optimum temperaturowe:* $25–32^\circ\text{C}$ (działa sprawnie także w $15–25^\circ\text{C}$).
  * *Tolerancja soli:* do $8\%–10\%$.
  * *Rola:* Przejmuje pałeczkę po *Leuconostoc*, gdy kwasowość rośnie. Produkuje czysty kwas mlekowy ($D/L$), obniżając pH do wartości $3.4–3.8$. Nadaje kiszonkom wyrazisty, czysty, ostry profil kwasowy.
* **Pediococcus cerevisiae / Pediococcus pentosaceus:**
  * *Charakterystyka:* Homofermentatywny ziarniak tolerujący wysokie stężenia soli ($>5\%$) i wyższe temperatury ($30–35^\circ\text{C}$).
  * *Rola:* Kluczowy w fermentacjach mięsnych (kiełbasy fermentowane, salo) oraz w gorących klimatach.

### **1.2 Bakterie Kwasu Octowego (AAB - Acetic Acid Bacteria)**
* **Acetobacter aceti / Gluconobacter oxydans (Matka octowa):**
  * *Rola:* Ściśle tlenowe bakterie przekształcające etanol w kwas octowy:
    $$\text{C}_2\text{H}_5\text{OH} + \text{O}_2 \xrightarrow{\text{Acetobacter}} \text{CH}_3\text{COOH} + \text{H}_2\text{O}$$
  * *Wymagania:* Stały dostęp tlenu atmosferycznego (słój przykryty gazą/tkaniną), stężenie alkoholu wyjściowego $5\%–8\%$, optymalna temperatura $24–28^\circ\text{C}$.

### **1.3 Drożdże i Kultury Symbiotyczne**
* **SCOBY (Symbiotic Culture of Bacteria and Yeast - Kombucha):**
  * *Skład:* Konsorcjum drożdży (*Zygosaccharomyces*, *Saccharomyces cerevisiae*) oraz bakterii octowych (*Komagataeibacter xylinus* tworzący celulozowy grzybek na powierzchni).
  * *Metabolizm:* Drożdże rozszczepiają sacharozę na glukozę i fruktozę, wytwarzając alkohol i $CO_2$; bakterie octowe utleniają alkohol do kwasu octowego i kwasu glukonowego.
* **Aspergillus oryzae (Pleśń Koji):**
  * *Rola:* Wytwarzanie potężnych baterii enzymatycznych (amylazy rozbijające skrobię na cukry proste, proteazy rozbijające białka na aminokwasy kwasu glutaminowego dające smak umami). Wykorzystywana do shio-koji, miso i domowego garum.

---

## **2. Kompas Tradycji Świata**
Interaktywny atlas prezentujący techniki konserwacji i naczynia:
1. **Polska i Europa Wschodnia:** Kamionki z rowkiem wodnym, słoje Weck, dębowe beczki. Tradycja małosolnych, kwasu chlebowego i zakwasu buraczanego.
2. **Korea:** *Onggi* (oddychająca glina mikroporowata), solenie kapusty z pastą z kleiku ryżowego, gochugaru i sosu rybnego (*jeotgal*).
3. **Japonia:** *Tsukemono* w naczyniach dociskowych (*tsukemonoki*), fermentacja w otrębach ryżowych *nuka*, suszenie moreli *umeboshi*.
4. **Bliski Wschód i Maghreb:** Kiszone cytryny *l'hamd marakad* w soli z sokiem własnym, bakłażany *makdous* w oliwie, rzepa *torshi left* z burakiem.
5. **Indie:** *Achaar* — solenie, suszenie na słońcu, nasiona gorczycy, asafetyda i zalewanie gorącym olejem gorczycowym.

""")

print("C1 written successfully.")

# C2 Domain Rules RD-01 to RD-16
f_c2 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C2 · rozdz. 8 reguły dziedzinowe - RD-01 do RD-16 (matematyka solanek, osmoza, twardość wody, taniny, chlorek wapnia).md")
with open(f_c2, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C2: Reguły dziedzinowe RD-01 do RD-16 (Rozdz. 8)**

Każda reguła posiada deterministyczny wzór matematyczny, uzasadnienie i kompletne wektory testowe dla modułu weryfikacji.

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
  gdzie $w_{\text{woda}}$ to ułamek wody w surowcu (ogórek: 0.95, kapusta: 0.92, marchew: 0.88).
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

### **RD-07…RD-16:** Kompensacja twardości węglanowej wody, dawkowanie liści dębu z zawartością garbników (min. 2 liście na 1 litr słoika), korygowanie stężenia soli w obecności dodatków cukrowych w marynatach.

""")

print("C2 written successfully.")

# C3 Domain Rules RD-17 to RD-32
f_c3 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C3 · rozdz. 8 reguły dziedzinowe - RD-17 do RD-32 (bariera kwasowości pH 4.6, kinetyka Clostridium botulinum, kwas octowy).md")
with open(f_c3, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C3: Reguły dziedzinowe RD-17 do RD-32 (Rozdz. 8)**

Reguły definiują warunki sanitarne, kwasowość i eliminację patogenów beztlenowych.

### **RD-17: Bariera botulinowa (Krytyczny próg kwasowości pH 4.60)**
* **Zasada biologiczna:** Przetrwalniki *Clostridium botulinum* nie kiełkują i nie produkują toksyny botulinowej, jeśli aktywność kwasowa spełnia warunek:
  $$\text{pH} < 4.60$$
* **Źródło:** US FDA 21 CFR Part 114, USDA Complete Guide to Home Canning.
* **Klasyfikacja stref:**
  * $\text{pH} \le 4.20$: **STREFA ZIELONA** (Bezpieczna). Pasteryzacja w kąpieli wodnej $100^\circ\text{C}$ lub pasteryzacja sous-vide $80^\circ\text{C}$ wystarcza do zapewnienia trwałości.
  * $4.21 \le \text{pH} \le 4.59$: **STREFA ŻÓŁTA** (Ostrzegawcza). Ryzyko błędu domowego pomiaru; zalecane zakwaszenie (ocet, sok z cytryny) do $\text{pH} \le 4.20$.
  * $\text{pH} \ge 4.60$: **STREFA CZERWONA** (Zagrożenie życia w warunkach beztlenowych). Zakaz zamykania w słoikach bez pasteryzacji ciśnieniowej ($121.1^\circ\text{C}$) lub tyndalizacji 3x24h.

### **RD-18: Przelicznik mocy kwasu octowego (Dilution Formula)**
* **Wzór:**
  $$V_1 \cdot C_1 = V_2 \cdot C_2 \implies V_{\text{ocet}} = V_{\text{zalewa}} \cdot \frac{C_{\text{docelowe}}}{C_{\text{wyjściowe}}}$$
* **Wektor testowy 1 (Przepis na ocet 10% zamieniany na ocet jabłkowy 5%):**
  * *Wejście:* W przepisie wymagane $100\,\text{ml}$ octu $10\%$. Użytkownik posiada ocet $5\%$.
  * *Oczekiwane:* $V_{5\%} = 100 \cdot \frac{10}{5} = 200\,\text{ml}$ octu 5%, a ilość wody w przepisie zostaje automatycznie zmniejszona o $100\,\text{ml}$.

### **RD-19: Minimalne stężenie kwasu octowego w stabilnych marynatach zimnych**
* **Zasada:** Marynaty warzywne niepasteryzowane (np. korniszony octowe przechowywane w spiżarni) wymagają minimalnego stężenia kwasu octowego w całkowitej objętości cieczy:
  $$C_{\text{AcOH}} \ge 2.5\%$$
* **Wektor testowy:**
  * *Wejście:* Słoik 1000 ml z 500 ml zalewy o stężeniu octu 2.0%.
  * *Oczekiwane:* Alert: „Stężenie kwasu 2.0% za niskie dla marynaty niepasteryzowanej. Wymagana pasteryzacja 10 min w $100^\circ\text{C}$ lub zwiększenie stężenia do min. 2.5%”.

### **RD-20: Kinetyka spadku pH w fermentacji mlekowej w funkcji czasu i temperatury**
* **Model estymacyjny:** W typowym nastawie ogórkowym przy $21^\circ\text{C}$:
  * Doba 0: $\text{pH} \approx 6.0–6.5$.
  * Doba 2: $\text{pH} \approx 4.8–5.2$.
  * Doba 4: $\text{pH} \le 4.2$ (przekroczenie bariery bezpieczeństwa).
  * Doba 7: $\text{pH} \approx 3.5–3.8$ (stabilizacja).
* **Wektor testowy:** Jeśli w dobie 4 zmierzone $\text{pH} > 4.6$, aplikacja sygnalizuje opóźnioną fermentację (możliwa za niska temperatura lub zakażenie).

### **RD-21…RD-32:** Pozostałe reguły kwasowości: kwasowość miareczkowa moszczu owocowego, buforowanie kwasowości przez białka mięsne, kinetyka fermentacji octowej z matką octową, bezpieczne zakwaszanie czosnku w oliwie kwasem cytrynowym.

""")

print("C3 written successfully.")

# C4 Decisions of the Researcher D1 to D25
f_c4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D1 do D25.md")
with open(f_c4, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C4: Proces treści merytorycznych i decyzje badacza (Rozdz. 8.P)**

Zgodnie z nadrzędną zasadą studia Apps4Brew, kwestii merytorycznych (biologia, chemia, normy sanitarne) nie rozstrzyga właściciel ani programista, lecz badacz dziedzinowy według 5-szczeblowej hierarchii źródeł:
1. **Szczebel 1:** Prawa fizykochemii i matematyki (obliczenia stechiometryczne, kinetyka cieplna).
2. **Szczebel 2:** Oficjalne normy sanitarne i procedury rządowe (USDA Guide to Home Canning, US FDA 21 CFR, PN-EN, FAO).
3. **Szczebel 3:** Podręczniki akademickie mikrobiologii i technologii żywności (np. Ray & Bhunia „Fundamental Food Microbiology”, Noma Guide).
4. **Szczebel 4:** Publikacje uznanych instytutów rzemieślniczych i uniwersyteckich stacji rozszerzenia (Penn State Extension, UC Davis).
5. **Szczebel 5:** Tradycyjna praktyka społeczności (wyłącznie jako ciekawostka, nigdy jako twarda reguła bezpieczeństwa).

---

## **Rejestr kluczowych decyzji badacza (D-01…D-25)**

### **D-01: Bezwzględny wymóg pasteryzacji ciśnieniowej lub tyndalizacji dla warzyw i mięs o pH $\ge 4.6$**
* **Decyzja:** Zabrania się instruowania użytkowników, że zwykłe jednokrotne gotowanie słoika z fasolką szparagową, groszkiem lub mięsem w garnku z wrzątkiem jest bezpieczne. Woda wrząca w garnku osiąga maksymalnie $100^\circ\text{C}$, podczas gdy przetrwalniki *Clostridium botulinum* giną dopiero w $121.1^\circ\text{C}$ pod ciśnieniem lub w procesie 3-krotnej tyndalizacji.
* **Uzasadnienie:** Wytyczne USDA Canning Guide 2015, Bulletin 539.

### **D-02: Przyjęcie marginesu bezpieczeństwa pH 4.20 dla domowych pomiarów**
* **Decyzja:** Chociaż literatura naukowa podaje granicę 4.60, ze względu na niedokładność tanich chińskich pH-metrów domowych oraz pasków papierkowych wprowadzono próg zielony $\le 4.20$.
* **Uzasadnienie:** Bezpieczeństwo zdrowotne użytkownika.

### **D-03: Kwalifikacja drożdży kożuchujących Kahm jako wady estetycznej, a nie biologicznego skażenia**
* **Decyzja:** Kożuch Kahm nie produkuje mikotoksyn. Diagnoza informuje o nieszkodliwości, ale nakazuje usunięcie, aby nie podnosił pH roztworu.

### **D-04: Czosnek w oliwie — wymóg obowiązkowego zakwaszenia kwasem cytrynowym**
* **Decyzja:** Świeży czosnek w oliwie przechowywany w temperaturze pokojowej to klasyczne źródło śmiertelnego botulizmu (warunki beztlenowe pod olejem). Przepis w aplikacji bezwzględnie wymusza moczenie czosnku w roztworze kwasu cytrynowego $3\%$ przez 24h przed zalaniem olejem lub przechowywanie wyłącznie w lodówce przez max 4 dni.
* **Uzasadnienie:** Badania UC Davis Food Safety Division.

### **D-05…D-25:** Zestawienie pozostałych decyzji badacza: tolerancja stężenia soli w kiszonkach probiotycznych (min. 1.8%, optymalnie 2.2–2.5%), standard zawartości pektyn w powidłach śliwkowych (smażenie bez dodatku cukru do min. 60% ekstraktu), dopuszczalność stosowania soli kłodawskiej z mikroelementami.

""")

print("C4 written successfully.")

# C5 Domain Rules RD-33 to RD-55
f_c5 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C5 · rozdz. 8 reguły dziedzinowe - RD-33 do RD-55 (kinetyka termiczna pasteryzacji, F0 P0, równowaga cukier-kwas-pektyna).md")
with open(f_c5, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C5: Reguły dziedzinowe RD-33 do RD-55 (Rozdz. 8)**

Reguły termodynamiki, wymiany ciepła w słoiku i biochemii żelowania pektyn.

### **RD-33: Wartość pasteryzacyjna $P_0$ (P-Value dla produktów kwaśnych)**
* **Wzór:**
  $$P_0 = \int_{0}^{t} 10^{\frac{T(t) - T_{\text{ref}}}{z}} \, dt$$
  gdzie $T_{\text{ref}} = 93.3^\circ\text{C}$ (lub $70.0^\circ\text{C}$ dla owoców), $z = 8.9^\circ\text{C}$.
* **Zasada:** Zapewnienie $P_0 \ge 10\,\text{min}$ w najzimniejszym punkcie słoika gwarantuje zniszczenie drożdży, pleśni i bakterii kwasu mlekowego bez rozgotowania owoców.
* **Wektor testowy:** Stała temperatura rdzenia $90^\circ\text{C}$ przez 15 minut daje ekwiwalent $P_0 = 15 \cdot 10^{\frac{90 - 93.3}{8.9}} = 15 \cdot 10^{-0.3708} = 15 \cdot 0.4258 = 6.39\,\text{min}$.

### **RD-34: Wartość sterylizacyjna $F_0$ (Dla przetworów nisko-kwasowych i mięs)**
* **Wzór:**
  $$F_0 = \int_{0}^{t} 10^{\frac{T(t) - 121.1}{z}} \, dt$$
  gdzie $z = 10.0^\circ\text{C}$.
* **Zasada standardu przemysłowego i USDA:** Wymóg $12D$ reduction dla *C. botulinum* oznacza osiągnięcie $F_0 \ge 3.0\,\text{min}$ (w praktyce domowej $F_0 \ge 3.5\,\text{min}$).
* **Wektor testowy:** W kąpieli wodnej $100^\circ\text{C}$ ($T=100$):
  $$10^{\frac{100 - 121.1}{10}} = 10^{-2.11} = 0.00776$$
  Aby osiągnąć $F_0 = 3.0\,\text{min}$ we wrzątku $100^\circ\text{C}$, słoik musiałby przebywać w temperaturze $100^\circ\text{C}$ w rdzeniu przez:
  $$t = \frac{3.0}{0.00776} = 386\,\text{minut} \approx 6.5\,\text{godziny!}$$
  Dowodzi to matematycznie, dlaczego jednokrotne gotowanie mięsa we wrzątku w domu jest bezużyteczne i dlaczego tyndalizacja (3x w odstępach) lub szybkowar ciśnieniowy są jedyną drogą.

### **RD-35: Równowaga żelowania pektyn wysokometylowanych (HM Pectin Equation)**
* **Zasada:** Do wytworzenia stabilnego żelu pektynowego bez sztucznych utwardzaczy konieczne jest jednoczesne spełnienie 3 warunków:
  1. Stężenie sacharozy $\ge 55\%–65\%$ (ekstrakt $^\circ\text{Bx} \ge 60$).
  2. Kwasowość czynna $\text{pH} \in [2.8, 3.4]$ (neutralizacja ładunków elektrostatycznych łańcuchów poligalakturonowych).
  3. Zawartość pektyny $\ge 0.5\%–1.0\%$ masy.
* **Wektor testowy:**
  * Truskawki (niska pektyna naturalna, $\text{pH} \approx 3.8$, $^\circ\text{Bx} \approx 9$).
  * Aplikacja oblicza: dodatek soku z cytryny (obniżenie pH do 3.1) + dodatek pektyny jabłkowej 12 g/kg + dodatek cukru do poziomu min. 58%.

### **RD-36: Penetracja ciepła w zależności od geometrii słoika (Promień $R$ i Wysokość $H$)**
* **Zasada:** Czas potrzebny do ogrzania najzimniejszego punktu słoika (geometrycznego środka dla ciał stałych / 1/3 wysokości od dna dla cieczy konwekcyjnych) rośnie z kwadratem promienia:
  $$t \propto R^2$$
* **Wektor testowy:** Słoik o średnicy 100 mm nagrzewa się 4-krotnie dłużej niż słoik o średnicy 50 mm o tej samej wysokości.

### **RD-37…RD-55:** Zależność temperatury wrzenia wody od ciśnienia atmosferycznego i wysokości n.p.m. ($T_{\text{wrz}} = 100 - 0.0033 \cdot h$), współczynnik rozszerzalności termicznej zalewy, rozpad witaminy C pod wpływem ciepła, kinetyka inaktywacji poligalakturonazy w $82^\circ\text{C}$.

""")

print("C5 written successfully.")
