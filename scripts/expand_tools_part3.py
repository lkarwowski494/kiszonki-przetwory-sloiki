# -*- coding: utf-8 -*-
"""
Expander for Tools (B4 to B8) and Market Analysis (A2)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# B4 Spiżarnia Full Detail
f_b4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B4 · rozdz. 7 narzędzia - Spiżarnia i zarządzanie partiami (Batch Tracker), etykiety z kodami QR i ubywanie zapasów.md")
with open(f_b4, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B4: Spiżarnia i zarządzanie partiami (Rozdz. 7)**

Moduł odpowiada za cyfrową ewidencję gotowych przetworów, kontrolę dat ważności i etykiety QR. Obejmuje wymagania od `BR-SPIN-001` do `BR-SPIN-036`.

---

### **BR-SPIN-001: Widok Spiżarni z podziałem na kategorie i lokalizacje**
* **Opis:** Katalog przetworów pogrupowany według kategorii (Kiszonki, Pikle octowe, Dżemy i powidła, Przetwory pomidorowe, Mięsa i ryby, Napoje probiotyczne, Syropy) oraz opcjonalnego podziału na fizyczne lokalizacje (Piwnica, Spiżarnia kuchenna, Półka w garażu, Lodówka).
* **Persona:** P2 (Babcia Stasia), P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:**
  1. Wyświetlenie sumarycznego paska statystyk: łączna liczba słoików, łączna objętość w litrach, najstarszy aktywny rocznik.
  2. Szybkie filtry: „Tylko gotowe do spożycia”, „W trakcie dojrzewania”, „Kończące się zapasy ($\le 2$ słoiki)”.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-002: Szybkie zmniejszanie stanu magazynowego („-1 słoik ze spiżarni”)**
* **Opis:** Jedno dotknięcie na liście partii dekrementuje stan magazynowy o 1 sztukę (np. po wyniesieniu słoika do obiadu).
* **Persona:** P2 (Babcia Stasia).
* **Kryteria akceptacji:**
  1. Zmiana stanu zapisuje się natychmiast w bazie SQLite.
  2. Po osiągnięciu 0 partia automatycznie przechodzi do sekcji „Zapasy wyczerpane” z opcją powtórzenia przepisu jednym kliknięciem.
  3. Pływający pasek powiadomienia (Toast) umożliwia natychmiastowe cofnięcie akcji (Undo) przez 5 sekund.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-003: Generator etykiet na słoiki (PNG o wysokiej rozdzielczości)**
* **Opis:** Generuje estetyczną, wektorową etykietę graficzną w rozdzielczości 300 DPI gotową do wydruku na domowej drukarce lub przesłania przez AirDrop/AirPrint.
* **Persona:** P2, P3.
* **Kryteria akceptacji:** Etykieta zawiera nazwę przetworu, rok nastawu, kluczowe składniki, stężenie soli/cukru, piktogram ostrości/kwaśności oraz kod identyfikacyjny partii.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-SPIN-004: Obsługa kodów URI i kodów QR partii**
* **Opis:** Każda wygenerowana etykieta zawiera kod QR kodujący głęboki link URL (`sloik://batch/<uuid>`). Zeskanowanie aparatem iPhone'a natychmiast otwiera aplikację bezpośrednio na karcie danego słoika.
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Pełna obsługa offline bez konieczności połączenia z internetem.
* **Priorytet:** **SHOULD** · **Etap:** **MVP**.

### **BR-SPIN-005…BR-SPIN-036: Kompletny katalog wymagań modułu spiżarni:**
* `BR-SPIN-005`: Przypomnienia o zbliżającym się zalecanym terminie spożycia (Best Before).
* `BR-SPIN-006`: Kalkulator kosztu surowców w przeliczeniu na 1 słoik (ekonomia domowa).
* `BR-SPIN-007`: Wyszukiwarka pełnotekstowa (Full-Text Search) w spiżarni po nazwie, roku i składnikach.
* `BR-SPIN-008`: Sortowanie spiżarni: wg daty nastawu, liczby słoików, alfabetycznie, wg lokalizacji.
* `BR-SPIN-009`: Ręczna korekta stanu słoików w partii (+1, -1, edycja liczby całkowitej).
* `BR-SPIN-010`: Rejestracja słoików podarowanych znajomym (funkcja „Podaruj słoik”).
* `BR-SPIN-011`: Ocena gwiazdkowa partii (1–5 gwiazdek) po otwarciu pierwszego słoika.
* `BR-SPIN-012`: Oznaczanie słoików z wadami (np. rozszczelnione, zbyt kwaśne).
* `BR-SPIN-013`: Eksport ewidencji spiżarni do pliku CSV zgodnego z arkuszem kalkulacyjnym.
* `BR-SPIN-014`: Generator arkuszy etykiet samoprzylepnych w formacie PDF (standardy Avery A4).
* `BR-SPIN-015`: Dedykowany szablon etykiet na małe wieczka Twist-Off ($\varnothing 43\,\text{mm}$ i $\varnothing 66\,\text{mm}$).
* `BR-SPIN-016`: Oznaczanie słoików wymagających przechowywania w lodówce.
* `BR-SPIN-017`: Automatyczna sugestia ponownego nastawu przed nadejściem sezonu warzywnego.
* `BR-SPIN-018`: Filtrowanie partii według zawartości alergenów (gorczyca, seler).
* `BR-SPIN-019`: Dziennik otwarcia słoika: rejestracja daty otwarcia i sugerowany czas na spożycie po rozpieczętowaniu.
* `BR-SPIN-020`: Tryb inwentaryzacji spiżarni (szybkie skanowanie słoików aparatem jeden po drugim).
* `BR-SPIN-021`: Dołączanie notatki o źródle surowca (np. „Ogórki z targu od pani Marysi”).
* `BR-SPIN-022`: Podgląd historii ubywania zapasów w postaci wykresu liniowego.
* `BR-SPIN-023`: Obsługa etykiet w stylu retro (imitacja papieru kraftowego).
* `BR-SPIN-024`: Obsługa etykiet minimalistycznych nowoczesnych (styl laboratoryjny).
* `BR-SPIN-025`: Grupowe przenoszenie słoików między lokalizacjami (np. z kuchni do piwnicy).
* `BR-SPIN-026`: Rejestracja zwrotu pustych słoików od obdarowanych znajomych.
* `BR-SPIN-027`: Zabezpieczenie przed usunięciem partii z dodatnimi zapasami.
* `BR-SPIN-028`: Wsparcie dla czytników kodów kreskowych Bluetooth (dla entuzjastów).
* `BR-SPIN-029`: Rejestracja wilgotności względnej w piwnicy (optymalnie $<70\%$ dla ochrony pokrywek przed korozją).
* `BR-SPIN-030`: Oznaczanie słoików przeznaczonych na konkursy kulinarne lub jarmarki.
* `BR-SPIN-031`: Wyliczanie całkowitej wagi zapasów (dla kontroli nośności półek drewnianych w piwnicy).
* `BR-SPIN-032`: Integracja spiżarni z widżetem na ekranie początkowym iOS.
* `BR-SPIN-033`: Wskaźnik rotacji zapasów (FIFO — First In, First Out).
* `BR-SPIN-034`: Oznaczanie słoików eksperymentalnych (np. test nowego szczepu LAB).
* `BR-SPIN-035`: Dzielenie partii na podpartie (np. 6 słoików łagodnych, 4 słoiki z chili).
* `BR-SPIN-036`: Roczne podsumowanie sezonu: infografika przetwórcza z podsumowaniem litrów.

""")

