# -*- coding: utf-8 -*-
"""
Generator for Kiszonki BRD 0.1 - Part B (Tools & Functional Requirements BR-xxx)
Chapters B1 to B8
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# B1 Solanki
f_b1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B1 · rozdz. 7 narzędzia - Kalkulatory solanek (masowe vs objętościowe, całkowita masa nastawu) i rozkładu soli.md")
with open(f_b1, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B1: Kalkulatory solanek i rozkładu soli (Rozdz. 7)**

Moduł odpowiada za eliminację błędów w dawkowaniu soli. Obejmuje wymagania od `BR-SOL-001` do `BR-SOL-032`.

### **BR-SOL-001: Kalkulator stężenia solanki w całkowitej masie nastawu ($M_{tot}$)**
* **Opis:** Użytkownik podaje masę przygotowanych warzyw/owoców oraz masę planowanej do dolania wody (lub pojemność słoika). Silnik wylicza wymaganą masę soli $M_{\text{sól}}$ wg wzoru:
  $$M_{\text{sól}} = \frac{p}{100 - p} \cdot (M_{\text{warzywa}} + M_{\text{woda}})$$
  gdzie $p$ to pożądane stężenie soli w % (np. $2.2\%$).
* **Persona:** P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:**
  1. Przy $M_{\text{warzywa}} = 600\,\text{g}$, $M_{\text{woda}} = 400\,\text{g}$ i $p = 2.0\%$, kalkulator zwraca dokładnie $20.4\,\text{g}$ soli (zaokrąglane do $0.1\,\text{g}$ lub $1\,\text{g}$ wg preferencji).
  2. Wskaźnik interaktywny dynamicznie przelicza wartości przy przesuwaniu suwaka lub wpisywaniu w polu numerycznym.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-002: Tradycyjny kalkulator stężenia solanki zalewowej (% masowy w wodzie)**
* **Opis:** Klasyczny kalkulator dla użytkowników przyzwyczajonych do przepisów typu „30 g soli na 1 litr wody”.
* **Persona:** P2 (Babcia Stasia).
* **Kryteria akceptacji:**
  1. Przy podaniu objętości wody $V = 1000\,\text{ml}$ i $p = 3.0\%$, kalkulator zwraca $30.0\,\text{g}$ soli.
  2. Pod wynikiem wyświetla się wyraźna wskazówka informacyjna: „Uwaga: po wlaniu do słoika z ogórkami realne stężenie soli spadnie do ok. 1.3–1.5%”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-003: Symulator stanu równowagi osmotycznej po 48h i 14 dniach**
* **Opis:** Oblicza teoretyczne stężenie soli w tkance warzywa i w roztworze po zakończeniu dyfuzji osmotycznej, uwzględniając zawartość wody w surowcu (ogórki 95%, kapusta 92%, marchew 88%).
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Wyświetlenie wykresu słupkowego stanu początkowego vs stanu równowagi.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SOL-004: Selektor i przelicznik typów soli spożywczej**
* **Opis:** Użytkownik wybiera rodzaj używanej soli: kamienna kłodawska niejodowana, morska gruboziarnista, sól koszerna (Diamond Crystal / Morton), sól warzona drobna. Silnik przelicza gęstość nasypową przy odmierzaniu łyżkami.
* **Persona:** P2, P1.
* **Kryteria akceptacji:** Wybór soli z antyzbrylaczem ($E536$ żelazocyjanek potasu) wyświetla ostrzeżenie: „Antyzbrylacz może powodować zmętnienie solanki i szary osad na dnie”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-005: Kalkulator solenia na sucho (Dry-Salting) dla kapusty i kimchi**
* **Opis:** Oblicza wagę soli niezbędną do zasolenia szatkowanej kapusty (standardowo 2.0%–2.5% masy kapusty) w celu uwolnienia soków komórkowych bez dodawania ani kropli wody.
* **Persona:** P2 (Babcia Stasia), P1 (Tomek).
* **Kryteria akceptacji:** Wpisanie 5.0 kg kapusty przy stężeniu 2.2% zwraca 110 g soli oraz sugerowany czas ugniatania (15–20 minut do całkowitego pokrycia sokiem).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-006: Dozownik soli pektynującej — Chlorek wapnia ($CaCl_2$)**
* **Opis:** Oblicza apteczną dawkę chlorku wapnia spożywczego ($0.05\% - 0.1\%$ masy) do zapobiegania mięknięciu enzymatycznemu ogórków konserwowych i kiszonych.
* **Persona:** P1 (Tomek).
* **Kryteria akceptacji:** Zabezpieczenie przed przedawkowaniem: dawka $>0.15\%$ wywołuje alarm o gorzkim, metalicznym posmaku.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SOL-007: Kalkulator dodatków garbnikowych (Tanin)**
* **Opis:** Sugeruje liczbę liści dębu, wiśni, porzeczki lub chrzanu na 1 litr słoika, hamujących poligalakturonazę (enzym rozkładający pektyny).
* **Persona:** P2, P1.
* **Kryteria akceptacji:** Wyświetlenie bazy 6 naturalnych roślin garbnikowych z zalecaną liczbą liści na słój 1L.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SOL-008…BR-SOL-032:** Pozostałe wymagania modułu solanek: obsługa jednostek imperialnych (uncje, funty, łyżki stołowe koszerne), kalkulator solanki do pikli jajecznych i mięsnych, kompensacja twardości wody kranowej ($CaCO_3$).

""")

