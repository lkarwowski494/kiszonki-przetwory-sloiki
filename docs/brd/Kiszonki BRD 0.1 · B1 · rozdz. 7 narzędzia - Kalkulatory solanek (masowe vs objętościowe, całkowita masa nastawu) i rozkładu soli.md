# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B1: Kalkulatory solanek i rozkładu soli (Rozdz. 7)**

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

