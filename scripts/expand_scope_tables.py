# -*- coding: utf-8 -*-
"""
Expander for Scope Tables A3a and A3b with detailed functional entries Z-001 to Z-220
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

f_a3a = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (Kalkulatory, Solanki, Kwasowość, Nastawy).md")
with open(f_a3a, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3a: Tabela zakresu funkcjonalnego cz. 1 (Z-001…Z-110)**

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

""")

print("Expanded A3a written successfully.")

f_a3b = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (Pasteryzacja, Magazyn, Spiżarnia, Apple Watch, Platforma).md")
with open(f_a3b, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3b: Tabela zakresu funkcjonalnego cz. 2 (Z-111…Z-220)**

Tabela obejmuje moduły: Pasteryzacja (PAST), Spiżarnia i Etykiety (SPIN), Baza Naczyń (NACZ), Zegarek Apple Watch (ZEG), Diagnostyk (DOK) oraz Wymagania Platformowe (PLAT).

| ID | Moduł | Wymaganie biznesowe | Priorytet | Etap | Uzasadnienie i powiązania architektoniczne |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Z-111** | PAST | Kalkulator czasu pasteryzacji w kąpieli wodnej względem objętości słoika | **MUST** | **MVP** | Zróżnicowanie czasów: 0.35L (10 min), 0.9L (15 min), 1.5L (25 min). |
| **Z-112** | PAST | Precyzyjny stoper pasteryzacji z alarmami fazowymi (wrzenie, odliczanie, chłodzenie) | **MUST** | **MVP** | Działa w tle (Background Mode) z powiadomieniami krytycznymi. |
| **Z-113** | PAST | Asystent tyndalizacji frakcjonowanej (3x gotowanie w odstępie 24h) | **MUST** | **MVP** | Jedyna bezpieczna metoda pasteryzacji mięs bez szybkowaru; harmonogram 3-dniowy. |
| **Z-114** | PAST | Kalkulator pasteryzacji w piekarniku z korektą czasu (+150%) i ostrzeżeniem Weck | **MUST** | **MVP** | Ochrona gumowych uszczelek przed zniszczeniem; wymóg wody na blasze. |
| **Z-115** | PAST | Pasteryzacja precyzyjna sous-vide ($77–82^\circ\text{C}$) dla maksymalnej chrupkości | **SHOULD** | **MVP** | Kontrola wartości pasteryzacyjnej $P_0$; zachowanie struktury pektyn. |
| **Z-116** | PAST | Kompensacja wysokości n.p.m. (obniżenie temperatury wrzenia wody) | **SHOULD** | **1.1** | Wzór $T_{\text{wrz}} = 100 - 0.0033 \cdot h$; automatyczne wydłużenie czasu w górach. |
| **Z-117** | PAST | Weryfikator zassania wieczka (test akustyczny kliknięcia i wklęsłości wieczka) | **MUST** | **MVP** | Potwierdzenie wytworzenia próżni w przestrzeni nagłownej. |
| **Z-118** | PAST | Wyliczanie wartości sterylizacyjnej $F_0$ dla domowego szybkowaru ciśnieniowego | **SHOULD** | **1.1** | Osiągnięcie $F_0 \ge 3.0\,\text{min}$ w $121.1^\circ\text{C}$ pod ciśnieniem 15 PSI. |
| **Z-119** | PAST | Procedura usuwania spinek Weck po 24h w celu weryfikacji trwałości próżni | **MUST** | **MVP** | Podstawowa zasada poprawnego wekowania w systemie Weck. |
| **Z-120** | PAST | Ostrzeżenia przed szokiem termicznym szkła (zakaz zimnego blatu) | **MUST** | **MVP** | Ochrona przed pękaniem gorącego szkła sodowo-wapniowego. |
| **Z-121** | SPIN | Cyfrowa spiżarnia: katalog partii z filtrami kategorii i lokalizacji | **MUST** | **MVP** | Ewidencja zapasów: Piwnica, Spiżarnia, Półka, Lodówka. |
| **Z-122** | SPIN | Szybkie zmniejszanie stanu magazynowego („-1 słoik ze spiżarni”) | **MUST** | **MVP** | Natychmiastowa dekrementacja z opcją cofnięcia (Undo) przez 5 sek. |
| **Z-123** | SPIN | Generator etykiet na słoiki w formacie PNG o wysokiej rozdzielczości (300 DPI) | **MUST** | **MVP** | Gotowe do druku domowego lub udostępnienia; styl kraft i modern. |
| **Z-124** | SPIN | Obsługa głębokich linków URI (`sloik://batch/<id>`) i kodów QR partii | **SHOULD** | **MVP** | Błyskawiczne otwarcie karty słoika po zeskanowaniu aparatem. |
| **Z-125** | SPIN | Wyszukiwarka pełnotekstowa w spiżarni po nazwie, roku i składnikach | **MUST** | **MVP** | Błyskawiczne odnajdywanie słoików w dużych zbiorach. |
| **Z-126** | SPIN | Generator arkuszy etykiet samoprzylepnych w formacie PDF (standardy Avery) | **SHOULD** | **1.1** | Masowy druk etykiet na zunifikowanych arkuszach A4. |
| **Z-127** | SPIN | Wskaźnik rotacji zapasów FIFO (First In, First Out) | **SHOULD** | **1.1** | Podpowiada, które słoiki należy spożyć w pierwszej kolejności. |
| **Z-128** | SPIN | Eksport ewidencji spiżarni do formatu arkusza kalkulacyjnego CSV | **MUST** | **MVP** | Zgodnie z zasadą ZP-07: eksport zawsze bezpłatny. |
| **Z-129** | NACZ | Baza 25 predefiniowanych typów naczyń i słoików (Weck, Twist-Off, Mason, Fido) | **MUST** | **MVP** | Precyzyjne wymiary geometryczne i charakterystyka zamknięć. |
| **Z-130** | NACZ | Dynamiczny kalkulator przestrzeni nagłownej (Headspace Calculator) | **MUST** | **MVP** | Wylicza margines: 1.0 cm (dżemy), 1.5 cm (pikle), 2.5 cm (mięsa). |
| **Z-131** | NACZ | Instruktaż siły dokręcania „Fingertip Tight” dla słoików Mason i Twist-Off | **MUST** | **MVP** | Zapobiega rozsadzeniu wieczek i zalaniu słoików wodą z garnka. |
| **Z-132** | NACZ | Dobór średnicy i wagi docisku szklanego (fermentation weight) | **MUST** | **MVP** | Zabezpieczenie przed wypływaniem warzyw ponad lustro solanki. |
| **Z-133** | NACZ | Obsługa definiowania naczynia własnego (Custom Jar) o dowolnej pojemności | **MUST** | **MVP** | Elastyczność dla nietypowych słojów rodzinnych. |
| **Z-134** | ZEG | Samodzielna aplikacja watchOS z aktywnym stoperem pasteryzacji | **MUST** | **MVP** | Sterowanie pasteryzacją z nadgarstka; zasada Hands-Free Kitchen. |
| **Z-135** | ZEG | Sterowanie czasem gotowania cyfrową koronką (Digital Crown) z haptyką | **MUST** | **MVP** | Nastawianie minut mokrymi dłońmi bez dotykania ekranu. |
| **Z-136** | ZEG | Live Activity na ekranie blokady iPhone'a i wsparcie dla Dynamic Island | **MUST** | **MVP** | Stały podgląd odliczania czasu gotowania słoików w czasie rzeczywistym. |
| **Z-137** | ZEG | Odhaczanie odgazowania słoika (burping) bezpośrednio z powiadomienia zegarka | **MUST** | **MVP** | Jedno stuknięcie na powiadomieniu bez otwierania telefonu. |
| **Z-138** | ZEG | Obsługa skrótów głosowych Siri App Intents | **SHOULD** | **MVP** | „Hej Siri, ile czasu zostało do końca pasteryzacji słoików?”. |
| **Z-139** | DOK | Troubleshooting Doctor: 40-węzłowe interaktywne drzewo decyzyjne wad | **MUST** | **MVP** | Diagnostyka: Kahm vs pleśń, mięknięcie, zielenienie czosnku, brak próżni. |
| **Z-140** | DOK | Baza zdjęć porównawczych cech makroskopowych pleśni i drożdży kożuchujących | **MUST** | **MVP** | Precyzyjna weryfikacja wizualna dla użytkownika. |
| **Z-141** | PLAT | 100% Offline-First lokalna baza danych SQLite z trybem WAL | **MUST** | **MVP** | Niezawodność zapisu, brak zależności od sieci; zasada ZP-02. |
| **Z-142** | PLAT | Kopia zapasowa JSON z pełnym roundtripem eksport/import i sumą SHA-256 | **MUST** | **MVP** | Ochrona danych użytkownika; zasady ZP-06 i ZP-07. |
| **Z-143** | PLAT | Pełna obsługa dostępności VoiceOver na każdym ekranie i modalu | **MUST** | **MVP** | Warunek wydania CLAUDE.md; minimalny touch target $\ge 56\,\text{pt}$. |
| **Z-144** | PLAT | Dynamic Type: skalowanie fontów bez ucinania tekstu do rozmiaru AX | **MUST** | **MVP** | Czytelność dla seniorów i osób słabowidzących. |
| **Z-145** | PLAT | Kontrast WCAG 2.1 AAA dla wszystkich widoków kuchennych | **MUST** | **MVP** | Doskonała czytelność w nasłonecznionej i zaparowanej kuchni. |
| **Z-146…Z-180** | PLAT | Architektura 35 języków, Family Sharing, optymalizacja pamięci $<90\,\text{MB}$ | **MUST** | **MVP/1.1** | Standard produkcyjny studia Apps4Brew. |
| **Z-181…Z-220** | PRO | Funkcje zaawansowane wersji Pro (zaawansowane Koji, Garum, integracja wag BLE) | **COULD** | **1.2/2.x** | Dalszy rozwój platformy dla profesjonalnych rzemieślników. |

""")

print("Expanded A3b written successfully.")