print("B1 written successfully.")

# B2 Monitor Fermentacji
f_b2 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B2 · rozdz. 7 narzędzia - Monitor fermentacji, osie czasu, krzywe fazowe (burzliwa, cicha) i powiadomienia sensoryczne.md")
with open(f_b2, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B2: Monitor fermentacji i osie czasu (Rozdz. 7)**

Moduł odpowiada za prowadzenie partii przez cały cykl biologiczny. Obejmuje wymagania od `BR-FERM-001` do `BR-FERM-038`.

### **BR-FERM-001: Cyfrowa karta partii nastawu (Batch Card)**
* **Opis:** Każdy rozpoczęty nastaw otrzymuje unikalną kartę zawierającą: nazwę, typ surowca, datę i godzinę startu, pojemność naczynia, stężenie soli/cukru, typ naczynia, temperaturę początkową i status mikrobiologiczny.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:** Utworzenie partii wymaga mniej niż 30 sekund w uproszczonym kreatorze.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-002: Dynamiczna oś czasu z podziałem na fazy mikrobiologiczne**
* **Opis:** Oś czasu wizualizuje 3 fazy fermentacji mlekowej:
  1. **Faza 1 (Dni 1–2):** rozwój *Leuconostoc mesenteroides*, powstawanie $CO_2$ i kwasu mlekowego, gwałtowne obniżanie pH.
  2. **Faza 2 (Dni 3–7):** faza burzliwa, dominacja *Lactobacillus plantarum* i *Lactobacillus brevis*, intensywne zakwaszanie.
  3. **Faza 3 (Dni 8+):** faza cicha / stabilizacja, dominacja homofermentatywnych pałeczek kwasu mlekowego, dojrzewanie smaku.
* **Persona:** P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:** Wizualny wskaźnik postępu (pasek z kolorami faz) i opis aktualnych procesów wewnątrz słoika.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-003: Harmonogram alertów o odgazowaniu („odbiciu” / burping)**
* **Opis:** Dla słoików bez rurki fermentacyjnej lub naczynia bez uszczelki hydraulicznej aplikacja generuje lokalne powiadomienia przypominające o uchyleniu wieczka:
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

### **BR-FERM-005: Dziennik zmian sensorycznych partii**
* **Opis:** Użytkownik może dodawać notatki ze zdjęciem, oceną zapachu (świeży, kwaśny, drożdżowy), klarowności solanki i obecności bąbelków $CO_2$.
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Zapis do bazy SQLite z optymalizacją miniatury zdjęcia (JPEG max 1024x1024, kompresja 0.8).
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-FERM-006: Asystent dwuetapowej fermentacji Kombuchy (F1 i F2)**
* **Opis:** Dedykowany tryb dla kombuchy: faza F1 w słoju z tkaniną (7–14 dni) $\to$ powiadomienie o teście smaku $\to$ przejście do F2 (butelkowanie beztlenowe z owocami, 2–4 dni) z alarmem ostrzegającym przed nadmiernym ciśnieniem.
* **Persona:** P3 (Claire).
* **Kryteria akceptacji:** Osobne parametry bezpieczeństwa dla szkła butelek typu swing-top.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-FERM-007…BR-FERM-038:** Pozostałe wymagania monitora: asystent kimchi (etap solenia kapusty w misce + fermentacja w słoiku), monitor zakwasu chlebowego i buraczanego, archiwizacja udanych partii, rejestracja temperatury chłodzenia w lodówce.

""")

print("B2 written successfully.")

# B3 Pasteryzacja
f_b3 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B3 · rozdz. 7 narzędzia - Kalkulator pasteryzacji (kąpiel wodna, piekarnik, sous-vide, tyndalizacja, wartości P0 i F0).md")
with open(f_b3, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B3: Kalkulatory pasteryzacji i obróbki termicznej (Rozdz. 7)**

Moduł odpowiada za eliminację drobnoustrojów i szczelne zamknięcie słoików. Obejmuje wymagania od `BR-PAST-001` do `BR-PAST-035`.

### **BR-PAST-001: Kalkulator pasteryzacji w kąpieli wodnej (Water Bath Canning)**
* **Opis:** Na podstawie typu przetworu (kwaśne owoce, pikle octowe, dżemy, pomidory) oraz pojemności słoika (0.25L, 0.33L, 0.5L, 0.72L, 0.9L, 1.5L) wylicza wymagany czas gotowania w wodzie o temp. $100^\circ\text{C}$ od momentu ponownego zawrzenia.
* **Persona:** P2 (Babcia Stasia), P1 (Tomek).
* **Kryteria akceptacji:**
  * Dżem owocowy w słoiku 0.35L: 10 minut.
  * Korniszony w słoiku 0.9L: 15 minut.
  * Kompot owocowy w słoiku 1.0L: 20 minut.
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

### **BR-PAST-006…BR-PAST-035:** Pozostałe wymagania modułu pasteryzacji: weryfikacja zassania wieczka (test akustyczny „kliknięcia” i wklęsłości), kompensacja wysokości n.p.m., ostrzeżenia przed szokiem termicznym (zakaz stawiania gorących słoików na zimnym kamiennym blacie).

""")

