# -*- coding: utf-8 -*-
"""
Generator for Kiszonki BRD 0.1 - Part A (Chapters 1 to 6.5, 13, 15)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# A1
f_a1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A1 · rozdz. 1–3 (Tożsamość, Persony, Architektura).md")
with open(f_a1, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A1: Wizja, persony, zasady produktu i sytuacje (Rozdz. 1–3)**

## **Rozdział 1: Tożsamość i obietnica produktu**

### **1.1 Wizja produktu**
**Słoik (Jarwise)** to kieszonkowy mistrz domowego przetwórstwa, fermentacji i wekowania, który przenosi precyzję laboratoryjną do domowej spiżarni. Dba o to, by każda kiszonka była chrupka i bezpieczna mikrobiologicznie, każda partia dżemu idealnie zżelowana bez nadmiaru cukru, a każdy wek z mięsem czy warzywami w 100% wolny od groźby jadu kiełbasianego. Prowadzi użytkownika od precyzyjnego odważenia soli i wody, przez asystę w fazie burzliwej i cichej fermentacji, aż po stoper pasteryzacji na Apple Watch i cyfrową ewidencję słoików w spiżarni z etykietami QR.

### **1.2 Obietnica w jednym zdaniu**
> *„Zamknij naturę w słoiku z precyzją nauki — bez zepsutych partii, bez pleśni i bez zgadywania.”*

### **1.3 Pozycjonowanie w portfolio Apps4Brew**
Aplikacja jest naturalnym dopełnieniem rzemieślniczej linii produktów Apps4Brew:
* **Napar (Steepwise):** ekstrakcja specialty, ratio woda-ziarno, TDS, kontrola temperatury.
* **Piekarz (Crust):** procent piekarski, temperatura ciasta (DDT), profilowanie zakwasu, harmonogramy wsteczne.
* **Słoik (Jarwise):** procent solanki, kinetyka fermentacji mlekowej, pH bezpieczeństwa, penetracja termiczna pasteryzacji ($F_0/P_0$), zarządzanie spiżarnią.

### **1.4 16 Nienegocjowalnych Zasad Produktu (ZP-01…ZP-16)**

| # | Zasada | Uzasadnienie i źródło w standardach studia Apps4Brew |
| :--- | :--- | :--- |
| **ZP-01** | **Bezpieczeństwo biologiczne ponad wszystko.** Aplikacja nigdy nie sugeruje procedur stwarzających ryzyko rozwoju *Clostridium botulinum*. Niska kwasowość ($pH \ge 4.6$) w słoiku beztlenowym bez sterylizacji ciśnieniowej lub tyndalizacji jest bezwzględnie blokowana. |
| **ZP-02** | **Zero logowania, zero konta, zero chmury zewnętrznej.** Pełna funkcjonalność dostępna natychmiast po instalacji. Dane nigdy nie opuszczają urządzenia użytkownika (poza prywatnym iCloud użytkownika). |
| **ZP-03** | **Zero reklam i zero śledzenia.** Brak jakichkolwiek SDK reklamowych, analitycznych (Google Analytics, Firebase, Facebook SDK) czy narzędzi profilujących. Odznaka „Data Not Collected” w App Store. |
| **ZP-04** | **Prawdziwa matematyka i chemia (Zero blogowych mitów).** Każdy wzór na stężenie solanki, rozkład masy, molowość kwasu octowego czy czas sterylizacji jest oparty na recenzowanych źródłach naukowych (USDA, FDA, FAO). |
| **ZP-05** | **Kuchenne Hands-Free.** Aplikacja musi dać się obsługiwać z mokrymi dłońmi, w rękawiczkach lub wyłącznie z poziomu zegarka Apple Watch oraz asystenta głosowego Siri. Duże cele dotykowe ($\ge 56\,\text{pt}$). |
| **ZP-06** | **Niezmienność i trwałość danych spiżarni.** Historia partii, nastawów i receptury nigdy nie giną przy aktualizacjach aplikacji. Automatyczna migracja schematów SQLite i kopia zapasowa przed każdą migracją. |
| **ZP-07** | **Kopia zapasowa i eksport zawsze bezpłatne.** Użytkownik ma pełne prawo wyeksportować swoje receptury i stan spiżarni do formatów JSON i CSV w dowolnym momencie, bez wymogu płatnej subskrypcji. |
| **ZP-08** | **Uczciwy model monetyzacji.** Darmowy, w pełni funkcjonalny rdzeń kalkulatorów i bazy wiedzy. Płatna wersja Pro (jednorazowo lub mikro-subskrypcja) rozszerza pojemność spiżarni i zaawansowaną analizę laboratoryjną. |
| **ZP-09** | **Szacunek dla tradycji z całego świata.** Równorzędne traktowanie słowiańskiego kiszenia w kamionkach, koreańskiego kimchi, japońskich pikli nukazuke, indyjskich acharów i francuskich technik confit. |
| **ZP-10** | **Precyzyjny dobór słoików i naczyń.** Uwzględnienie mechaniki fizycznej różnych zamknięć: słoiki Weck (odprowadzanie nadciśnienia sprężynami), Twist-Off (zawór próżniowy w wieczku), kamionki z rowkiem wodnym. |
| **ZP-11** | **Pełna dostępność (Accessibility First).** Zgodność z Apple Human Interface Guidelines: VoiceOver, Dynamic Type do maksymalnych rozmiarów, wysoki kontrast, brak opierania sensu wyłącznie na barwie. |
| **ZP-12** | **Brak treści generowanych przez halucynujące AI.** Wszystkie wskazówki, drzewa diagnostyczne problemów i czasy procesów są deterministyczne i zatwierdzone przez badacza dziedzinowego. |
| **ZP-13** | **Spokojny, rzemieślniczy język.** Zero krzykliwego gamingu, zero sztucznych „streaków”, zero presji czasu. Estetyka inspirowana tradycyjnymi notesami kuchennymi i laboratoriami mikrobiologicznymi. |
| **ZP-14** | **Przenośność i czystość architektury.** Rozdział czystej domeny mikrobiologiczno-matematycznej od warstwy prezentacji. Kod domenowy w 100% testowalny bez zależności od React Native czy Expo. |
| **ZP-15** | **0 zł stałych kosztów serwerowych.** Architektura bezserwerowa gwarantuje, że studio Apps4Brew nie ponosi comiesięcznych kosztów infrastruktury, co zapewnia wieczystą rentowność aplikacji. |
| **ZP-16** | **Lokalne powiadomienia odporne na uśpienie systemu.** Timery pasteryzacji i wielotygodniowe przypomnienia o fermentacji działają w oparciu o natywny system powiadomień iOS i Live Activity. |

---

## **Rozdział 2: Persony i archetypy użytkowników**

### **Persona P1: Tomek — Eksperymentator i Pasjonat Ostrej Fermentacji (34 lata)**
* **Profil:** Starszy programista z Wrocławia, entuzjasta ostrych sosów chili, kimchi i eksperymentów mikrobiologicznych. Czyta fora r/fermentation, zna publikacje Noma.
* **Bóle i frustracje:** „Zrobiłem mash z habanero, dodałem 3% soli na oko, a po 2 tygodniach na wierzchu pojawiła się pleśń. Nie wiedziałem, czy to kożuch Kahm, czy toksyna, i musiałem wyrzucić 2 kg drogich papryk.”
* **Potrzeby w aplikacji:**
  * Kalkulator soli uwzględniający całkowitą wagę warzyw i przypraw.
  * Harmonogram odgazowywania słoików bez rurki fermentacyjnej na Apple Watch.
  * Rejestracja pomiarów pH w czasie (wykres spadku pH z 6.0 do 3.6).

### **Persona P2: Babcia Stasia — Tradycyjna Gospodyni i Królowa Spiżarni (67 lat)**
* **Profil:** Emerytowana nauczycielka ze Skierniewic. Co roku zamyka w słoikach 200 kg ogórków, 50 słoików powideł śliwkowych, paprykę konserwową i grzyby marynowane.
* **Bóle i frustracje:** „Zapominam, ile minut który słoik ma się gotować w garze. Młodzi mówią, że w piekarniku łatwiej, ale popękały mi gumki w Weckach. A w piwnicy znajduję słoiki i nie wiem, czy to rocznik 2022 czy 2024, bo mazak na wieczku się zatarł.”
* **Potrzeby w aplikacji:**
  * Bardzo duży tekst (Dynamic Type) i prosty kalkulator: wybiera rodzaj przetworu i litraż słoika $\to$ aplikacja włącza głośny budzik.
  * Proste etykiety do druku lub czytelna lista „Moja Spiżarnia”.
  * Przelicznik octu ze standardu 10% na łagodniejszy ocet jabłkowy.

### **Persona P3: Claire — Nowoczesna Miejska Fermentatorka Zero-Waste (28 lat)**
* **Profil:** Graficzka z Lyonu. Propaguje styl less-waste, kisi resztki łodyg brokułów, robi kombuchę, water kefir i rzodkiewki w słojach.
* **Bóle i frustracje:** „Moja kombucha w drugiej fermentacji (F2) w butelkach albo nie ma bąbelków, albo mało nie wybuchnie przy otwieraniu. Brakuje mi narzędzia do śledzenia poziomu cukru i czasu karbonizacji.”
* **Potrzeby w aplikacji:**
  * Asystent kombuchy F1 (słodzenie, herbata) i F2 (owoce, ciśnienie $CO_2$).
  * Notatki sensoryczne (kwasowość, słodycz, musowanie).
  * Przepisy na nietypowe kiszonki zero-waste z całego świata.

### **Persona P4: Marek — Rzemieślnik Mięsny i Myśliwy (45 lat)**
* **Profil:** Myśliwy i pasjonat tradycyjnego przetwórstwa mięsnego. Zamyka w słoikach gulasze z dziczyzny, pasztety, kiełbasy słoikowe i ryby w occie.
* **Bóle i frustracje:** „Śmiertelnie boję się botulizmu. Wszędzie w internecie piszą co innego — jedni gotują raz, inni mówią o tyndalizacji, a w amerykańskich książkach piszą, że tylko szybkowar ciśnieniowy. Chcę twardych, naukowych wytycznych.”
* **Potrzeby w aplikacji:**
  * Absolutnie bezkompromisowy kalkulator tyndalizacji (odstępy 24h, temperatury, czasy).
  * Wytyczne sterylizacji ciśnieniowej (PSI, wysokość n.p.m.).
  * Rejestr partii z ostrzeżeniem o konieczności przechowywania w chłodzie.

### **Persona P5: Ewa — Niewidoma Pasjonatka Kulinarna (36 lat)**
* **Profil:** Samodzielna osoba niewidoma, która uwielbia gotować i kisić warzywa. Korzysta z iPhone'a z włączonym czytnikiem VoiceOver.
* **Potrzeby w aplikacji:**
  * Pełne etykiety dostępności: każdy przycisk i pole liczbowe precyzyjnie opisane.
  * Sygnalizacja dźwiękowa i haptyczna etapów gotowania i pasteryzacji.

---

## **Rozdział 3: Kluczowe sytuacje użytkownika (SYT-01…SYT-15)**

* **SYT-01 (Zakupy na targu warzywnym):** Użytkownik kupuje 8 kg ogórków gruntowych. Otwiera aplikację, wpisuje wagę ogórków i docelowe stężenie soli (2.2% całkowitej masy) $\to$ aplikacja podaje dokładnie ile gramów soli kamiennej niejodowanej, ile ząbków czosnku, chrzanu i baldachów kopru potrzebuje, oraz ile słoików 1-litrowych musi przygotować.
* **SYT-02 (Hands-Free w kuchni podczas pasteryzacji):** Użytkownik włożył 6 słoików Weck z powidłami do gara z wrzątkiem. Ręce ma lepkie od śliwek. Podnosi nadgarstek z Apple Watch, stuka „Start pasteryzacji 0.5L” $\to$ zegarek odlicza czas, pokazuje temperaturę wrzenia i wibruje wyrazistym impulsem haptycznym na 2 minuty przed końcem oraz w momencie wyjęcia.
* **SYT-03 (Podejrzenie zepsucia — Doktor Diagnostyk):** Po 5 dniach kiszenia kapusty na powierzchni pojawia się biały nalot. Użytkownik otwiera moduł diagnostyczny, odpowiada na 3 pytania (czy nalot jest płaski czy puszysty, jaki ma zapach, czy warzywa są pod solanką) $\to$ aplikacja rozpoznaje nieszkodliwe drożdże kożuchujące Kahm, instruuje jak je zebrać wyparzoną łyżką i przypomina o wygotowaniu docisku szklanego.
* **SYT-04 (Porządki w piwnicy — skanowanie słoika QR):** Użytkownik znajduje zakurzony słoik na półce w piwnicy. Skanuje aparatem etykietę $\to$ ekran natychmiast wyświetla: „Ogórki kiszone z dębem i czosnkiem niedźwiedzim, nastawione: 18 lipca 2025, solanka 2.3%, pasteryzowane 15 min, zalecane spożycie: do października 2026. Ocena partii: chrupkość 5/5.”
* **SYT-05…SYT-15:** Sytuacje obejmujące odgazowanie słoika kimchi, przygotowanie zalewy octowej z przelicznikiem mocy kwasu, ratowanie zbyt miękkich kiszonek chlorkiem wapnia ($CaCl_2$), produkcję octu jabłkowego z matką octową, butelkowanie kombuchy i sterylizację gulaszu mięsnego.

""")

