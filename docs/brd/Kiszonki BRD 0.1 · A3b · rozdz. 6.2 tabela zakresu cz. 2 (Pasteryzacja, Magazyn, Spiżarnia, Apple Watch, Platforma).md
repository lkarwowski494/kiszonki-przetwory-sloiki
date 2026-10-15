# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3b: Tabela zakresu funkcjonalnego cz. 2 (Z-111…Z-220)**

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