print("B3 written successfully.")

# B4 Spiżarnia i Etykiety
f_b4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B4 · rozdz. 7 narzędzia - Spiżarnia i zarządzanie partiami (Batch Tracker), etykiety z kodami QR i ubywanie zapasów.md")
with open(f_b4, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B4: Spiżarnia i zarządzanie partiami (Rozdz. 7)**

Moduł odpowiada za cyfrową ewidencję gotowych przetworów. Obejmuje wymagania od `BR-SPIN-001` do `BR-SPIN-036`.

### **BR-SPIN-001: Widok Spiżarni z podziałem na kategorie i lokalizacje**
* **Opis:** Katalog przetworów pogrupowany według: Kiszonki, Pikle octowe, Dżemy i konfitury, Przetwory pomidorowe, Mięsa i ryby, Napoje fermentowane. Opcjonalny podział na lokalizacje (Piwnica, Spiżarnia kuchenna, Półka w garażu, Lodówka).
* **Persona:** P2 (Babcia Stasia), P1, P3.
* **Kryteria akceptacji:** Licznik łącznej liczby słoików i sumarycznej objętości (np. „142 słoiki, 78 litrów zapasów”).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-002: Szybkie zmniejszanie stanu magazynowego („-1 słoik”)**
* **Opis:** Jedno dotknięcie na liście zmniejsza stan danej partii o 1 sztukę (np. po wyniesieniu ze spiżarni do obiadu). Po osiągnięciu 0 partia automatycznie przechodzi do zakładki „Zużyte” z opcją powtórzenia przepisu.
* **Persona:** P2 (Babcia Stasia).
* **Kryteria akceptacji:** Animacja potwierdzająca i możliwość natychmiastowego cofnięcia (Undo) przez 5 sekund.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-003: Generator etykiet na słoiki (PNG do udostępnienia w MVP)**
* **Opis:** Generuje estetyczną, czytelną etykietę graficzną w formacie PNG zawierającą: nazwę przetworu, rocznik i datę, rodzaj solanki/cukru, piktogram ostrości/kwaśności oraz kod identyfikacyjny partii.
* **Persona:** P2, P3.
* **Kryteria akceptacji:** Etykieta generowana lokalnie na urządzeniu w rozdzielczości 300 DPI, gotowa do wysłania do drukarki AirPrint lub zapisania w galerii zdjęć.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-004: Obsługa kodów URI i kodów QR partii**
* **Opis:** Etykieta zawiera unikalny kod QR kodujący głęboki link URL (`sloik://batch/<id>`). Zeskanowanie aparatem iPhone'a natychmiast otwiera aplikację bezpośrednio na karcie danego słoika.
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Działa w 100% offline bez udziału zewnętrznych serwerów.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SPIN-005…BR-SPIN-036:** Pozostałe wymagania spiżarni: powiadomienia o zbliżającym się terminie optymalnej dojrzałości, kalkulacja kosztu surowców na 1 słoik, eksport listy spiżarni do arkusza CSV.

""")

print("B4 written successfully.")

# B5 Naczynia i Headspace
f_b5 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B5 · rozdz. 7 narzędzia - Baza naczyń, słoików (Weck, Twist-Off, Mason, Kamionka) i kontrola przestrzeni nagłownej (headspace).md")
with open(f_b5, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B5: Baza naczyń i przestrzeń nagłowna (Headspace) (Rozdz. 7)**

Moduł odpowiada za geometrię i fizykę naczyń. Obejmuje wymagania od `BR-NACZ-001` do `BR-NACZ-024`.

### **BR-NACZ-001: Baza 25 predefiniowanych typów naczyń i słoików**
* **Opis:** Zawiera modele geometryczne i charakterystyki fizyczne:
  * Słoiki Weck (tulip, proste, cylinder) ze spinkami i gumkami.
  * Słoiki Twist-Off (wieczka 4-zaczepowe, 6-zaczepowe z przyciskiem próżniowym).
  * Słoiki typu Mason / Ball (wieczko dwuczęściowe z pierścieniem gwintowanym).
  * Słoiki z klamrą drutową Fido / Kilner.
  * Kamionki fermentacyjne tradycyjne oraz kamionki z rowkiem wodnym.
* **Persona:** P1, P2, P3.
* **Kryteria akceptacji:** Wybór naczynia automatycznie dobiera wytyczne dokręcania i pasteryzacji.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-002: Dynamiczny kalkulator przestrzeni nagłownej (Headspace Calculator)**
* **Opis:** Wylicza precyzyjny dystans od lustra cieczy do krawędzi szyjki słoika:
  * Pikle i kiszonki solankowe: $1.2–1.5\,\text{cm}$.
  * Dżemy i powidła pektynowe: $0.6–1.0\,\text{cm}$.
  * Mięsa i pasztety: $2.0–2.5\,\text{cm}$ (ze względu na rozszerzalność cieplną tłuszczu i białek).
* **Persona:** P1, P4.
* **Kryteria akceptacji:** Wizualny schemat słoika z miarką w milimetrach pokazujący poziom napełnienia.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-003: Zasada dokręcania „Fingertip Tight” dla słoików Mason i Twist-off**
* **Opis:** Instruktaż i weryfikacja stopnia dokręcenia wieczek przed pasteryzacją (zbyt mocne dokręcenie uniemożliwia ujście rozszerzającego się powietrza i prowadzi do wygięcia wieczka lub pęknięcia słoika; zbyt lekkie powoduje zalanie słoika wodą z kąpieli).
* **Persona:** P1, P2.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-004…BR-NACZ-024:** Dobór średnicy i wagi docisku szklanego (fermentation weight), obsługa słoików niestandardowych (własna pojemność w ml).

""")