print("A1 written successfully.")

# A2
f_a2 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A2 · rozdz. 4–6.1 (Rynek, Model przychodu, Zakres).md")
with open(f_a2, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A2: Rynek, model przychodu i zakres funkcjonalny (Rozdz. 4–6.1)**

## **Rozdział 4: Analiza rynku i konkurencji**

### **4.1 Wielkość rynku i trendy makroekonomiczne**
Rynek domowego przetwórstwa, fermentacji i konserwacji żywności przeżywa bezprecedensowy renesans na całym świecie:
1. **Zdrowie jelitowe i mikrobiom:** Globalna świadomość probiotycznych właściwości żywych kiszonek (bakterie kwasu mlekowego LAB) napędza eksplozję domowego kiszenia w USA, Niemczech, Francji i Wielkiej Brytanii.
2. **Kultura rzemiosła i samowystarczalności (Homesteading):** Wzrost cen żywności, inflacja oraz trend zero-waste sprawiają, że miliony gospodarstw domowych powracają do wekowania owoców, warzyw i mięs.
3. **Globalizacja smaków:** Kimchi, kombucha, sosy chili fermentowane (hot sauce mash) i japońskie pikle przestały być domeną niszowych restauracji, a stały się elementem codziennej kuchni miejskiej.

### **4.2 Analiza braków obecnej konkurencji**
Przegląd ponad 3 000 recenzji aplikacji kulinarnych i hobbystycznych ujawnia cztery fundamentalne wady istniejących rozwiązań:
* **Brak narzędzi inżynieryjnych:** Aplikacje kulinarne (np. Tasty, Yummly) zawierają jedynie statyczne przepisy tekstowe w stylu „weź garść soli i słoik”. Brak w nich dynamicznych kalkulatorów uwzględniających gęstość, masę naczynia czy precyzyjną kontrolę pH.
* **Brak bezpiecznika mikrobiologicznego:** Żadna aplikacja na rynku nie weryfikuje bezpieczeństwa termicznego i kwasowości pod kątem śmiertelnej toksyny botulinowej.
* **Przestarzały, agresywny model biznesowy:** Nieliczne niszowe kalkulatory fermentacji wymagają drogich abonamentów (np. 39 USD rocznie), zalewają użytkownika pełnoekranowymi reklamami wideo (co w kuchni przy brudnych dłoniach uniemożliwia pracę) lub wymuszają logowanie przez Facebooka/Google.
* **Brak wsparcia dla urządzeń noszonych (Apple Watch):** W kuchni telefon narażony jest na zalanie solanką, wrzątkiem lub zabrudzenie. Żadna aplikacja w tej kategorii nie posiada dopracowanego klienta watchOS zoptymalizowanego pod mokre dłonie.

---

## **Rozdział 5: Model przychodu i ekonomia projektu**

Zgodnie z filozofią studia **Apps4Brew**, aplikacja oferuje bezkompromisowo etyczny model biznesowy:

### **5.1 Siatka cenowa**

| Poziom cenowy | Cena w Unii Europejskiej | Cena w Polsce (PLN) | Warunki i dostęp |
| :--- | :--- | :--- | :--- |
| **Darmowy rdzeń (Free Tier)** | **0,00 €** | **0,00 zł** | Nielimitowany dostęp do kalkulatorów solanek, podstawowego stopera pasteryzacji, bazy 20 klasycznych przepisów świata i monitora do 3 aktywnych partii. |
| **Subskrypcja miesięczna** | **0,99 € / mies.** | **3,99 zł / mies.** | Pełny dostęp do nielimitowanej spiżarni, generatora etykiet QR, zaawansowanego atlasu kultur mikrobiologicznych i modułu Troubleshooting Doctor. |
| **Subskrypcja roczna** | **4,99 € / rok** | **19,99 zł / rok** | Wszystkie funkcje Pro z 58% zniżką względem planu miesięcznego. |
| **Zakup dożywotni (Lifetime Pro)** | **14,99 € jednorazowo** | **59,99 zł jednorazowo** | Pełna wersja na zawsze, włącznie ze wszystkimi przyszłymi aktualizacjami, Family Sharing (Chmura rodzinna do 5 osób). |

### **5.2 Zwrot z inwestycji (Break-even)**
Roczny koszt konta Apple Developer Program wynosi 99 USD (ok. 410 PLN brutto).
Przy marży Apple 15% (Small Business Program), pojedynczy zakup dożywotni w Polsce przynosi na czysto ok. 42,49 PLN.
**Punkt rentowności rocznej następuje już przy 10 zakupach dożywotnich lub 26 subskrypcjach rocznych w skali całego świata.** Przy zerowych kosztach serwera każdy kolejny zakup stanowi czysty zysk studia.

---

## **Rozdział 6: Zakres funkcjonalny i kategoryzacja MoSCoW**

Aplikacja została podzielona na 8 głównych domen narzędziowych (B) oraz 3 domeny edukacyjno-naukowe (C):
1. **SOL (Solanki i chemia roztworów):** precyzyjne stężenia soli, osmoza, sole pektynujące ($CaCl_2$), taniny.
2. **FERM (Monitor fermentacji):** wielotygodniowe osie czasu, fazy burzliwa/cicha, powiadomienia o odgazowaniu, temperatura otoczenia.
3. **PAST (Pasteryzacja i termika):** kalkulatory wartości sterylizacyjnej $F_0$ i pasteryzacyjnej $P_0$, pasteryzacja wodna, piekarnik, sous-vide, tyndalizacja frakcjonowana.
4. **SPIN (Spiżarnia i partie - Batch Tracker):** cyfrowy magazyn słoików, ubywanie zapasów, historia, wektorowe etykiety do druku z kodami URI / QR.
5. **NACZ (Baza naczyń i geometria słoików):** Weck, Twist-Off, Mason/Ball, kamionki, kontrola wolnej przestrzeni (headspace).
6. **BRIX (Refraktometria i pH-metria):** pomiary cukru $^\circ\text{Bx}$, kwasowości czynnej pH i kwasowości miareczkowej TA.
7. **ZEG (Apple Watch i Hands-Free):** aplikacja watchOS, gesty, Live Activity, powiadomienia krytyczne, integracja z Siri.
8. **DOK (Diagnostyk problemów przetwórstwa):** interaktywne drzewo decyzyjne różnicujące defekty bezpieczne (Kahm, zielenienie czosnku) od groźnych (pleśnie, gnicie, brak próżni).
9. **NAUK (Szkoła Przetwórstwa i Fermentacji):** atlas mikrobiologiczny (LAB, octowe, drożdże, pleśnie szlachetne), kompas tradycji świata.

""")

print("A2 written successfully.")

# A3a, A3b, A3c (Tables of Scope Z-001 to Z-220, timeline, effort)
f_a3a = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (Kalkulatory, Solanki, Kwasowość, Nastawy).md")
with open(f_a3a, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3a: Tabela zakresu cz. 1 (Z-001…Z-110)**

Poniższa tabela stanowi twardą górną granicę zakresu funkcjonalnego modułów kalkulatorów, solanek, monitoringu fermentacji i kwasowości.

| ID | Moduł | Wymaganie biznesowe | Priorytet | Etap | Uzasadnienie i powiązania |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Z-001** | SOL | Kalkulator stężenia solanki w całkowitej masie ($M_{warzywa} + M_{woda}$) | **MUST** | **MVP** | Eliminuje błąd rozcieńczenia osmotycznego. |
| **Z-002** | SOL | Tradycyjny kalkulator solanki zalewowej (% wagowy w samej wodzie) | **MUST** | **MVP** | Kompatybilność z dawnymi przepisami rodzinnymi. |
| **Z-003** | SOL | Symulator równowagi osmotycznej po 48h i 14 dniach kiszenia | **SHOULD** | **MVP** | Pokazuje spadek stężenia soli po dyfuzji do warzyw. |
| **Z-004** | SOL | Korektor typu soli (kamienna niejodowana, morska, kłodawska, sól koszerna, sól warzona) | **MUST** | **MVP** | Sole z antyzbrylaczem ($E536$) lub jodem powodują mętnienie i szary osad. |
| **Z-005** | SOL | Kalkulator solenia na sucho dla kapusty i kimchi (2.0–2.5% masy) | **MUST** | **MVP** | Standardowy proces fermentacji bezzalewowej. |
| **Z-006** | SOL | Dozownik soli pektynującej (chlorek wapnia $CaCl_2$, 0.05–0.1%) dla chrupkości | **SHOULD** | **MVP** | Utrzymanie chrupkości ogórków i pomidorów. |
| **Z-007** | SOL | Rekomendator naturalnych źródeł garbników (liście dębu, wiśni, porzeczki, chrzan) | **MUST** | **MVP** | Garbniki hamują enzymy pektynolityczne. |
| **Z-008** | SOL | Przelicznik objętości łyżek/łyżeczek na gramy w zależności od gradacji soli | **MUST** | **MVP** | Łyżka soli grubej to 18 g, drobnej warzonej to 24 g. Różnica 33%! |
| **Z-009** | FERM | Kreator nowej partii kiszonki z szablonu lub od zera | **MUST** | **MVP** | Fundament rejestru partii. |
| **Z-010** | FERM | Wizualna oś czasu fermentacji z podziałem na fazę burzliwą i cichą | **MUST** | **MVP** | Jasna informacja o stanie mikrobiologicznym słoika. |
| **Z-011** | FERM | Harmonogram alertów o odgazowaniu („odbiciu” słoika / burping) | **MUST** | **MVP** | Ochrona przed rozsadzeniem słoików Twist-Off i Mason. |
| **Z-012** | FERM | Adaptacja czasu fermentacji do temperatury otoczenia ($18^\circ\text{C}$ vs $24^\circ\text{C}$) | **MUST** | **MVP** | Reguła van 't Hoffa: wyższa temperatura przyspiesza proces 2x. |
| **Z-013** | FERM | Karta partii: składniki, data nastawu, użyty słoik, notatki | **MUST** | **MVP** | Cyfrowy paszport każdego słoika. |
| **Z-014** | FERM | Dziennik odczytów sensorycznych partii (zapach, piana, mętność, smak) | **SHOULD** | **MVP** | Nauka i powtarzalność udanych nastawów. |
| **Z-015** | FERM | Obsługa fermentacji wieloetapowej (np. solenie wstępne kimchi + fermentacja w chłodzie) | **MUST** | **MVP** | Specyfika tradycyjnego koreańskiego kimchi. |
| **Z-016** | FERM | Monitor fermentacji kombuchy (faza F1 tlenowa i faza F2 butelkowa beztlenowa) | **SHOULD** | **MVP** | Bezpieczna karbonizacja bez wybuchających butelek. |
| **Z-017** | FERM | Asystent żywych octów owocowych z matką octową (fermentacja dwufazowa) | **SHOULD** | **MVP** | Alkoholowa (drożdże) $\to$ kwasowa (Acetobacter). |
| **Z-018** | FERM | Wyciszanie i archiwizacja zakończonej fermentacji po schłodzeniu w spiżarni | **MUST** | **MVP** | Przeniesienie do stanu dojrzałego w spiżarni. |
| **Z-019** | BRIX | Kalkulator zżelowania pektyn i zawartości cukru ($^\circ\text{Bx}$) w dżemach | **MUST** | **MVP** | Optymalny punkt żelowania: $65^\circ\text{Bx}$ dla tradycyjnych, $35^\circ\text{Bx}$ dla niskosłodzonych. |
| **Z-020** | BRIX | Strażnik kwasowości pH 4.6 (czerwona flaga botulinowa) | **MUST** | **MVP** | Fundamentalne wymaganie sanitarne USDA/FDA. |
| **Z-021** | BRIX | Rejestrator pomiarów pH-metrem z kompensacją temperatury (ATC) | **SHOULD** | **MVP** | Pomiar pH zależy od temperatury roztworu. |
| **Z-022** | BRIX | Przelicznik mocy i rozcieńczeń kwasu octowego (ocet 10% $\leftrightarrow$ 5% $\leftrightarrow$ 6%) | **MUST** | **MVP** | Dostosowanie polskich przepisów do octów zagranicznych. |
| **Z-023…Z-110** | VAR | Szczegółowe specyfikacje obsługi 150 tradycji kulinarnych świata | **SHOULD** | **MVP/1.1** | Przepisy bazowe z podziałem na regiony geograficzne. |

""")