print("Expanded B4 written successfully.")

# B5 Naczynia i Headspace Full Detail
f_b5 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B5 · rozdz. 7 narzędzia - Baza naczyń, słoików (Weck, Twist-Off, Mason, Kamionka) i kontrola przestrzeni nagłownej (headspace).md")
with open(f_b5, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B5: Baza naczyń i przestrzeń nagłowna (Headspace) (Rozdz. 7)**

Moduł odpowiada za geometrię, mechanikę fizyczną zamknięć i szczelność naczyń. Obejmuje wymagania od `BR-NACZ-001` do `BR-NACZ-024`.

---

### **BR-NACZ-001: Baza 25 predefiniowanych typów naczyń i słoików**
* **Opis:** Zawiera charakterystyki fizyczne i modele geometryczne najpopularniejszych naczyń:
  1. **Słoiki Weck:** typ Tulip, Cylinder, Deco, Mold (pojemności 220ml, 370ml, 580ml, 850ml, 1062ml, 1590ml) ze spinkami sprężynowymi i uszczelkami kauczukowymi.
  2. **Słoiki Twist-Off:** standardowe słoiki dżemowe i ogórkowe (pojemności 200ml, 315ml, 540ml, 720ml, 900ml) z wieczkami 4- i 6-zaczepowymi z uszczelką plastizolową i przyciskiem próżniowym (klik).
  3. **Słoiki typu Mason / Ball (USA):** Regular Mouth i Wide Mouth (pojemności Half-Pint 240ml, Pint 480ml, Quart 950ml, Half-Gallon 1900ml) z wieczkiem dwuczęściowym (blaszka dociskowa + gwintowany pierścień).
  4. **Słoiki z klamrą drutową (Fido / Bormioli / Kilner):** gruba uszczelka gumowa, stały zacisk stalowy.
  5. **Kamionki fermentacyjne:** tradycyjne garnki gliniane szkliwione (3L, 5L, 10L) oraz kamionki z hermetycznym rowkiem wodnym.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:** Wybór naczynia automatycznie konfiguruje parametry pasteryzacji, siłę dokręcenia i wymagany headspace.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-002: Dynamiczny kalkulator przestrzeni nagłownej (Headspace Calculator)**
* **Opis:** Wylicza precyzyjną wolną przestrzeń między powierzchnią wsadu a krawędzią słoika:
  * Dżemy, galaretki i powidła pektynowe: $0.6–1.0\,\text{cm}$ ($1/4\,\text{cala}$).
  * Kiszonki, owoce i pikle w zalewie wodno-octowej: $1.2–1.5\,\text{cm}$ ($1/2\,\text{cala}$).
  * Przetwory mięsne, pasztety i fasolka szparagowa: $2.0–2.5\,\text{cm}$ ($1\,\text{cal}$) ze względu na rozszerzalność cieplną białek i tłuszczów.
* **Persona:** P1, P4.
* **Kryteria akceptacji:** Wizualny model słoika z animowaną podziałką w milimetrach pokazujący prawidłowy poziom napełnienia.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-003: Weryfikator siły dokręcania „Fingertip Tight” dla słoików Mason i Twist-Off**
* **Opis:** Instruktaż i procedury dokręcania nakrętek przed pasteryzacją:
  * Słoiki Mason: dokręcanie pierścienia wyłącznie siłą opuszków palców bez użycia siły nadgarstka (umożliwia ujście rozszerzającego się powietrza).
  * Słoiki Weck: założenie 2 sprężynujących spinek naprzeciwko siebie (spinki działają jak zawór jednokierunkowy).
* **Persona:** P1, P2.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-NACZ-004…BR-NACZ-024: Pozostałe wymagania modułu naczyń:**
* `BR-NACZ-004`: Dobór średnicy i wagi docisku szklanego (Fermentation Glass Weight) w zależności od średnicy szyjki słoika.
* `BR-NACZ-005`: Obsługa definiowania naczynia niestandardowego (Custom Jar) przez podanie pojemności i typu zamknięcia.
* `BR-NACZ-006`: Ostrzeżenie przed pasteryzacją słoików z klamrą drutową Fido (ryzyko pęknięcia szkła pod stałym naciskiem drutu).
* `BR-NACZ-007`: Test szczelności uszczelek gumowych Weck (rozciąganie gumki w dłoniach pod kątem mikropęknięć).
* `BR-NACZ-008`: Procedura wyparzania i sterylizacji naczyń przed napełnieniem.
* `BR-NACZ-009`: Weryfikacja powłoki lakierniczej na wieczkach Twist-off (zakaz używania wieczek z rysami do kwasów).
* `BR-NACZ-010`: Kalkulator pojemności użytkowej garnka do pasteryzacji (ile słoików danego typu zmieści się na jednym poziomie).
* `BR-NACZ-011`: Instrukcja piętrowania słoików w wysokim garnku pasteryzacyjnym z przekładką.
* `BR-NACZ-012`: Wskaźnik odporności termicznej szkła (maksymalny bezpieczny szok termiczny $\Delta T \le 40^\circ\text{C}$).
* `BR-NACZ-013`: Dedykowane wytyczne dla butelek z zamknięciem pałąkowym (Swing-Top) do kombuchy.
* `BR-NACZ-014`: Ostrzeżenie przed używaniem butelek dekoracyjnych o cienkich ściankach do napojów gazowanych.
* `BR-NACZ-015`: Rejestracja wieku i liczby cykli użycia uszczelek gumowych.
* `BR-NACZ-016`: Asystent doboru rurki fermentacyjnej (bulgotki plastikowej vs szklanej).
* `BR-NACZ-017`: Instrukcja napełniania rowka wodnego kamionki (olej jadalny na wierzch wody zapobiegający odparowywaniu).
* `BR-NACZ-018`: Kalkulator rozszerzalności termicznej zalewy octowej w funkcji temperatury.
* `BR-NACZ-019`: Procedura usuwania pęcherzyków powietrza (Debubbling) za pomocą niemetalowej łopatki przed zamknięciem słoika.
* `BR-NACZ-020`: Weryfikacja czystości rantu słoika (przecieranie krawędzi ręcznikiem papierowym przed nałożeniem pokrywki).
* `BR-NACZ-021`: Baza rekomendowanych producentów szkła rzemieślniczego.
* `BR-NACZ-022`: Zapisywanie ulubionego naczynia domyślnego dla profilu użytkownika.
* `BR-NACZ-023`: Instrukcja otwierania zawekowanego słoika Weck przez pociągnięcie języczka uszczelki.
* `BR-NACZ-024`: Ostrzeżenie przed podważaniem nożem wieczek Twist-Off (niszczenie gwintu słoika).

""")

print("Expanded B5 written successfully.")

# B6, B7, B8 and A2 Expansions
f_b6 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B6 · rozdz. 7 narzędzia - Refraktometria Brix, pH-metria i pomiary kwasowości miareczkowej (TA).md")
with open(f_b6, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B6: Refraktometria Brix i pH-metria (Rozdz. 7)**

Moduł odpowiada za analizę laboratoryjną parametrów fizykochemicznych nastawu. Obejmuje wymagania od `BR-BRIX-001` do `BR-BRIX-020`.

---

### **BR-BRIX-001: Cyfrowy rejestrator kwasowości pH z kompasem bezpieczeństwa**
* **Opis:** Rejestracja odczytu kwasowości pH z cyfrowego pH-metru lub paska lakmusowego z natychmiastową interpretacją sanitarną:
  * $\text{pH} \le 4.20$: Strefa bezpieczna (kolor zielony) — aktywność bakterii LAB lub octu wystarczająca.
  * $4.21 \le \text{pH} \le 4.59$: Strefa ostrzegawcza (kolor żółty) — niepewny stan mikrobiologiczny, zalecenie dokwaszenia.
  * $\text{pH} \ge 4.60$: Strefa krytyczna (kolor czerwony) — alarm botulinowy! Zakaz zamykania przetworu beztlenowo bez sterylizacji ciśnieniowej.
* **Persona:** P1 (Tomek), P4 (Marek).
* **Kryteria akceptacji:** Wykres historii pH partii od dnia nastawu do zakończenia fermentacji.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-BRIX-002: Kalkulator stopni Brix ($^\circ\text{Bx}$) i punktu żelowania dżemu**
* **Opis:** Przelicza odczyt refraktometru na procent wagowy sacharozy i wylicza stabilność mikrobiologiczną dżemu:
  * $\ge 65^\circ\text{Bx}$: trwałość osmotyczna (wysoki cukier hamuje rozwój pleśni i bakterii).
  * $< 60^\circ\text{Bx}$: obowiązkowa pasteryzacja termiczna.
* **Persona:** P2 (Babcia Stasia), P3 (Claire).
* **Kryteria akceptacji:** Dynamiczne wyliczanie wymaganego dodatku cukru lub odparowania wody do osiągnięcia zadanego Brix.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-BRIX-003…BR-BRIX-020: Pozostałe wymagania modułu pomiarowego:**
* `BR-BRIX-003`: Kompensacja temperatury odczytów refraktometru (automatyczna korekta dla odczytów poza $20^\circ\text{C}$).
* `BR-BRIX-004`: Obliczanie kwasowości miareczkowej (Total Acidity — TA) w przeliczeniu na g/l kwasu mlekowego lub octowego.
* `BR-BRIX-005`: Instrukcja dwupunktowej kalibracji pH-metru z buforami pH 4.01 i pH 7.00.
* `BR-BRIX-006`: Korekta Brix przy obecności alkoholu w fermentacjach kombuchy i octu.
* `BR-BRIX-007`: Rejestracja przewodności elektrycznej solanki (ocena czystości wody).
* `BR-BRIX-008`: Kalkulator proporcji pektyna-cukier-kwas dla dżemów niskosłodzonych z pektyną amidowaną.
* `BR-BRIX-009`: Przelicznik stopni Brix na ciężar właściwy (SG) i stopnie Baumé.
* `BR-BRIX-010`: Wykres kinetyki fermentacji alkoholowej i octowej w produkcji żywego octu.
* `BR-BRIX-011`: Wykrywanie zafałszowania miodu w fermentacjach miodowych na podstawie refraktometru.
* `BR-BRIX-012`: Instrukcja prawidłowego pobierania próbki solanki do pomiaru pH (zakaz wkładania sondy do całego słoika).
* `BR-BRIX-013`: Rejestracja partii papierków lakmusowych i ich zakresu (np. wąski zakres pH 3.8–5.4).
* `BR-BRIX-014`: Alarm o zbyt gwałtownym skoku kwasowości (możliwe zakażenie kwasem octowym w kiszonce).
* `BR-BRIX-015`: Obliczanie zawartości alkoholu potencjalnego na podstawie wyjściowego Brix owoców.
* `BR-BRIX-016`: Dziennik kalibracji sprzętu pomiarowego użytkownika.
* `BR-BRIX-017`: Eksport danych pomiarowych do wykresu wektorowego SVG.
* `BR-BRIX-018`: Filtrowanie mętnych próbek przed odczytem na pryzmacie refraktometru.
* `BR-BRIX-019`: Przelicznik jednostek kwasowości z francuskich stopni kwasowości na pH.
* `BR-BRIX-020`: Sugestia korekty smaku dżemu kwasem cytrynowym w przypadku zbyt mdłego profilu.

""")