print("B5 written successfully.")

# B6 Refraktometria i pH
f_b6 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B6 · rozdz. 7 narzędzia - Refraktometria Brix, pH-metria i pomiary kwasowości miareczkowej (TA).md")
with open(f_b6, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B6: Refraktometria Brix i pH-metria (Rozdz. 7)**

Moduł odpowiada za analizę laboratoryjną. Obejmuje wymagania od `BR-BRIX-001` do `BR-BRIX-020`.

### **BR-BRIX-001: Cyfrowy rejestrator kwasowości pH z kompasem bezpieczeństwa**
* **Opis:** Użytkownik wprowadza zmierzoną wartość pH (z papierka lakmusowego lub cyfrowego pH-metru).
* **Persona:** P1 (Tomek), P4 (Marek).
* **Kryteria akceptacji:**
  * $pH \le 4.2$: Kolor zielony — „Bezpieczne, w pełni zakwaszone”.
  * $4.21 \le pH \le 4.59$: Kolor żółty — „Strefa przejściowa, kontynuuj fermentację lub dokwaś”.
  * $pH \ge 4.60$: Kolor czerwony z ikoną ostrzeżenia — „Ryzyko botulizmu! Wymagana sterylizacja ciśnieniowa lub zakwaszenie”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-BRIX-002: Kalkulator stopni Brix ($^\circ\text{Bx}$) i punktu żelowania dżemu**
* **Opis:** Przelicza odczyt refraktometru na zawartość sacharozy i przewiduje stabilność mikrobiologiczną dżemu bez pasteryzacji:
  * $\ge 65^\circ\text{Bx}$: trwałość osmotyczna (wysoki cukier hamuje rozwój pleśni i bakterii).
  * $< 60^\circ\text{Bx}$: obowiązkowa pasteryzacja termiczna.
* **Persona:** P2 (Babcia Stasia), P3.
* **Kryteria akceptacji:** Wyliczanie wymaganego dodatku pektyn w zależności od wyjściowego Brix owoców.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-BRIX-003…BR-BRIX-020:** Kompensacja temperatury odczytów refraktometru ($20^\circ\text{C}$ jako punkt odniesienia), obliczanie kwasowości miareczkowej (TA w g/l kwasu mlekowego lub octowego).

""")

print("B6 written successfully.")

# B7 Apple Watch & Hands-Free
f_b7 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B7 · rozdz. 7 narzędzia - Asystent Apple Watch, Live Activity, widżety i skróty Siri (Hands-Free w kuchni).md")
with open(f_b7, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B7: Apple Watch i kuchenne Hands-Free (Rozdz. 7)**

Moduł odpowiada za komfort pracy w kuchni. Obejmuje wymagania od `BR-ZEG-001` do `BR-ZEG-022`.

### **BR-ZEG-001: Samodzielny stoper pasteryzacji na watchOS**
* **Opis:** Aplikacja na Apple Watch pozwala wybrać objętość słoika, typ przetworu i uruchomić stoper jednym stuknięciem.
* **Persona:** P1, P2.
* **Kryteria akceptacji:** Działa w pełni autonomicznie, synchronizując wynik z iPhonem przez `WatchConnectivity` po zakończeniu sesji.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-002: Sterowanie czasem pasteryzacji cyfrową koronką (Digital Crown)**
* **Opis:** Obrót cyfrową koronką precyzyjnie zmienia czas o 1 minutę z wyraźnym przeskokiem haptycznym (Haptic Feedback).
* **Persona:** P1.
* **Kryteria akceptacji:** Umożliwia precyzyjne ustawienie czasu mokrymi dłońmi bez dotykania ekranu dotykowego.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-003: Live Activity i Dynamic Island na iPhonie**
* **Opis:** Aktywna pasteryzacja lub odliczanie minut do odgazowania wyświetla się na żywo na ekranie blokady i w Dynamic Island (czas pozostały, nazwa słoika, faza procesu).
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Aktualizacja co 1 sekundę bez drenowania baterii.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-004: Skróty głosowe Siri („Hej Siri, ile zostało do końca wekowania?”)**
* **Opis:** Integracja z Apple App Intents: odpytanie o status trwającej pasteryzacji oraz głosowe odhaczanie odgazowania słoika.
* **Persona:** P1, P5 (Ewa).
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-ZEG-005…BR-ZEG-022:** Komplikacje tarczy zegarka (liczba aktywnych fermentacji w toku), powiadomienia krytyczne (Critical Alerts) o zakończeniu gotowania.

""")