print("A3a written successfully.")

# A3b, A3c, A4
f_a3b = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (Pasteryzacja, Magazyn, Spiżarnia, Apple Watch, Platforma).md")
with open(f_a3b, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3b: Tabela zakresu cz. 2 (Z-111…Z-220)**

| ID | Moduł | Wymaganie biznesowe | Priorytet | Etap | Uzasadnienie i powiązania |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Z-111** | PAST | Kalkulator czasu pasteryzacji w kąpieli wodnej w zależności od objętości słoika | **MUST** | **MVP** | Słoik 0.5L wymaga innego czasu penetracji niż słoik 1.5L. |
| **Z-112** | PAST | Precyzyjny stoper pasteryzacji z alarmami fazowymi (rozgrzewanie, gotowanie, studzenie) | **MUST** | **MVP** | Wyraziste sygnały audio/haptyczne. |
| **Z-113** | PAST | Asystent procedury tyndalizacji frakcjonowanej (3x gotowanie w odstępach 24h) | **MUST** | **MVP** | Jedyna bezpieczna metoda pasteryzacji mięs bez szybkowaru ciśnieniowego. |
| **Z-114** | PAST | Kalkulator pasteryzacji w piekarniku z korektą czasu (+150%) i ostrzeżeniem | **MUST** | **MVP** | Bezpieczeństwo termiczne i ochrona uszczelek. |
| **Z-115** | PAST | Procedury pasteryzacji precyzyjnej sous-vide (np. korniszony $80^\circ\text{C}$ dla chrupkości) | **SHOULD** | **MVP** | Metoda nowoczesnego rzemiosła kulinarnego. |
| **Z-116** | PAST | Przelicznik czasu pasteryzacji względem wysokości n.p.m. (korekta temperatury wrzenia) | **SHOULD** | **1.1** | Woda wrze w niższej temperaturze w górach (np. $96^\circ\text{C}$ w Zakopanem). |
| **Z-117** | SPIN | Cyfrowa spiżarnia: lista partii z podziałem na szafki, półki i piwnice | **MUST** | **MVP** | Pełna ewidencja domowych zapasów. |
| **Z-118** | SPIN | Monitorowanie ubywania słoików (przycisk „-1 słoik ze spiżarni”) | **MUST** | **MVP** | Natychmiastowa aktualizacja stanu magazynowego. |
| **Z-119** | SPIN | Generator etykiet na słoiki (PNG do udostępnienia w MVP, PDF do druku w 1.1) | **MUST** | **MVP** | Estetyczne oznaczenie partii i rocznika. |
| **Z-120** | SPIN | Obsługa kodów QR/URI do błyskawicznego skanowania słoika aparatem | **SHOULD** | **MVP** | Szybkie otwarcie karty partii bez szukania na liście. |
| **Z-121** | NACZ | Baza 25 popularnych typów słoików (Weck, Twist-Off, Mason, Kamionki) | **MUST** | **MVP** | Dobór właściwej metody pasteryzacji i zamknięcia. |
| **Z-122** | NACZ | Kalkulator przestrzeni nagłownej (headspace) zapobiegający wyciekom | **MUST** | **MVP** | 1.0 cm dla dżemów, 1.5 cm dla pikli, 2.5 cm dla mięs. |
| **Z-123** | ZEG | Natywna aplikacja watchOS z aktywnym stoperem pasteryzacji | **MUST** | **MVP** | Sterowanie w kuchni bez sięgania po telefon. |
| **Z-124** | ZEG | Obsługa cyfrowej koronki (Digital Crown) do szybkiego nastawiania minut | **MUST** | **MVP** | Wygoda obsługi jedną ręką. |
| **Z-125** | ZEG | Live Activity na ekranie blokady iPhone'a i Dynamic Island | **MUST** | **MVP** | Stały podgląd czasu gotowania słoików. |
| **Z-126** | DOK | Troubleshooting Doctor: drzewo decyzyjne z 40 symptomami problemów | **MUST** | **MVP** | Odróżnianie drożdży Kahm od pleśni, diagnostyka mięknięcia. |
| **Z-127** | PLAT | 100% Offline-First SQLite z transakcjami WAL | **MUST** | **MVP** | Gwarancja niezawodności bez internetu. |
| **Z-128** | PLAT | Kopia zapasowa JSON z pełnym roundtripem eksport/import | **MUST** | **MVP** | Zasada ZP-06 i ZP-07. |
| **Z-129…Z-220** | PLAT | Dostępność WCAG AAA, 35 języków, Family Sharing, optymalizacja pamięci | **MUST** | **MVP/1.1** | Standard jakości studia Apps4Brew. |

""")

print("A3b written successfully.")

# A3c
f_a3c = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A3c · rozdz. 6.3–6.5 (Etapy, Nakład pracy, Warianty).md")
with open(f_a3c, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3c: Etapy, nakład pracy i warianty wdrożeniowe (Rozdz. 6.3–6.5)**

## **6.3 Etapy wdrożenia (Roadmapa wydań)**

### **Faza 1: Wersja 1.0 (MVP) — Czas trwania: 3–4 tygodnie**
* Rdzeń kalkulatorów: solanka całkowita i wodna, kapusta, solenie na sucho, przelicznik octu.
* Monitor fermentacji: osie czasu, fazy, powiadomienia o odgazowaniu.
* Pasteryzacja: stoper z alarmami, kąpiel wodna, tyndalizacja 3x24h.
* Spiżarnia: do 10 partii, proste generowanie etykiet PNG.
* Apple Watch: stoper pasteryzacji z haptyką i koronką.
* Bezpieczeństwo: twardy strażnik pH 4.6 przeciw botulizmowi.
* Troubleshooting Doctor: 25 najczęstszych problemów (Kahm vs pleśń).
* Dostępność: pełny VoiceOver, Dynamic Type, baza SQLite z kopią zapasową JSON.

### **Faza 2: Wersja 1.1 — Czas trwania: 2–3 tygodnie po MVP**
* Nielimitowana spiżarnia Pro, wektorowy generator arkuszy etykiet PDF (Avery).
* Zaawansowana refraktometria Brix i pH z kompensacją temperatury.
* Rozszerzenie bazy tradycji kulinarnych świata do 150 przepisów bazowych.
* Korekta wrzenia pasteryzacji względem wysokości n.p.m.

### **Faza 3: Wersja 1.2 i 2.x — Przyszłość projektu**
* Integracja z inteligentnymi wagami kuchennymi Bluetooth.
* Asystent fotograficzny rozpoznawania refraktometru i skali pasków pH na urządzeniu.
* Moduł zaawansowanego koji i autolizy garum w stałych temperaturach.

---

## **6.4 Szacowany nakład pracy agenta**

| Obszar prac deweloperskich | Nakład w wariancie (a) Pełne MVP | Nakład w wariancie (b+) Rekomendacja | Nakład w wariancie (b) Ścisłe MUST |
| :--- | :--- | :--- | :--- |
| **Czysta logika domenowa i algorytmy (Core)** | 10 dni roboczych | 8 dni roboczych | 7 dni roboczych |
| **Baza danych SQLite, migracje i backup** | 6 dni roboczych | 5 dni roboczych | 4 dni roboczych |
| **Interfejs użytkownika (Expo/React Native)** | 12 dni roboczych | 8 dni roboczych | 7 dni roboczych |
| **Aplikacja watchOS i Live Activity** | 6 dni roboczych | 4 dni robocze | 3 dni robocze |
| **Treści merytoryczne i drzewa diagnostyczne** | 8 dni roboczych | 5 dni roboczych | 3 dni robocze |
| **Automatyzacja testów (9 warstw jakości)** | 6 dni roboczych | 5 dni roboczych | 4 dni robocze |
| **RAZEM** | **48 dni roboczych** | **35 dni roboczych** | **28 dni roboczych** |

*Uwaga: Przy równoległej pracy 2–3 agentów kalendarzowy czas realizacji wariantu rekomendowanego wynosi ok. 3–4 tygodnie.*

""")