print("Expanded B6 written successfully.")

# B7 and B8 Full Detail
f_b7 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B7 · rozdz. 7 narzędzia - Asystent Apple Watch, Live Activity, widżety i skróty Siri (Hands-Free w kuchni).md")
with open(f_b7, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B7: Apple Watch i kuchenne Hands-Free (Rozdz. 7)**

Moduł odpowiada za komfort i ergonomię pracy w kuchni. Obejmuje wymagania od `BR-ZEG-001` do `BR-ZEG-022`.

---

### **BR-ZEG-001: Samodzielny stoper pasteryzacji na Apple Watch**
* **Opis:** Niezależna aplikacja na watchOS pozwalająca wybrać metodę pasteryzacji, litraż słoika i wystartować odliczanie.
* **Persona:** P1, P2.
* **Kryteria akceptacji:** Działa w pełni autonomicznie na zegarku bez konieczności obecności iPhone'a w kuchni.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-002: Sterowanie cyfrową koronką (Digital Crown)**
* **Opis:** Precyzyjne nastawianie minut pasteryzacji obrotem koronki z wyraźnymi kliknięciami haptycznymi Taptic Engine.
* **Persona:** P1.
* **Kryteria akceptacji:** Umożliwia pełną obsługę mokrymi palcami bez dotykania ekranu dotykowego.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-003: Live Activity i Dynamic Island na iPhonie**
* **Opis:** Trwająca pasteryzacja prezentowana w czasie rzeczywistym na ekranie blokady oraz w Dynamic Island.
* **Persona:** P1, P3.
* **Kryteria akceptacji:** Aktualizacja stanu co 1 sekundę bez obciążania procesora.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-ZEG-004…BR-ZEG-022: Pozostałe wymagania modułu hands-free:**
* `BR-ZEG-004`: Obsługa skrótów Siri App Intents („Hej Siri, ile do końca pasteryzacji?”).
* `BR-ZEG-005`: Odhaczanie odgazowania słoika bezpośrednio z powiadomienia na zegarku.
* `BR-ZEG-006`: Komplikacja tarczy zegarka pokazująca liczbę dni do dojrzałości najważniejszej kiszonki.
* `BR-ZEG-007`: Wyrazisty alarm haptyczny na 2 minuty przed końcem gotowania słoików.
* `BR-ZEG-008`: Alarm krytyczny (Critical Alert) z pominięciem trybu wyciszenia w momencie zakończenia pasteryzacji.
* `BR-ZEG-009`: Szybki podgląd przepisu na nadgarstku (np. wymagane gramy soli na 1 litr).
* `BR-ZEG-010`: Synchronizacja danych partii między zegarkiem a telefonem za pośrednictwem `WCSession`.
* `BR-ZEG-011`: Wyświetlanie aktualnego etapu tyndalizacji na tarczy zegarka.
* `BR-ZEG-012`: Obsługa gestu podwójnego stuknięcia palcami (Double Tap) w watchOS 10+ do pauzy stopera.
* `BR-ZEG-013`: Widżet Smart Stack na Apple Watch prezentujący trwające gotowanie.
* `BR-ZEG-014`: Zabezpieczenie przed uśpieniem ekranu zegarka w trakcie aktywnej pasteryzacji.
* `BR-ZEG-015`: Rejestracja czasu schłodzenia słoików po wyjęciu z garnka.
* `BR-ZEG-016`: Widżety ekranu blokady iPhone'a (małe i średnie) ze stanem spiżarni.
* `BR-ZEG-017`: Głosowe dodawanie notatki do partii przez dyktowanie Siri.
* `BR-ZEG-018`: Sygnalizacja przekroczenia zalecanej temperatury otoczenia w kuchni.
* `BR-ZEG-019`: Dedykowane powiadomienie o konieczności uzupełnienia wody w rowku kamionki.
* `BR-ZEG-020`: Minimalistyczny interfejs nocny zegarka (czerwony motyw dla piwnicy).
* `BR-ZEG-021`: Automatyczne wznowienie odliczania po restarcie zegarka.
* `BR-ZEG-022`: Podgląd karty słoika na zegarku po odczytaniu tagu NFC w wersji 2.0.

""")

print("Expanded B7 written successfully.")

f_b8 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · B8 · rozdz. 7 narzędzia - Diagnostyk problemów przetwórstwa (Troubleshooting Doctor pleśń vs kożuch kahm, mięknięcie, mętność).md")
with open(f_b8, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B8: Diagnostyk problemów przetwórstwa (Troubleshooting Doctor) (Rozdz. 7)**

Moduł odpowiada za ratowanie partii i eliminację ryzyka zatruć pokarmowych. Obejmuje wymagania od `BR-DOK-001` do `BR-DOK-018`.

---

### **BR-DOK-001: Interaktywne drzewo decyzyjne analizy wad przetworu**
* **Opis:** 40-węzłowe drzewo decyzyjne prowadzące użytkownika przez serię pytań o wygląd, strukturę, kolor, zapach i zachowanie słoika.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:** 100% determinizm, brak losowości, brak generatywnego AI.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-002: Węzeł różnicowania: Drożdże kożuchujące (Kahm) vs Pleśń mikotoksynowa**
* **Opis:**
  * Weryfikacja struktury: matowa, cienka błonka z pofałdowaniami $\to$ Drożdże Kahm (bezpieczne po zebraniu łyżką).
  * Weryfikacja puszystości: meszek, kłaczki, wznoszące się zarodniki w kolorze zielonym, niebieskim, czarnym $\to$ Pleśń (bezwzględny nakaz wyrzucenia).
* **Persona:** P1, P2, P3.
* **Kryteria akceptacji:** Wyświetlenie zdjęć porównawczych w wysokiej rozdzielczości z zaznaczonymi cechami kluczowymi.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-DOK-003…BR-DOK-018: Pozostałe węzły diagnostyczne:**
* `BR-DOK-003`: Diagnoza mięknięcia ogórków (aktywność pektynazy vs brak soli vs za wysoka temperatura).
* `BR-DOK-004`: Diagnoza zielenienia i niebieszczenia czosnku (bezpieczne barwniki pirolowe).
* `BR-DOK-005`: Diagnoza spuchniętego wieczka Twist-Off po pasteryzacji (rozwój bakterii gnilnych lub *Bacillus* $\to$ nakaz utylizacji).
* `BR-DOK-006`: Diagnoza braku „kliknięcia” wieczka po ostygnięciu słoika (rozszczelnienie).
* `BR-DOK-007`: Diagnoza śluzowacenia solanki (rozwój *Leuconostoc dextranicum* produkującego dekstrany).
* `BR-DOK-008`: Diagnoza intensywnego zmętnienia solanki w korniszonach octowych (błąd pasteryzacji).
* `BR-DOK-009`: Diagnoza zapachu acetonu lub zmywacza do paznokci (zbyt wysoka temperatura fermentacji mlekowej $>28^\circ\text{C}$).
* `BR-DOK-010`: Diagnoza ciemnienia wierzchniej warstwy kiszonki (utlenianie polifenoli z powodu braku zalewy).
* `BR-DOK-011`: Diagnoza pękania skórek w kiszonych pomidorach (za szybka osmoza, brak nakłuwania).
* `BR-DOK-012`: Diagnoza wykrystalizowania cukru w powidłach i dżemach (zbyt wysoki Brix $>70^\circ\text{Bx}$).
* `BR-DOK-013`: Diagnoza braku żelowania dżemu (za wysokie pH $>3.5$ lub brak naturalnej pektyny).
* `BR-DOK-014`: Diagnoza białego osadu na dnie słoika z ogórkami (martwe bakterie kwasu mlekowego LAB — w 100% bezpieczne).
* `BR-DOK-015`: Diagnoza brunatnienia marynowanych grzybów (kontakt z żelazem lub brak obgotowania z kwasem).
* `BR-DOK-016`: Diagnoza obecności muszek owocówek w słoju z octem (nieszczelna gaza).
* `BR-DOK-017`: Diagnoza nadmiernej goryczy w kiszonych cytrynach (niedostateczny czas dojrzewania).
* `BR-DOK-018`: Generowanie raportu ratunkowego z podsumowaniem kroków naprawczych.

""")

print("Expanded B8 written successfully.")