print("B7 written successfully.")

# B8 Diagnostyk Troubleshooting Doctor
f_b8 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B8 · rozdz. 7 narzędzia - Diagnostyk problemów przetwórstwa (Troubleshooting Doctor pleśń vs kożuch kahm, mięknięcie, mętność).md")
with open(f_b8, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B8: Diagnostyk problemów przetwórstwa (Troubleshooting Doctor) (Rozdz. 7)**

Moduł odpowiada za ratowanie nastawów i zapobieganie zatruciom. Obejmuje wymagania od `BR-DOK-001` do `BR-DOK-018`.

### **BR-DOK-001: Interaktywne drzewo decyzyjne analizy defektów nastawu**
* **Opis:** Użytkownik wybiera symptom z listy (biały nalot, zmętnienie, brak bąbelków, zapach acetonu, zgnilizna, mięknięcie, spuchnięte wieczko, brak zassania). Aplikacja zadaje 2–3 pytania uściślające i podaje jednoznaczną diagnozę.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:** 100% deterministyczny algorytm decyzyjny (brak losowości, brak generatywnego AI).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-002: Różnicowanie: Drożdże kożuchujące (Kahm) vs Pleśń toksyczna**
* **Opis:** Kluczowy węzeł diagnostyczny:
  * Pytanie 1: Czy nalot jest płaską, matową błoną (siatką) na powierzchni cieczy, czy puszystym „kożuchem/meszkiem”?
  * Pytanie 2: Jaki ma kolor? (Biały/kremowy $\to$ Kahm; Zielony/czarny/różowy $\to$ Pleśń).
  * Diagnoza Kahm: instrukcja usunięcia wyparzoną łyżką, dolania solanki, wygotowania docisku.
  * Diagnoza Pleśń: bezwzględny nakaz wyrzucenia całego słoika (toksyny w całej objętości).
* **Persona:** P1, P2, P3.
* **Kryteria akceptacji:** Zdjęcia referencyjne o wysokiej rozdzielczości obrazujące różnice makroskopowe.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-003: Diagnoza mięknięcia ogórków (Enzymy pektynolityczne vs Brak soli)**
* **Opis:** Analiza przyczyn miękkiej, gąbczastej struktury kiszonki: za niskie stężenie soli ($<1.5\%$), zbyt wysoka temperatura początkowa ($>25^\circ\text{C}$), brak garbników lub obecność kwiatów na ogórkach.
* **Persona:** P2 (Babcia Stasia).
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-004…BR-DOK-018:** Diagnoza zielenienia czosnku, mętności octu (tworzenie matki octowej vs zakażenie), śluzowacenia solanki (Leuconostoc dextranicum), pękania słoików przy stygnięciu.

""")

print("B8 written successfully.")
