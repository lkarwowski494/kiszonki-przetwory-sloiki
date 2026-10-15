# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C3: Reguły dziedzinowe RD-17 do RD-32 (Rozdz. 8)**

Reguły definiują warunki sanitarne, kwasowość i eliminację patogenów beztlenowych.

---

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

### **RD-21…RD-32: Kompletny katalog reguł kwasowości:**
* `RD-21`: Kwasowość miareczkowa (TA) moszczu jabłkowego do produkcji octu: przeliczanie na gramy kwasu jabłkowego na litr.
* `RD-22`: Stechiometria utleniania etanolu do kwasu octowego przez bakterie Acetobacter: z 1 g etanolu powstaje ok. 1.3 g kwasu octowego.
* `RD-23`: Buforowanie kwasowości przez białka mięsne: mięso wymaga 3-krotnie większego stężenia kwasu niż warzywa do obniżenia pH o 1 jednostkę.
* `RD-24`: Bezpieczne zakwaszanie czosnku w oliwie: moczenie w 3% kwasie cytrynowym obniża pH rdzenia ząbka czosnku do $<4.0$.
* `RD-25`: Kwasowość wina używanego jako baza do octu winnego (wymóg stężenia alkoholu $6\%–8\%$).
* `RD-26`: Spadek pH pod wpływem dwutlenku węgla rozpuszczonego w kombuchy ($H_2CO_3$).
* `RD-27`: Wpływ kwasowości na inaktywację enzymów brunatnienia (polifenolooksydaza traci aktywność przy $\text{pH} < 3.5$).
* `RD-28`: Korekta odczytu szklanej elektrody pH-metru względem temperatury roztworu (równanie Nernsta).
* `RD-29`: Stężenie kwasu mlekowego w dojrzałej kapuście kiszonej ($1.2\%–1.8\%$).
* `RD-30`: Stosunek kwasu mlekowego do octowego w fermentacjach heterofermentatywnych (optymalne ratio sensoryczne $4:1$).
* `RD-31`: Hamowanie wzrostu drożdży kożuchujących Kahm przy pH $< 3.2$.
* `RD-32`: Wpływ kwasu askorbinowego na potencjał redox solanki fermentacyjnej.

