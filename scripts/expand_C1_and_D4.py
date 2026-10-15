# -*- coding: utf-8 -*-
"""
Expander for C1 (Encyclopedia of World Preserves) and D4 (Testing Rigor & Maestro E2E)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# 1. Expand C1
f_c1 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C1 · rozdz. 7 nauka - Szkoła Przetwórstwa i Fermentacji, atlas kultur bakteryjnych, drożdży i pleśni szlachetnych.md")
with open(f_c1, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C1: Szkoła Przetwórstwa i Atlas Kultur (Rozdz. 7)**

Moduł edukacyjny stanowi fundament unikalności rynkowej aplikacji i eliminuje ryzyko odrzucenia przez Apple (wytyczna 4.3).

---

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
    $$\text{C}_2\text{H}_5\text{OH} + \text{O}_2 \to \text{CH}_3\text{COOH} + \text{H}_2\text{O}$$
  * *Wymagania:* Stały dostęp tlenu atmosferycznego (słój przykryty gazą/tkaniną), stężenie alkoholu wyjściowego $5\%–8\%$, optymalna temperatura $24–28^\circ\text{C}$.

### **1.3 Drożdże i Kultury Symbiotyczne**
* **SCOBY (Symbiotic Culture of Bacteria and Yeast - Kombucha):**
  * *Skład:* Konsorcjum drożdży (*Zygosaccharomyces*, *Saccharomyces cerevisiae*) oraz bakterii octowych (*Komagataeibacter xylinus* tworzący celulozowy grzybek na powierzchni).
  * *Metabolizm:* Drożdże rozszczepiają sacharozę na glukozę i fruktozę, wytwarzając alkohol i $CO_2$; bakterie octowe utleniają alkohol do kwasu octowego i kwasu glukonowego.
* **Aspergillus oryzae (Pleśń Koji):**
  * *Rola:* Wytwarzanie potężnych baterii enzymatycznych (amylazy rozbijające skrobię na cukry proste, proteazy rozbijające białka na aminokwasy kwasu glutaminowego dające smak umami). Wykorzystywana do shio-koji, miso i domowego garum.

---

## **2. Wielka Encyklopedia Tradycji Przetwórczych Świata (11 Tradycji Kulinarnych)**

### **2.1 Tradycja Polska i Wschodniosłowiańska (Słowiańskie serce fermentacji)**
* **Ogórki kiszone i małosolne:** Tradycja oparta na świeżych ogórkach gruntowych zbieranych rano, twardej wodzie studziennej/źródlanej, soli kamiennej kłodawskiej niejodowanej ($2.0\%–2.5\%$), baldachach kopru z nasionami, czosnku w łupinach, korzeniu chrzanu oraz liściach dębu, wiśni lub czarnej porzeczki (źródło garbników hamujących pektynazę). Małosolne fermentowane 48–72h w cieple; kiszone zimowe znoszone do chłodnej piwnicy ($10–14^\circ\text{C}$) po 4 dniach.
* **Kapusta kiszona w kamionkach:** Szatkowana kapusta późna (biała, zwięzłe głowy) z dodatkiem 2.0%–2.2% soli, marchwi i opcjonalnie kminku lub żurawiny. Kluczowy proces ubijania drewnianym tłuczkiem do momentu całkowitego przykrycia sokiem własnym. Odgazowywanie nakłuwaniem brzozowym kołkiem przez pierwsze 5 dni.
* **Kwas buraczany i zakwas na żur:** Zakwas na barszcz czerwony (buraki ćwikłowe, woda, czosnek, ziele angielskie, liść laurowy, kromka prawdziwego chleba żytniego na zakwasie jako starter) oraz zakwas żytni na żur (mąka żytnia typ 2000 razowa, woda, czosnek, majeranek).
* **Grzyby leśne marynowane:** Pasteryzowane w zalewie octowo-cukrowej (proporcja 1:4 octu 10% do wody, cebula, gorczyca, pieprz, ziele angielskie).

### **2.2 Tradycja Koreańska (Kultura Kimjang i naczynia Onggi)**
* **Baechu Kimchi:** Kapusta pekińska krojona wzdłuż, solona na mokro lub sucho przez 6–8 godzin, płukana trzykrotnie, a następnie nacierana aromatyczną pastą (*yangnyeom*) na bazie kleiku z mąki ryżowej słodkiej (*chapssalpul*), płatków ostrej papryki *gochugaru*, czosnku, imbiru, rzodkwi daikon ciętej w julienne, szczypiorku oraz sfermentowanych krewetek (*saeujeot*) lub sosu rybnego.
* **Kkakdugi:** Chrupkie kimchi z rzodkwi daikon krojonej w kostkę $2\times 2\,\text{cm}$.
* **Dongchimi:** Zimowe, łagodne białe kimchi wodne w rzadkiej, musującej solance z dodatkiem gruszki azjatyckiej, czosnku i zielonych papryczek, podawane jako probiotyczny bulion do makaronu na zimno.
* **Naczynia Onggi:** Mikroporowata glina wypalana w niskiej temperaturze umożliwiająca słoikowi „oddychanie” (przepuszczanie gazów $CO_2$ bez dopływu tlenu i owadów).

### **2.3 Tradycja Japońska (Sztuka Tsukemono i Koji)**
* **Asazuke:** Błyskawiczne pikle solankowe (kapusta, ogórek, rzepa) dociskane w specjalnym pojemniku ze sprężyną (*tsukemonoki*) przez 1–4 godziny.
* **Nukazuke:** Unikalna fermentacja w wilgotnym podłożu ze sfermentowanych otrębów ryżowych (*nuka*), soli, alg kombu i suszonych papryczek. Podłoże wymaga codziennego ręcznego napowietrzania i mieszania. Warzywa zagrzebuje się w otrębach na 12–48 godzin.
* **Umeboshi:** Japońskie morele *ume* zbierane na zielono, solone z 10–20% soli morskiej, dociążane kamieniem, a następnie barwione purpurowymi liśćmi shiso (*Perilla frutescens*) i suszone na słońcu.
* **Shio-koji:** Ryż zaszczepiony grzybnią *Aspergillus oryzae* zmieszany z wodą i solą (10–12%), fermentowany przez 7–10 dni w temperaturze pokojowej z codziennym mieszaniem. Naturalny eliksir enzymatyczny rozbijający białka.

### **2.4 Tradycja Chińska (Sichuan Paocai i Czosnek Laba)**
* **Sichuan Paocai:** Warzywa (seler, marchew, fasolka, rzodkiew) w słojach z ceramicznym lub szklanym rowkiem wodnym (*water-lock jars*). Zalewa zawiera solankę 3.5%, pieprz syczuański, imbir, anyż gwiazdkowaty, liście laurowe oraz odrobinę chińskiego destylatu ryżowego *Baijiu*, który hamuje rozwój drożdży kożuchujących Kahm.
* **Czosnek Laba (Laba Suan):** Ząbki czosnku zalewane czarnym octem ryżowym w grudniu na chiński Nowy Rok. W chłodnym otoczeniu i kwasie allinaza tworzy szmaragdowozielone pigmenty pirolowe.

### **2.5 Tradycja Bliskiego Wschodu i Kaukazu (Torshi i Makdous)**
* **Torshi Left:** Pikle z białej rzepy ciętej w słupki, zalewanej solanką z octem winnym i świeżym burakiem ćwikłowym, który nadaje warzywom intensywnie neonowo-różowy kolor.
* **Makdous (Syria, Liban):** Miniaturowe bakłażany baby gotowane krótko, nacinane, solone i odwadniane pod ciężkim kamieniem przez 48 godzin, następnie faszerowane pastą z posiekanych orzechów włoskich, czosnku, papryki chili i soli, układane ciasno w słoikach i zalewane oliwą extra virgin na 3–4 tygodnie.
* **Zielone pomidory po gruzińsku:** Pomidory nacinane w krzyż, faszerowane pastą ze świeżej kolendry, czosnku, ostrej papryki i soli, kiszone w glinianych garnkach.

### **2.6 Tradycja Maghrebu (Kiszone cytryny L'hamd Marakad)**
* Całe cytryny nacinane na cztery części (zostawiając złączoną szypułkę), wnętrze zasypywane gruboziarnistą solą morską, ciasno upychane w słoju tak, by puściły sok własny. Fermentowane przez 4–6 tygodni. Sól i kwas cytrynowy powodują enzymatyczny rozpad gorzkich flawonoidów w białej skórce (albedo), która staje się miękka, jedwabista i intensywnie aromatyczna.

### **2.7 Tradycja Indyjska (Achaar / South Asian Pickles)**
* Pikle warzywno-owocowe (zielone mango, limonki, ostre papryczki, korzeń lotosu). Proces obejmuje solenie surowca, suszenie na słońcu na płótnie w celu odparowania nadmiaru wody, obtaczanie w prażonych przyprawach (gorczyca brązowa, nasiona kozieradki, nasiona kopru włoskiego, asafetyda *hing*, kurkuma), a następnie zalewanie surowym, gorącym olejem musztardowym (*sarson ka tel*), który tworzy beztlenową barierę ochronną.

### **2.8 Tradycja Śródziemnomorska i Iberyjska (Escabeche i Oliwki)**
* **Escabeche:** Technika konserwacji podsmażanych ryb lub warzyw (marchew, cebula, papryczki jalapeño) w aromatycznej gorącej marynacie z octu winnego, oliwy, liści laurowych, pieprzu i ziół.
* **Oliwki fermentowane:** Oliwki świeże (niejadalnie gorzkie ze względu na oleuropeinę) ługowane lub moczone w wielokrotnie zmienianej wodzie przez 10–14 dni, a następnie poddawane wielomiesięcznej fermentacji mlekowej w solance 8–10% z gałązkami dzikiego oregano.

### **2.9 Tradycja Angloamerykańska (Relish, Piccalilli i Bread & Butter)**
* **Piccalilli:** Tradycyjny brytyjski relish z kalafiora, małych cebulek perłowych i ogórków w gęstym sosie musztardowym doprawionym kurkumą, imbirem i octem słodowym.
* **Bread and Butter Pickles:** Plasterki ogórków z cebulą w słodko-kwaśnej zalewie octowej z nasionami selera i nasionami gorczycy, pasteryzowane w kąpieli wodnej.
* **Kosher Dill Pickles (Nowy Jork):** Ogórki kiszone czosnkowe w stylu żydowskich delikatesów na Lower East Side w Nowym Jorku — fermentowane w dębowych beczkach bez dodatku octu.

### **2.10 Tradycja Owocowa i Słodka (Powidła, Konfitury i Chutneye)**
* **Powidła śliwkowe węgierkowe:** Tradycyjne polskie powidła smażone przez 3–4 dni po kilka godzin dziennie bez dodatku grama cukru. Proces polega na powolnym odparowaniu wody i karmelizacji naturalnych cukrów śliwki aż do uzyskania min. $60^\circ\text{Bx}$ i gęstej, lśniącej, ciemnobrązowej masy, która nie spada z odwróconej łyżki.
* **Konfitury z płatków róż i owoców leśnych:** Owoce gotowane w nasyconym syropie cukrowym, w którym wysokie ciśnienie osmotyczne konserwuje tkankę owocu bez rozpadu jej struktury.
* **Chutneye (np. Mango Chutney, Onion Relish):** Połączenie słodyczy owoców, kwasu octowego, cukru trzcinowego i korzennych przypraw (goździki, kardamon, cynamon).

### **2.11 Tradycja Mięsna i Tłuszczowa (Confit, Rillettes i Salo)**
* **Confit z kaczki lub gęsi:** Udka nacierane solą, czosnkiem i tymiankiem, dojrzewające 24h w chłodzie, a następnie powoli gotowane w wytopionym tłuszczu w temperaturze $85–90^\circ\text{C}$ przez 3–4 godziny. Przekładane do sterylnych słoików i całkowicie zalewane czystym płynnym tłuszczem, który po zastygnięciu tworzy hermetyczną pieczęć odcinającą tlen.
* **Rillettes:** Drobno poszarpane długo gotowane mięso wieprzowe lub gęsie w zawiesinie tłuszczowej.
* **Salo (Wschodnioeuropejska słonina w słoju):** Grube płaty słoniny nacierane solą kamienną (metoda sucha), czosnkiem i grubo mielonym pieprzem, układane w słojach i dojrzewające w chłodzie.

""")

