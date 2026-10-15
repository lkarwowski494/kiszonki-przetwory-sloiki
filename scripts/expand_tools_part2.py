# -*- coding: utf-8 -*-
"""
Expander for Tools (B3 to B8) and Rules (C3, C5)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# B3 Pasteryzacja Full Detail
f_b3 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B3 · rozdz. 7 narzędzia - Kalkulator pasteryzacji (kąpiel wodna, piekarnik, sous-vide, tyndalizacja, wartości P0 i F0).md")
with open(f_b3, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B3: Kalkulatory pasteryzacji i obróbki termicznej (Rozdz. 7)**

Moduł odpowiada za eliminację drobnoustrojów i szczelne zamknięcie słoików. Obejmuje wymagania od `BR-PAST-001` do `BR-PAST-035`.

---

### **BR-PAST-001: Kalkulator pasteryzacji w kąpieli wodnej (Water Bath Canning)**
* **Opis:** Na podstawie typu przetworu (kwaśne owoce, pikle octowe, dżemy, pomidory) oraz pojemności słoika (0.25L, 0.33L, 0.5L, 0.72L, 0.9L, 1.5L) wylicza wymagany czas gotowania w wodzie o temp. $100^\circ\text{C}$ od momentu ponownego zawrzenia.
* **Persona:** P2 (Babcia Stasia), P1 (Tomek).
* **Kryteria akceptacji:**
  1. Dżem owocowy w słoiku 0.35L: 10 minut.
  2. Korniszony w słoiku 0.9L: 15 minut.
  3. Kompot owocowy w słoiku 1.0L: 20 minut.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-002: Wieloetapowy stoper pasteryzacji z sygnałami akustycznymi i haptycznymi**
* **Opis:** Stoper dzieli proces na fazy:
  1. Faza podgrzewania wody.
  2. Kliknięcie „Woda wrze” $\to$ start odliczania zadanego czasu pasteryzacji.
  3. Faza końcowa: sygnał dźwiękowy i wibracja, instrukcja natychmiastowego wyjęcia słoików na drewnianą deskę lub ściereczkę.
* **Persona:** P2, P5 (Ewa).
* **Kryteria akceptacji:** Działa w tle (Background Mode) i na ekranie blokady (Live Activity).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-003: Asystent tyndalizacji frakcjonowanej (3x gotowanie w odstępie 24h)**
* **Opis:** Prowadzi użytkownika przez procedurę frakcjonowanej sterylizacji przetworów mięsnych, rybnych i warzyw o niskiej kwasowości ($pH \ge 4.6$):
  * Dzień 1: gotowanie 60 minut (zabicie form wegetatywnych).
  * Odpoczynek 24h w temperaturze pokojowej $20–25^\circ\text{C}$ (wykiełkowanie przetrwalników).
  * Dzień 2: gotowanie 40 minut (zabicie nowo wykiełkowanych bakterii).
  * Odpoczynek 24h.
  * Dzień 3: gotowanie 30 minut (ostateczne wyjałowienie).
* **Persona:** P4 (Marek).
* **Kryteria akceptacji:** Aplikacja automatycznie planuje powiadomienia kalendarzowe na Dzień 2 i Dzień 3 z dokładną godziną.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-004: Kalkulator pasteryzacji w piekarniku elektrycznym z korektą czasu**
* **Opis:** Dla osób wybierających piekarnik: wymusza temperaturę $120–130^\circ\text{C}$ i automatycznie wydłuża czas o 150% względem kąpieli wodnej (np. z 15 min do 38 min), wyświetlając ostrzeżenie o ryzyku degradacji uszczelek Weck.
* **Persona:** P2.
* **Kryteria akceptacji:** Ostrzeżenie przed wkładaniem słoików na suchą blachę (wymóg wlania 2 cm wody na blachę).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-PAST-005: Pasteryzacja niskotemperaturowa sous-vide (dla maksymalnej chrupkości)**
* **Opis:** Procedura pasteryzacji pikli w cyrkulatorze sous-vide w temperaturze $77–82^\circ\text{C}$ przez 30 minut. Zapewnia dezaktywację mikroorganizmów i enzymów bez termicznego rozpadu pektyn.
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Wyliczenie ekwiwalentnej wartości pasteryzacyjnej $P_0$.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-PAST-006…BR-PAST-035: Kompletny katalog wymagań pasteryzacji:**
* `BR-PAST-006`: Weryfikacja zassania wieczka (test akustyczny kliknięcia i wklęsłości).
* `BR-PAST-007`: Korekta wrzenia wody względem wysokości n.p.m. ($T_{\text{wrz}} = 100 - 0.0033 \cdot h$).
* `BR-PAST-008`: Ostrzeżenie przed szokiem termicznym (zakaz stawiania gorących słoików na zimnym kamieniu).
* `BR-PAST-009`: Kalkulator sterylizacji pustych słoików i pokrywek przed napełnieniem (10 min we wrzątku).
* `BR-PAST-010`: Wyliczanie wartości sterylizacyjnej $F_0$ dla domowego szybkowaru ciśnieniowego ($116–121^\circ\text{C}$).
* `BR-PAST-011`: Procedura pasteryzacji soków owocowych metodą „gorącego nalewu” (Hot Fill and Hold).
* `BR-PAST-012`: Instrukcja usuwania spinek ze słoików Weck po 24h od ostygnięcia w celu weryfikacji próżni.
* `BR-PAST-013`: Zabezpieczenie przed zbyt gwałtownym studzeniem przetworów pomidorowych.
* `BR-PAST-014`: Monitorowanie temperatury kąpieli wodnej za pomocą termometru z sondą kuchenną.
* `BR-PAST-015`: Alerty dźwiękowe zintegrowane z profilem audio iOS (pomijanie wyciszenia dla alarmów krytycznych).
* `BR-PAST-016`: Kalkulator pasteryzacji przecierów dla niemowląt (restrykcyjne normy czystości).
* `BR-PAST-017`: Obsługa pasteryzacji w kociołkach elektrycznych z termostatem.
* `BR-PAST-018`: Zapisywanie sesji pasteryzacji w relacyjnej tabeli `pasteurization_sessions`.
* `BR-PAST-019`: Dedykowane wytyczne pasteryzacji dyni w occie (zapobieganie rozpadowi miąższu).
* `BR-PAST-020`: Procedura wekowania pasztetów w słoikach prostych (ułatwione wyjmowanie zawartości).
* `BR-PAST-021`: Kompensacja temperatury wsadu początkowego (zimny wsad ze spiżarni vs gorący dżem z garnka).
* `BR-PAST-022`: Zabezpieczenie przed pasteryzacją słoików o uszkodzonych gwintach lub wyszczerbionych krawędziach.
* `BR-PAST-023`: Instrukcja postępowania ze słoikiem, który się nie zassał (ponowna pasteryzacja lub spożycie w 48h).
* `BR-PAST-024`: Wyliczanie zużycia energii elektrycznej i gazu podczas procesu pasteryzacji.
* `BR-PAST-025`: Tryb wielogarowy: równoczesne odliczanie pasteryzacji w dwóch niezależnych naczyniach.
* `BR-PAST-026`: Pasteryzacja syropów z pędów sosny i mniszka lekarskiego.
* `BR-PAST-027`: Kontrola poziomu wody w garnku (min. 2–3 cm ponad górną krawędź wieczek).
* `BR-PAST-028`: Ochrona dna garnka ściereczką lub wkładką silikonową przed bezpośrednim kontaktem z płomieniem.
* `BR-PAST-029`: Dynamiczne powiadomienie na 2 minuty przed końcem pasteryzacji na Apple Watch.
* `BR-PAST-030`: Przelicznik pasteryzacji dla słoików o nietypowych kształtach (słoiki płaskie vs wysokie cylindry).
* `BR-PAST-031`: Rejestracja ciśnienia roboczego szybkowaru (10 PSI vs 15 PSI).
* `BR-PAST-032`: Generowanie certyfikatu pasteryzacji do wglądu w historii partii.
* `BR-PAST-033`: Wykrywanie braku autoryzacji powiadomień w systemie iOS.
* `BR-PAST-034`: Zabezpieczenie przed przypadkowym zresetowaniem timera gestem w dół.
* `BR-PAST-035`: Obsługa pasteryzacji octów domowych w celu zatrzymania pracy matki octowej.

""")