print("A3c written successfully.")

# A4
f_a4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, Marketing, ASO).md")
with open(f_a4, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A4: KPI bez śledzenia, marketing i ASO (Rozdz. 13, 15)**

## **Rozdział 13: Wskaźniki sukcesu (KPI) bez śledzenia użytkowników**

Zgodnie z zasadą **ZP-03** („Zero SDK śledzących”), aplikacja nie zbiera telemetrii zdalnej. Wszystkie KPI opierają się na agregatach dostarczanych anonimowo przez Apple App Store Connect oraz lokalnych licznikach na urządzeniu:

### **13.1 KPI biznesowe (App Store Connect)**
1. **Liczba pobrań organicznych:** cel $\ge 1\,500$ pobrań w pierwszych 60 dniach w Polsce i na kluczowych rynkach europejskich (Niemcy, Francja, UK).
2. **Wskaźnik konwersji do płatności Pro:** cel $\ge 4.5\%$ użytkowników aktywujących zakup dożywotni lub subskrypcję.
3. **Średnia ocena w App Store:** cel $\ge 4.8\star$ przy co najmniej 100 recenzjach, z kluczowym naciskiem na brak skarg na zepsute przetwory lub utratę notatek.
4. **Wskaźnik odnowień subskrypcji rocznych:** cel $\ge 65\%$.

### **13.2 Lokalne wskaźniki zaangażowania (On-Device Telemetry)**
* Wskaźnik udanych partii: stosunek partii oznaczonych przez użytkownika jako „Udane/Zjedzone” do partii oznaczonych jako „Zepsute” ($\ge 95\%$).
* Częstotliwość użycia stopera pasteryzacji na Apple Watch ($\ge 40\%$ sesji pasteryzacji z udziałem zegarka).

---

## **Rozdział 15: Strategia marketingowa i ASO (App Store Optimization)**

### **15.1 Słowa kluczowe i pozycjonowanie w App Store (Polska)**
* **Tytuł aplikacji:** `Słoik — kiszonki i przetwory`
* **Podtytuł:** `Kalkulator solanek, pasteryzacja i spiżarnia`
* **Słowa kluczowe (Keywords):** `kiszonki, przetwory, słoiki, ogórki kiszone, kapusta kiszona, kimchi, kombucha, pasteryzacja, wekowanie, dżemy, powidła, solanka, spiżarnia, weck, botulizm, ocet, marynaty`

### **15.2 Słowa kluczowe globalne (Angielski / US & International)**
* **App Title:** `Jarwise — Ferment & Preserves`
* **Subtitle:** `Pickling, Canning & Kombucha`
* **Keywords:** `fermentation, pickling, canning, lacto fermentation, kimchi maker, kombucha tracker, mason jar, sauerkraut, brine calculator, food preserver, water bath, botulism, hot sauce, preserves, pantry`

### **15.3 Komunikacja i dotarcie do społeczności**
* **Fora rzemieślnicze:** Reddit (r/fermentation — 450k członków, r/canning — 180k członków), polskie grupy na Facebooku („Kiszonki i fermentacje”, „Wekujemy i robimy przetwory”).
* **Współpraca z edukatorami:** Bezpłatne kody promocyjne dla autorów blogów o zdrowym żywieniu, mikrobiomie jelitowym i domowym przetwórstwie.
* **Materiały prasowe:** Nacisk na aspekt edukacyjny i bezpieczeństwo mikrobiologiczne (eliminacja ryzyka zatrucia jadem kiełbasianym w warunkach domowych).

""")

print("A4 written successfully.")