print("Expanded C1 written successfully.")

# 2. Expand D4 Testing Rigor with Code & Maestro YAML
f_d4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · D4 · rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości dla bezpieczeństwa żywności i logiki).md")
with open(f_d4, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D4: Wielowarstwowa strategia testów — 9 warstw jakości (Rozdz. 17)**

Zgodnie ze standardem inżynieryjnym projektów `trening`, `Oczko` i `czy-sie-zmiesci`, w projekcie **Słoik (Jarwise)** obowiązuje bezwzględny reżim weryfikacji jakości oparty na 9 niezależnych warstwach testowych.

```text
+-----------------------------------------------------------------------------------+
|               WARSTWA 9: STRAŻNICY ARCHITEKTURY, BEZPIECZEŃSTWA I WZORCÓW         |
+-----------------------------------------------------------------------------------+
|               WARSTWA 8: DOSTĘPNOŚĆ (APPLE HIG, WCAG AAA, VOICEOVER)              |
+-----------------------------------------------------------------------------------+
|               WARSTWA 7: E2E I REGRESJA WIZUALNA (MAESTRO NA SYMULATORZE IOS)     |
+-----------------------------------------------------------------------------------+
|               WARSTWA 6: MACIERZ KOMPONENTÓW I SCENARIUSZE UI (RNTL)             |
+-----------------------------------------------------------------------------------+
|               WARSTWA 5: TESTY BAZY DANYCH SQLITE, WAL I ODPORNOŚCI NA BŁĘDY      |
+-----------------------------------------------------------------------------------+
|               WARSTWA 4: NIEZALEŻNE KORPUSY REFERENCYJNE (GROUND-TRUTH USDA/FDA)  |
+-----------------------------------------------------------------------------------+
|               WARSTWA 3: TESTY WŁASNOŚCIOWE PROPERTY-BASED (FAST-CHECK)          |
+-----------------------------------------------------------------------------------+
|               WARSTWA 2: TESTY MUTACYJNE (STRYKER MUTATION TESTING >= 90%)       |
+-----------------------------------------------------------------------------------+
|               WARSTWA 1: CZYSTA DOMENA I MATEMATYKA (100% LINE & BRANCH COVERAGE) |
+-----------------------------------------------------------------------------------+
```

---

## **Warstwa 1: Czysta logika domenowa i wzory biologiczne (100% Coverage)**
Wszystkie moduły w katalogu `src/core/domain/` (kalkulatory solanek, przelicznik octu, algorytm kwasowości, termika pasteryzacji $P_0/F_0$) podlegają wymogowi **100% pokrycia linii, gałęzi i funkcji**.
* Brak jakichkolwiek importów z `react-native`, `expo` czy bibliotek UI.
* Weryfikacja poleceniem: `npm run test:domain` z progiem w `jest.config.js`:
  ```javascript
  coverageThreshold: {
    './src/core/domain/**/*.ts': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
  ```

---

## **Warstwa 2: Testy mutacyjne (Stryker Mutation Testing $\ge 90\%$)**
Weryfikacja jakości testów poprzez automatyczne mutowanie kodu źródłowego (`stryker.config.json`):
* Zamiana operatorów matematycznych ($+ \leftrightarrow -$, $\cdot \leftrightarrow /$, $< \leftrightarrow \le$).
* Celowa zmiana stałych fizykochemicznych (np. zmiana progu botulinowego z $4.60$ na $4.80$ lub temperatury wrzenia z $100$ na $95$).
* Każdy taki mutant **musi zostać natychmiast wykryty i zabity (Killed Mutant)** przez zestaw testowy. Wskaźnik przeżywalności mutantów poniżej 10%.

---

## **Warstwa 3: Testy własnościowe Property-Based Testing (`fast-check`)**
Generowanie setek tysięcy pseudolosowych kombinacji danych wejściowych w celu weryfikacji niezmienników matematycznych:
* **Niezmiennik 1 (Zachowanie masy soli):** Dla dowolnej wagi warzyw $M_v \in (0, 100000]\,\text{g}$, wody $M_w \in [0, 100000]\,\text{g}$ i zadanego stężenia $p \in (0, 25]\%$, masa soli $M_s$ obliczona ze wzoru RD-01 spełnia tożsamość:
  $$\frac{M_s}{M_v + M_w + M_s} \cdot 100\% = p \pm 10^{-6}\%$$
* **Niezmiennik 2 (Monotoniczność pasteryzacji):** Wartość sterylizacyjna $F_0(t, T)$ jest funkcją ściśle rosnącą względem czasu $t$ i temperatury $T$:
  $$\forall T_2 > T_1, t_2 > t_1: F_0(t_2, T_2) > F_0(t_1, T_1)$$
* **Niezmiennik 3 (Bezpieczeństwo kwasowości):** Jeśli zmierzone $pH \ge 4.60$, funkcja `evaluateSafetyStatus(ph, isAnaerobic)` zawsze zwraca status `CRITICAL_BOTULISM_RISK`.

---

## **Warstwa 4: Niezależne korpusy referencyjne (Ground-Truth Corpora)**
Porównanie wyników silnika aplikacji z oficjalnymi tabelami referencyjnymi:
* Oficjalne tabele USDA Complete Guide to Home Canning (Bulletin 539) dla czasów pasteryzacji 40 rodzajów warzyw i owoców.
* Tabele kwasowości i stężeń solanek z Noma Guide to Fermentation.
* Skrypt różnicowy w Pythonie 3.14 (`scripts/verify_ground_truth.py`) odpalany w pipeline CI, weryfikujący zgodność do 4 miejsc po przecinku.

---

## **Warstwa 5: Baza danych SQLite i odporność na awarie (Resilience & Rollback)**
* **Zero Partial Writes:** Symulacja błędu zapisu w trakcie transakcji tworzenia partii przetworu $\to$ weryfikacja automatycznego `ROLLBACK` bazy SQLite i braku osieroconych rekordów.
* **Odporność na ubicie procesu:** Zrzut bazy w trakcie aktywnej sesji pasteryzacji $\to$ ponowne uruchomienie aplikacji $\to$ odtworzenie stanu stopera na podstawie bezwzględnego znacznika `targetDate`.
* **Roundtrip kopii zapasowej JSON:** Eksport pełnej bazy do JSON $\to$ usunięcie bazy SQLite $\to$ import z JSON $\to$ porównanie hashy SHA-256 wszystkich tabel.

---

## **Warstwa 6: Macierz komponentów UI (React Native Testing Library)**
Każdy komponent i ekran testowany w 4 podstawowych stanach:
1. Stan pusty (Empty State — np. brak słoików w spiżarni z zachętą do utworzenia partii).
2. Stan wprowadzania danych z dynamiczną walidacją błędów (np. wpisanie stężenia soli 90% wyświetla ostrzeżenie).
3. Stan aktywnego procesu (pasek postępu pasteryzacji).
4. Stan sukcesu (potwierdzenie dodania partii, podgląd wygenerowanej etykiety PNG).

---

## **Warstwa 7: Scenariusze E2E Maestro na symulatorze iOS**
Automatyczne testy end-to-end symulujące realne gesty użytkownika na symulatorze iPhone'a:

### **Scenariusz 01: Utworzenie partii ogórków kiszonych (`.maestro/01-ogorki-batch.yaml`)**
```yaml
appId: com.apps4brew.preserves
---
- launchApp
- assertVisible: "Słoik"
- tapOn: "Nowa Partia"
- tapOn: "Ogórki kiszone"
- inputText: "1500" # 1500g ogórków
- tapOn: "Dalej"
- assertVisible: "Zalecana sól: 33.8 g"
- tapOn: "Zatwierdź i Rozpocznij"
- assertVisible: "Faza 1: Fermentacja wstępna"
```

### **Scenariusz 02: Pasteryzacja i alarm na ekranie (`.maestro/02-pasteryzacja-timer.yaml`)**
```yaml
appId: com.apps4brew.preserves
---
- launchApp
- tapOn: "Pasteryzacja"
- tapOn: "Kąpiel wodna"
- tapOn: "Słoik 0.9L"
- tapOn: "Start odliczania"
- assertVisible: "15:00"
```

### **Scenariusz 03: Diagnostyk problemu Kahm (`.maestro/03-doktor-kahm.yaml`)**
```yaml
appId: com.apps4brew.preserves
---
- launchApp
- tapOn: "Pomoc i Diagnostyka"
- tapOn: "Biały nalot na powierzchni"
- tapOn: "Płaska, matowa błonka"
- assertVisible: "Diagnoza: Drożdże kożuchujące (Kahm)"
- assertVisible: "Nalot jest nieszkodliwy"
```

---

## **Warstwa 8: Kontrakty Dostępności (Apple HIG, WCAG AAA, VoiceOver)**
* Minimalne cele dotykowe $56\times 56\,\text{pt}$ w widokach kuchennych weryfikowane automatycznym testem statycznym `accessibility-touch-target.test.tsx`.
* Poprawność hierarchii dostępności: brak elementów klikalnych bez etykiet VoiceOver.
* Dynamic Type: automatyczny rendering komponentów przy rozmiarach czcionki od `Medium` do `AccessibilityXXL`.

---

## **Warstwa 9: Strażnicy Architektury i Bezpieczeństwa (Guard Tests)**
Zautomatyzowane testy statyczne weryfikujące architekturę przed każdym commitem:
* `network-guard.test.ts`: Skanowanie całego kodu źródłowego `src/` pod kątem obecności nieautoryzowanych wywołań sieciowych (`fetch`, `XMLHttpRequest`, `axios`). Dozwolony wyłącznie lokalny dostęp do bazy SQLite i systemu plików.
* `sql-injection-guard.test.ts`: Weryfikacja, że 100% zapytań do SQLite korzysta ze sparametryzowanych zmiennych wiązanych (`?`) — zakaz konkatenacji ciągów tekstowych w zapytaniach SQL.
* `close-button-guard.test.tsx`: Weryfikacja zasady projektowej studia — każde okno modalne posiada widoczny, spójny przycisk „Anuluj” po lewej stronie nagłówka (`headerLeft`).

""")

print("Expanded D4 written successfully.")
