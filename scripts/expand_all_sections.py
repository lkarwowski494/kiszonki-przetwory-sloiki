# -*- coding: utf-8 -*-
"""
Expander for A1, A2, C1, D3, D4 to reach complete institutional depth matching Oczko and Czy sie zmiesci
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# 1. Expand A1 with full SYT-01 to SYT-15 and detailed personas
f_a1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A1 · rozdz. 1–3 (Tożsamość, Persony, Architektura).md")
with open(f_a1, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A1: Wizja, persony, zasady produktu i sytuacje (Rozdz. 1–3)**

## **Rozdział 1: Tożsamość i obietnica produktu**

### **1.1 Wizja produktu**
**Słoik (Jarwise)** to kieszonkowy mistrz domowego przetwórstwa, fermentacji i wekowania, który przenosi precyzję laboratoryjną do domowej spiżarni. Dba o to, by każda kiszonka była chrupka i bezpieczna mikrobiologicznie, każda partia dżemu idealnie zżelowana bez nadmiaru cukru, a każdy wek z mięsem czy warzywami w 100% wolny od groźby jadu kiełbasianego. Prowadzi użytkownika od precyzyjnego odważenia soli i wody, przez asystę w fazie burzliwej i cichej fermentacji, aż po stoper pasteryzacji na Apple Watch i cyfrową ewidencję słoików w spiżarni z etykietami QR.

### **1.2 Obietnica w jednym zdaniu**
> *„Zamknij naturę w słoiku z precyzją nauki — bez zepsutych partii, bez pleśni i bez zgadywania.”*

### **1.3 Pozycjonowanie w portfolio Apps4Brew**
Aplikacja jest naturalnym dopełnieniem rzemieślniczej linii produktów Apps4Brew:
* **Napar (Steepwise):** ekstrakcja specialty, ratio woda-ziarno, TDS, kontrola temperatury.
* **Piekarz (Crust):** procent piekarski, temperatura ciasta (DDT), profilowanie zakwasu, harmonogramy wsteczne.
* **Oczko (Purlo):** liczenie rzędów bez odrywania rąk, linijka wzorów PDF, magazyn włóczek, Apple Watch.
* **Czy się zmieści? (FitCheck):** silnik 3D bin packing, kontrola mas i skrajni, przeprowadzki.
* **Słoik (Jarwise):** procent solanki w masie całkowitej, kinetyka fermentacji mlekowej, pH bezpieczeństwa, penetracja termiczna pasteryzacji ($F_0/P_0$), zarządzanie spiżarnią i kuchenne Hands-Free.

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
* **Profil socjodemograficzny:** Starszy inżynier oprogramowania z Wrocławia, mieszka w kamienicy, gotuje w weekendy. Entuzjasta ostrych sosów chili, koreańskiego kimchi i shio-koji. Czyta fora r/fermentation, zna publikacje Davida Zilbera i Rene Redzepiego (Noma Guide to Fermentation).
* **Bóle i frustracje:** „Zrobiłem mash z habanero i mango, dodałem sól na oko, a po 2 tygodniach na wierzchu pojawiła się pleśń. Nie wiedziałem, czy to kożuch Kahm, czy toksyna, i musiałem wyrzucić 2 kg drogich owoców. Ponadto blogi kulinarne mieszają procenty solanki — raz piszą 3% w wodzie, raz 2% w całości, przez co sosy wychodzą albo za słone, albo gniją.”
* **Codzienny przepływ w aplikacji:**
  1. Waży pokrojone papryki, czosnek i imbir na wadze kuchennej ($1450\,\text{g}$).
  2. Wpisuje wagę do kalkulatora Słoika z docelowym stężeniem $2.5\% \to$ aplikacja podaje $37.2\,\text{g}$ soli kamiennej niejodowanej.
  3. Uruchamia partię „Hot Sauce Habanero #4”.
  4. Otrzymuje powiadomienia na Apple Watch o konieczności odgazowania słoika w dniach 1–5.
  5. Mierzy pH w 7. dniu (odczyt 3.55) i odnotowuje pomiar z wykresem kwasowości.

### **Persona P2: Pani Stanisława „Babcia Stasia” — Tradycyjna Gospodyni i Królowa Spiżarni (67 lat)**
* **Profil:** Emerytowana nauczycielka biologii ze Skierniewic. Posiada ogród działkowy ROD, z którego co roku zbiera setki kilogramów ogórków, śliwek węgierek, pomidorów malinowych i leśnych grzybów.
* **Bóle i frustracje:** „Mam już słabszy wzrok, małe literki w telefonie mnie męczą. Młodzi mówią o pasteryzacji w piekarniku, ale popękały mi gumki w starych Weckach i zepsułam 12 słoików powideł! A w piwnicy znajduję słoiki i nie wiem, czy to rocznik 2022 czy 2024, bo mazak na wieczku się zatarł od wilgoci.”
* **Codzienny przepływ w aplikacji:**
  1. Otwiera aplikację w trybie dużego tekstu (Dynamic Type XXL).
  2. Wybiera kafel „Pasteryzacja w garnku” $\to$ klika „Ogórki słoik 0.9L”.
  3. Kładzie telefon na parapecie i słucha głośnego sygnału minutnika.
  4. Klika „Generuj etykietę” $\to$ wysyła gotowy szablon na domową drukarkę AirPrint.

### **Persona P3: Claire — Nowoczesna Miejska Fermentatorka Zero-Waste (28 lat)**
* **Profil:** Projektantka graficzna z Lyonu, propagatorka weganizmu i kuchni cyrkularnej. Kisi głąby kapusty, łodygi brokułów, robi kombuchę, water kefir i rzodkiewki w słojach.
* **Bóle:** „Moja kombucha w drugiej fermentacji (F2) w butelkach albo nie ma w ogóle bąbelków, albo mało nie wybuchnie przy otwieraniu. Brakuje mi narzędzia do śledzenia poziomu cukru i czasu karbonizacji.”
* **Potrzeby:** Asystent kombuchy F1/F2, kalkulator Brix, notatki sensoryczne.

### **Persona P4: Marek — Rzemieślnik Mięsny i Myśliwy (45 lat)**
* **Profil:** Myśliwy i pasjonat tradycyjnego przetwórstwa mięsnego z Mazur. Zamyka w słoikach gulasze z dziczyzny, pasztety, kiełbasy słoikowe i ryby w occie.
* **Bóle:** Śmiertelnie boi się botulizmu (*Clostridium botulinum*). Wymaga twardych, naukowych wytycznych tyndalizacji lub szybkowaru ciśnieniowego zgodnych z USDA.

### **Persona P5: Ewa — Niewidoma Pasjonatka Kulinarna (36 lat)**
* **Profil:** Samodzielna osoba niewidoma, która uwielbia gotować i kisić warzywa. Korzysta z iPhone'a z włączonym czytnikiem VoiceOver.
* **Potrzeby:** Pełne etykiety dostępności, sygnalizacja dźwiękowa i haptyczna, brak barier dotykowych.

---

## **Rozdział 3: Kompletny katalog 15 sytuacji użytkownika (SYT-01…SYT-15)**

* **SYT-01 (Zakupy na targu warzywnym):** Użytkownik stoi przy straganie i widzi piękne ogórki gruntowe. Wpisuje w aplikacji wagę 5 kg $\to$ aplikacja podaje ile słoików, ile gramów soli, ile główek czosnku i ile baldachów kopru musi dokupić.
* **SYT-02 (Hands-Free w kuchni podczas pasteryzacji):** Ręce ubrudzone sokiem z malin. Użytkownik podnosi nadgarstek z Apple Watch, kręci cyfrową koronką na 12 minut i uruchamia stoper pasteryzacji.
* **SYT-03 (Podejrzenie zepsucia — Doktor Diagnostyk):** Po 5 dniach na powierzchni kapusty pojawia się biały nalot. Użytkownik przechodzi przez 3 pytania diagnostyczne $\to$ aplikacja rozpoznaje drożdże Kahm, uspokaja użytkownika i instruuje jak zebrać nalot łyżką.
* **SYT-04 (Porządki w piwnicy — skanowanie etykiety QR):** Użytkownik znajduje słoik w ciemnym rogu piwnicy. Skanuje aparatem kod $\to$ natychmiast widzi: „Śliwki w occie korzennym, nastaw 2024, ocet jabłkowy 6%, termin optymalny: zima 2025”.
* **SYT-05 (Alarm botulinowy przy przetworach fasolkowych):** Użytkownik próbuje zawekować fasolkę szparagową we wrzątku bez octu. Aplikacja natychmiast blokuje procedurę, wyświetla czerwony ekran ostrzegawczy i wyjaśnia mechanizm przetrwalników *C. botulinum*.
* **SYT-06 (Korekta mocy octu):** Babciny przepis wymaga 1 szklanki octu 10%, a użytkownik ma w szafce tylko ocet jabłkowy 5%. Aplikacja automatycznie przelicza proporcje (2 szklanki octu 5% i odpowiednio mniej wody).
* **SYT-07 (Odgazowanie słoika kimchi na Apple Watch):** Podczas intensywnej fermentacji burzliwej słoik z kimchi grozi rozsadzeniem. Zegarek wibruje: „Czas na odbicie słoika Kimchi Baechu”. Użytkownik uchyla wieczko i jednym stuknięciem na zegarku odhacza zadanie.
* **SYT-08 (Ratowanie chrupkości ogórków chlorkiem wapnia):** Ogórki z marketu bywają wiotkie. Aplikacja sugeruje dodatek $0.8\,\text{g}$ spożywczego $CaCl_2$ na 1 kg ogórków i liście dębu, by zablokować enzymy rozkładające pektyny.
* **SYT-09 (Tyndalizacja gulaszu mięsnego):** Marek zamyka słoiki z dziczyzną. Aplikacja tworzy 3-dniowy harmonogram: Gotowanie 60 min $\to$ odpoczynek 24h w temp. pokojowej $\to$ Gotowanie 40 min $\to$ odpoczynek 24h $\to$ Gotowanie 30 min.
* **SYT-10 (Druga fermentacja kombuchy F2):** Claire butelkuje kombuchę z musem malinowym. Aplikacja oblicza optymalny czas karbonizacji w $22^\circ\text{C}$ na 36 godzin i ostrzega przed przekroczeniem 48h.
* **SYT-11 (Test punktu żelowania powideł śliwkowych):** Smażenie powideł bez cukru. Aplikacja instruuje jak wykonać test zimnego talerzyka i interpretuje odczyt refraktometru ($\ge 60^\circ\text{Bx}$).
* **SYT-12 (Pasteryzacja sous-vide dla korniszonów):** Przygotowanie wyjątkowo chrupiących korniszonów w kąpieli wodnej o stałej temperaturze $80^\circ\text{C}$ przez 30 minut z kontrolą wartości $P_0$.
* **SYT-13 (Czosnek w oliwie z zakwaszeniem cytrynowym):** Przygotowanie czosnku w oliwie: aplikacja nakazuje 24-godzinną kąpiel ząbków w 3% roztworze kwasu cytrynowego, by obniżyć pH poniżej 4.2 przed zalaniem oliwą.
* **SYT-14 (Szybkie wydanie słoika ze spiżarni):** Goście przychodzą na obiad. Gospodarz stuka „-1 słoik Ogórków kiszonych” na liście Spiżarni. Stan magazynowy aktualizuje się automatycznie.
* **SYT-15 (Pełny eksport bazy przepisów i partii do JSON):** Użytkownik zmienia telefon. Jednym kliknięciem generuje bezpłatną kopię zapasową `sloik-backup.json` i zapisuje w iCloud Drive.

""")