print("Expanded B3 written successfully.")

# C3 and C5 Full Equations
f_c3 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C3 · rozdz. 8 reguły dziedzinowe - RD-17 do RD-32 (bariera kwasowości pH 4.6, kinetyka Clostridium botulinum, kwas octowy).md")
with open(f_c3, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C3: Reguły dziedzinowe RD-17 do RD-32 (Rozdz. 8)**

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

""")

print("Expanded C3 written successfully.")

# C5 Domain Rules RD-33 to RD-55 Full Detail
f_c5 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C5 · rozdz. 8 reguły dziedzinowe - RD-33 do RD-55 (kinetyka termiczna pasteryzacji, F0 P0, równowaga cukier-kwas-pektyna).md")
with open(f_c5, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C5: Reguły dziedzinowe RD-33 do RD-55 (Rozdz. 8)**

Reguły termodynamiki, wymiany ciepła w słoiku i biochemii żelowania pektyn.

---

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

### **RD-37…RD-55: Kompletny katalog reguł termodynamiki i biochemii:**
* `RD-37`: Zależność temperatury wrzenia wody od wysokości n.p.m. i ciśnienia atmosferycznego: $T_{\text{wrz}} = 100 - 0.0033 \cdot h$.
* `RD-38`: Rozszerzalność termiczna roztworów cukrowych: dżem o $65^\circ\text{Bx}$ rozszerza się o 4.2% objętości między $20^\circ\text{C}$ a $100^\circ\text{C}$.
* `RD-39`: Siła docisku sprężyn słoików Weck: spinki ustępują przy nadciśnieniu wewnętrznym $>0.15\,\text{bar}$, działając jak zawór bezpieczeństwa.
* `RD-40`: Wytwarzanie próżni przy stygnięciu słoików Twist-Off: kondensacja pary wodnej w przestrzeni nagłownej tworzy podciśnienie $0.4–0.6\,\text{bar}$.
* `RD-41`: Wskaźnik zassania wieczka (Vacuum Indicator): wklęsłość środka wieczka Twist-off o min. $1.2\,\text{mm}$.
* `RD-42`: Kinetyka degradacji witaminy C: rozpad kwasu askorbinowego zachodzi według kinetyki pierwszorzędowej ($k \approx 0.015\,\text{min}^{-1}$ w $100^\circ\text{C}$).
* `RD-43`: Żelowanie pektyn niskometylowanych (LM Pectin) w dżemach bezcukrowych: mostki wapniowe $Ca^{2+}$ tworzą strukturę „egg-box”.
* `RD-44`: Wpływ konwekcji naturalnej w sokach i kompotach vs przewodzenia ciepła w pasztetach i gęstych przecierach.
* `RD-45`: Krytyczny czas inaktywacji poligalakturonazy w ogórkach ($82^\circ\text{C}$ przez min. 3 minuty).
* `RD-46`: Odporność termiczna kwasu octowego: lotność kwasu podczas wrzenia (konieczność gotowania pod przykryciem).
* `RD-47`: Współczynnik dyfuzji ciepła przez szkło sodowo-wapniowe ($k \approx 0.8–1.0\,\text{W/(m}\cdot\text{K)}$).
* `RD-48`: Równanie Antoine'a dla prężności pary wodnej w przestrzeni nagłownej słoika.
* `RD-49`: Rozpad sacharozy do cukrów inwertowanych (glukoza + fruktoza) w środowisku kwaśnym podczas pasteryzacji dżemów.
* `RD-50`: Stabilność antocyjanów w konfiturach wiśniowych i truskawkowych w funkcji temperatury i pH.
* `RD-51`: Zmiana gęstości zalewy solankowej w funkcji temperatury ($20^\circ\text{C} \to 100^\circ\text{C}$).
* `RD-52`: Ciśnienie nasycenia pary w szybkowarze ciśnieniowym przy $121.1^\circ\text{C}$ (ok. $1.03\,\text{bar}$ nadciśnienia / 15 PSI).
* `RD-53`: Kinetyka kiełkowania przetrwalników *Bacillus* i *Clostridium* w fazie spoczynku tyndalizacji (optimum $22–26^\circ\text{C}$).
* `RD-54`: Wpływ obecności tłuszczu na odporność termiczną mikroorganizmów (ochrona termiczna bakterii przez lipidy).
* `RD-55`: Graniczny poziom ekstraktu dla kandyzowanych owoców w słoiku ($\ge 70^\circ\text{Bx}$).

""")

print("Expanded C5 written successfully.")
