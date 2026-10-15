# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3a: Tabela zakresu funkcjonalnego cz. 1 (Z-001…Z-110)**

Poniższa tabela stanowi twardą specyfikację zakresu dla modułów: Kalkulatory solanek (SOL), Monitor fermentacji (FERM), Kwasowość i Refraktometria (BRIX) oraz Bazowe Tradycje Świata (TRAD).

| ID | Moduł | Wymaganie biznesowe | Priorytet | Etap | Uzasadnienie i powiązania architektoniczne |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Z-001** | SOL | Kalkulator stężenia solanki w całkowitej masie ($M_{warzywa} + M_{woda}$) | **MUST** | **MVP** | Eliminuje błąd rozcieńczenia osmotycznego; wzór RD-01. |
| **Z-002** | SOL | Tradycyjny kalkulator solanki zalewowej (% wagowy w samej wodzie) | **MUST** | **MVP** | Kompatybilność ze starymi przepisami rodzinnymi; wzór RD-02. |
| **Z-003** | SOL | Symulator równowagi osmotycznej po 48h i 14 dniach kiszenia | **SHOULD** | **MVP** | Pokazuje dynamiczny spadek stężenia soli; wzór RD-03. |
| **Z-004** | SOL | Korektor typu soli (kamienna niejodowana, morska, koszerna, warzona) | **MUST** | **MVP** | Sole z antyzbrylaczem ($E536$) powodują mętnienie i szary osad. |
| **Z-005** | SOL | Kalkulator solenia na sucho dla kapusty i kimchi (2.0–2.5% masy) | **MUST** | **MVP** | Podstawa fermentacji bezzalewowej; wzór RD-04. |
| **Z-006** | SOL | Dozownik soli pektynującej (chlorek wapnia $CaCl_2$, 0.05–0.1%) dla chrupkości | **SHOULD** | **MVP** | Ochrona przed mięknięciem enzymatycznym; wzór RD-05. |
| **Z-007** | SOL | Rekomendator naturalnych źródeł garbników (liście dębu, wiśni, porzeczki, chrzan) | **MUST** | **MVP** | Garbniki hamują poligalakturonazę; wzór RD-07. |
| **Z-008** | SOL | Przelicznik objętości łyżek/łyżeczek na gramy w zależności od gradacji soli | **MUST** | **MVP** | Różnica gęstości soli koszernej i warzonej sięga 40%; wzór RD-06. |
| **Z-009** | SOL | Kalkulator stężenia solanki dla całych główek kapusty kiszonej w beczce | **SHOULD** | **1.1** | Wymaga mocniejszej solanki (4.0%) ze względu na wolniejszą dyfuzję. |
| **Z-010** | SOL | Dozowanie witaminy C (kwas L-askorbinowy) jako antyoksydanta wierzchniego | **COULD** | **1.1** | Zapobiega szarzeniu wierzchniej warstwy kiszonek. |
| **Z-011** | SOL | Kalkulator solanki dla kiszonych cytryn marokańskich (12–15% soli) | **MUST** | **MVP** | Ekstremalne stężenie hamujące wszelką mikroflorę poza halofilami. |
| **Z-012** | SOL | Kalkulator solanki dla fermentowanych grzybów leśnych (rydze, maślaki) | **SHOULD** | **MVP** | Specyfika śluzu grzybowego i wymagane wstępne blanszowanie. |
| **Z-013** | SOL | Przelicznik jednostek metrycznych na imperialne (g/ml $\leftrightarrow$ oz/fl oz) | **MUST** | **MVP** | Kluczowe dla ekspansji w USA i UK; moduł `Intl`. |
| **Z-014** | SOL | Zapisywanie własnych profili solankowych użytkownika | **SHOULD** | **MVP** | Personalizacja i powtarzalność receptur. |
| **Z-015** | FERM | Kreator nowej partii kiszonki z szablonu lub od zera | **MUST** | **MVP** | Szybki 3-krokowy kreator z walidacją danych wejściowych. |
| **Z-016** | FERM | Wizualna oś czasu fermentacji z podziałem na fazy mikrobiologiczne | **MUST** | **MVP** | Faza 1 (Leuconostoc) $\to$ Faza 2 (L. plantarum) $\to$ Faza 3 (stabilizacja). |
| **Z-017** | FERM | Harmonogram alertów o odgazowaniu („odbiciu” słoika / burping) | **MUST** | **MVP** | Ochrona przed eksplozją słoików Twist-Off i Mason; interwał 12h/48h. |
| **Z-018** | FERM | Adaptacja czasu fermentacji do temperatury otoczenia ($18^\circ\text{C}$ vs $24^\circ\text{C}$) | **MUST** | **MVP** | Reguła van 't Hoffa ($Q_{10} \approx 2.0$); dynamiczna korekta kalendarza. |
| **Z-019** | FERM | Cyfrowa karta partii: składniki, data nastawu, użyty słoik, notatki | **MUST** | **MVP** | Relacyjny paszport partii w tabeli `batches`. |
| **Z-020** | FERM | Dziennik odczytów sensorycznych partii (zapach, piana, mętność, smak) | **SHOULD** | **MVP** | Rejestracja organoleptyczna w tabeli `measurements`. |
| **Z-021** | FERM | Obsługa fermentacji wieloetapowej (solenie kapusty $\to$ fermentacja kimchi) | **MUST** | **MVP** | Zgodność z tradycyjnym procesem Kimjang. |
| **Z-022** | FERM | Monitor fermentacji kombuchy (faza F1 tlenowa i faza F2 butelkowa) | **SHOULD** | **MVP** | Bezpieczna kontrola nasycenia $CO_2$ w butelkach swing-top. |
| **Z-023** | FERM | Asystent żywych octów owocowych z matką octową (fermentacja dwufazowa) | **SHOULD** | **MVP** | Faza alkoholowa (Saccharomyces) $\to$ kwasowa (Acetobacter). |
| **Z-024** | FERM | Monitor fermentacji czosnku w miodzie (codzienne odwracanie słoika) | **SHOULD** | **MVP** | Równomierne nasycenie ząbków i kontrola wilgotności miodu. |
| **Z-025** | FERM | Asystent japońskich pikli Nukazuke w sfermentowanych otrębach ryżowych | **COULD** | **1.1** | Harmonogram codziennego ręcznego napowietrzania łoża otrębowego. |
| **Z-026** | FERM | Monitor fermentacji Shio-koji (mieszanie przez 7–10 dni w temperaturze pokojowej) | **SHOULD** | **1.1** | Enzymatyczna autoliza skrobi i białek ryżu. |
| **Z-027** | FERM | Wyciszanie i przenoszenie partii do stanu dojrzałego w spiżarni | **MUST** | **MVP** | Zmiana statusu na `mature_in_pantry` i dodanie do magazynu. |
| **Z-028** | FERM | Rejestracja temperatury chłodzenia w lodówce ($4^\circ\text{C}$) | **MUST** | **MVP** | Zatrzymanie gwałtownej fermentacji i stabilizacja smaku. |
| **Z-029** | FERM | Archiwum partii historycznych z klonowaniem udanych receptur | **MUST** | **MVP** | Powtarzalność udanych nastawów z poprzednich lat. |
| **Z-030** | FERM | Alerty o konieczności nakłucia kapusty w celu uwolnienia siarkowodoru | **SHOULD** | **MVP** | Eliminacja gorzkich i siarkowych posmaków w kapuście. |
| **Z-031** | FERM | Kontrola poziomu wody w rowku kamionki fermentacyjnej | **SHOULD** | **MVP** | Zabezpieczenie przed wyschnięciem uszczelnienia hydraulicznego. |
| **Z-032** | FERM | Tryb fermentacji próżniowej w workach zgrzewanych (Vacuum Fermentation) | **COULD** | **1.2** | Technika restauracyjna (Noma Guide) dla nowoczesnych szefów kuchni. |
| **Z-033** | BRIX | Kalkulator zżelowania pektyn i zawartości cukru ($^\circ\text{Bx}$) w dżemach | **MUST** | **MVP** | Optymalny punkt żelowania: $65^\circ\text{Bx}$ dla tradycyjnych, $35^\circ\text{Bx}$ dla LM. |
| **Z-034** | BRIX | Twardy strażnik kwasowości pH 4.6 (czerwona flaga botulinowa) | **MUST** | **MVP** | Fundamentalny warunek bezpieczeństwa sanitarnego USDA/FDA. |
| **Z-035** | BRIX | Rejestrator pomiarów pH-metrem z kompensacją temperatury (ATC) | **SHOULD** | **MVP** | Korekta odczytu elektrody według równania Nernsta. |
| **Z-036** | BRIX | Przelicznik mocy i rozcieńczeń kwasu octowego (10% $\leftrightarrow$ 5% $\leftrightarrow$ 6%) | **MUST** | **MVP** | Elastyczna adaptacja przepisów zagranicznych; wzór RD-18. |
| **Z-037** | BRIX | Kalkulator kwasowości miareczkowej (Total Acidity — TA) | **COULD** | **1.2** | Precyzyjne miareczkowanie roztworem $0.1\,\text{M NaOH}$. |
| **Z-038** | BRIX | Obliczanie optymalnej dawki soku z cytryny dla zakwaszenia przetworów pomidorowych | **MUST** | **MVP** | 2 łyżki soku z cytryny na 1 litr dla obniżenia pH poniżej 4.2. |
| **Z-039** | BRIX | Weryfikacja stężenia alkoholu potencjalnego w moszczu owocowym | **SHOULD** | **1.1** | Ocena bazy surowcowej pod kątem produkcji octu. |
| **Z-040** | BRIX | Alarm o niebezpiecznym wzroście pH w fermentacjach warzywnych | **MUST** | **MVP** | Wykrywanie metabolizmu kwasów przez drożdże kożuchujące. |
| **Z-041…Z-075** | TRAD | Baza 35 tradycyjnych polskich i słowiańskich receptur kiszonek i zakwasów | **MUST** | **MVP** | Ogórki małosolne, kiszone, kapusta z kminkiem, barszcz, żur, rydze. |
| **Z-076…Z-090** | TRAD | Baza 15 tradycji koreańskich (Baechu Kimchi, Kkakdugi, Dongchimi, Pa Kimchi) | **MUST** | **MVP** | Receptury zweryfikowane z Korea Food Research Institute. |
| **Z-091…Z-100** | TRAD | Baza 10 tradycji japońskich (Asazuke, Shiozuke, Umeboshi, Shio-koji) | **SHOULD** | **MVP** | Autentyczne proporcje soli i alg kombu. |
| **Z-101…Z-110** | TRAD | Baza 10 tradycji Bliskiego Wschodu i Maghrebu (Torshi left, Makdous, cytryny) | **SHOULD** | **MVP** | Tradycyjne procedury odwadniania bakłażanów i solenia cytryn. |