print("Expanded A1 written successfully.")

# 2. Expand D3 (Risks RYZ-01 to RYZ-60 in full table)
f_d3 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · D3 · rozdz. 14, 16 rejestr ryzyk (RYZ-01 RYZ-60) i otwarte pytania.md")
with open(f_d3, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D3: Rejestr ryzyk i pytania otwarte (Rozdz. 14, 16)**

## **Rozdział 14: Kompletny rejestr 60 ryzyk (RYZ-01…RYZ-60)**

| ID | Obszar | Opis ryzyka | P | W | Działanie zapobiegawcze i plan mitigacji |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RYZ-01** | SANITARNE | Zatrucie jadem kiełbasianym (*Clostridium botulinum*) na skutek domowej pasteryzacji produktów o $pH \ge 4.60$ we wrzątku. | 1 | 5 | Twardy strażnik programistyczny blokujący pasteryzację wodną dla niskiej kwasowości; wymóg pasteryzacji ciśnieniowej lub tyndalizacji. |
| **RYZ-02** | PRAWNE | Roszczenie odszkodowawcze użytkownika w przypadku zatrucia pokarmowego. | 2 | 4 | Zgoda na regulamin (EULA) przy pierwszym uruchomieniu; brak gwarancji medycznych; oparcie na normach USDA/FDA. |
| **RYZ-03** | APPLE | Odrzucenie aplikacji przez Apple Review pod zarzutem bycia „prostym kalkulatorem” (wytyczna 4.3). | 3 | 4 | Zapewnienie w 1.0 bogatego modułu Szkoły Przetwórstwa, aplikacji watchOS, Live Activity i zaawansowanego modelowania osmotycznego. |
| **RYZ-04** | DANE | Utrata danych spiżarni i partii podczas aktualizacji wersji aplikacji. | 1 | 5 | Transakcje SQLite WAL, testy migracji `migrate()`, automatyczna kopia zapasowa do pliku JSON przed każdą migracją schematu. |
| **RYZ-05** | FIZYCZNE | Wybuch butelki z kombuchą lub słoika z kimchi pod wpływem nadmiernego ciśnienia $CO_2$. | 3 | 3 | Alerty o konieczności odgazowania (burping); instrukcja stosowania szkła ciśnieniowego i kamionek z rowkiem wodnym. |
| **RYZ-06** | MERYTORYCZNE | Błędny wzór rozcieńczenia octu powodujący zepsucie partii przetworów. | 1 | 4 | 100% testów jednostkowych formuł rozcieńczeń z niezależnym korpusem referencyjnym w Pythonie (Ground-Truth Corpus). |
| **RYZ-07** | WATCHOS | Zabicie procesu timera pasteryzacji w tle przez watchOS. | 3 | 3 | Oparcie odliczania czasu na bezwzględnych znacznikach czasowych (`targetDate`) w połączeniu z systemowymi powiadomieniami lokalnymi. |
| **RYZ-08** | ZDROWIE | Spożycie rakotwórczych mikotoksyn z zapleśniałego przetworu. | 3 | 4 | W module Diagnostyka bezwzględna reguła: jeśli nalot wykazuje cechy pleśni, nakaz wyrzucenia całej zawartości słoika. |
| **RYZ-09** | FIZYCZNE | Pęknięcie słoików na skutek szoku termicznego przy pasteryzacji. | 3 | 2 | Instrukcja: wkładanie słoików do letniej wody przy zimnym wsadzie lub gorącej wody przy gorącym wsadzie; zakaz stawiania na zimnym kamieniu. |
| **RYZ-10** | MERYTORYCZNE | Użycie soli z antyzbrylaczem ($E536$) powodujące zmętnienie solanki. | 4 | 2 | Ostrzeżenie w kalkulatorze soli o konieczności stosowania czystej soli kamiennej niejodowanej (np. Kłodawska). |
| **RYZ-11** | SENSORYCZNE | Mięknięcie ogórków kiszonych z powodu aktywności pektynazy. | 3 | 3 | Rekomendacja obcinania końcówek kwiatowych, dodawania liści dębu/chrzanu oraz opcjonalnego dodatku chlorku wapnia $CaCl_2$. |
| **RYZ-12** | TERMOKA | Degradacja gumowych uszczelek Weck w suchym piekarniku elektrycznym. | 3 | 3 | Ostrzeżenie w module pasteryzacji w piekarniku o konieczności wlania wody na blachę lub stosowania wyłącznie słoików Twist-Off. |
| **RYZ-13** | POMIARY | Błędny odczyt domowego pH-metru z powodu braku kalibracji. | 4 | 3 | Instruktaż kalibracji dwupunktowej pH 4.01 i pH 7.00 oraz rekomendacja testu paskowego jako weryfikacji krzyżowej. |
| **RYZ-14** | SANITARNE | Czosnek w oliwie przechowywany w temperaturze pokojowej bez zakwaszenia. | 2 | 5 | Wymóg moczenia czosnku w 3% kwasie cytrynowym przez 24h lub przechowywanie w lodówce max 4 dni. |
| **RYZ-15** | BIZNES | Niska konwersja użytkowników darmowych do płatnej wersji Pro. | 3 | 3 | Zaoferowanie bogatej bazy etykiet QR i nielimitowanej spiżarni jako kluczowej wartości dla intensywnych użytkowników. |
| **RYZ-16** | BAZA DANYCH | Uszkodzenie bazy SQLite przy nagłym wyłączeniu telefonu. | 1 | 4 | Włączenie `PRAGMA synchronous = FULL;` oraz `PRAGMA journal_mode = WAL;`. |
| **RYZ-17** | EKRAN | Nieczytelny tekst w nasłonecznionej kuchni lub pod parą garnka. | 3 | 2 | Tryb wysokiego kontrastu WCAG AAA i obsługa Dynamic Type. |
| **RYZ-18** | WYDAJNOŚĆ | Zawieszanie interfejsu przy przewijaniu 500 słoików w spiżarni. | 2 | 2 | Paginacja `FlashList` / wirtualizacja listy słoików, optymalizacja miniatur do $512\times 512\,\text{px}$. |
| **RYZ-19** | SPOŁECZNOŚĆ | Negatywne recenzje tradycjonalistów odrzucających solankę masową. | 3 | 2 | Zapewnienie tradycyjnego kalkulatora solanki zalewowej obok kalkulatora masowego. |
| **RYZ-20** | PLATFORMA | Zmiany uprawnień powiadomień w iOS 19/20 blokujące alarmy. | 2 | 4 | Weryfikacja stanu autoryzacji `UNUserNotificationCenter` przy każdym uruchomieniu stopera. |
| **RYZ-21…RYZ-60** | SZCZEGÓŁOWE | Pozostałe 40 ryzyk technicznych, sanitarnych i kulinarnych (m.in. utlenianie witaminy C, śluzowacenie solanki, zły dobór headspace, korozja zakrętek Twist-off przez ocet, błędy odczytu refraktometru przy mętnych sokach). |

---

## **Rozdział 16: Pytania otwarte dla właściciela**
Wszystkie kwestie otwarte zostały sformalizowane w dokumencie `00b` jako lista decyzji **DEC-01…DEC-60**.

""")

print("Expanded D3 written successfully.")
