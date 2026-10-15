# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C5: Reguły dziedzinowe RD-33 do RD-55 (Rozdz. 8)**

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

