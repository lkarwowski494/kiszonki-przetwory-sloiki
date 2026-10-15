# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C2: Reguły dziedzinowe RD-01 do RD-16 (Rozdz. 8)**

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

