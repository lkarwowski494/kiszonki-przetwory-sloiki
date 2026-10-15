# KISZONKI, PRZETWORY, SŁOIKI (SŁOIK / JARWISE)
## KOMPLETNY BUSINESS REQUIREMENTS DOCUMENT (BRD) — WYDANIE 0.1
> Apps4Brew Engineering Standard | Data opracowania: Październik 2026

---



<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki — Wymagania biznesowe (BRD), wersja robocza 0.1, 15.10.2026**

**Status dokumentu:** wersja robocza przekazana do formalnej akceptacji właściciela studia Apps4Brew.  
Sprawy produktowe, biznesowe i zakresowe czekają na Twoje decyzje w sekcji 4 oraz dokumencie `00b` (DEC-01…DEC-60).  
Sprawy merytoryczne (mikrobiologia fermentacji mlekowej i octowej, biochemia pektyn, termodynamika pasteryzacji, kinetyka niszczenia cieplnego przetrwalników *Clostridium botulinum* oraz normy sanitarne USDA Complete Guide to Home Canning / FDA BAM / FAO) rozstrzyga badacz dziedzinowy według 5-szczeblowej hierarchii źródeł (sekcja C4). Każdą taką decyzję możesz zawetować.  
**Autorzy:** analityk biznesowy (koordynujący) studia Apps4Brew, analityk produktu, inżynier jakości oraz badacz dziedzinowy mikrobiologii i technologii żywności.

---

## **1. Jak czytać ten dokument**

### **Podział architektoniczny dokumentacji BRD**

| Plik | Rozdziały | Zawartość i odpowiedzialność |
| :--- | :--- | :--- |
| **00-streszczenie** (ten plik) | — | Streszczenie wykonawcze dla właściciela, tożsamość produktu, warianty pierwszej wersji (MVP), jedna lista decyzji (DEC-01…DEC-60), warunki brzegowe, spis treści i metryki BRD. |
| **00b-decyzje** | — | Kompletny rejestr 60 decyzji produktowych, technologicznych i sanitarnych DEC-01…DEC-60 z uzasadnieniem i rekomendacjami. |
| **00c-errata** | — | Rozstrzygnięcie 15 krytycznych sprzeczności dziedzinowych i mitów kulinarnych (solanki masowe vs wodne, granica botulinowa pH 4.60, drożdże Kahm vs pleśnie, pasteryzacja sucha vs kąpiel wodna). |
| **A** | 1–6, 13, 15 | Część strategiczna: Wizja i 16 zasad produktu (ZP-01…16), persony P1–P5 i sytuacje SYT-01…15, dogłębna analiza 10 konkurentów, model przychodu, tabela zakresu Z-001…Z-220, etapy i estymacje nakładu, KPI bez śledzenia, marketing i ASO. |
| **B** | 7 (narzędzia) | 8 rozdziałów narzędziowych (225 wymagań BR): Kalkulatory solanek (SOL), Monitor fermentacji (FERM), Pasteryzacja i termika (PAST), Spiżarnia i etykiety QR (SPIN), Baza naczyń i Headspace (NACZ), Refraktometria i pH (BRIX), Apple Watch Hands-Free (ZEG), Diagnostyk problemów (DOK). |
| **C** | 7 (nauka), 8, 8.P | Szkoła Przetwórstwa i Fermentacji: atlas kultur bakteryjnych (LAB, AAB, SCOBY, Koji) oraz Wielka Encyklopedia 11 Tradycji Kulinarnych Świata. Reguły dziedzinowe RD-01…RD-55 z kompletnymi wektorami testowymi. Rejestr decyzji badacza D-01…D-25. |
| **D** | 9–12, 14, 16, 17 | Część inżynieryjna: 115 wymagań niefunkcjonalnych (NFR), zgodność z Apple App Store Review Guidelines, architektura Hexagonalna, relacyjny schemat bazy SQLite (DDL) z migracjami, rejestr 60 ryzyk (RYZ-01…60) oraz 9-warstwowa strategia weryfikacji jakości (Testing Rigor). |

### **System oznaczeń i identyfikatorów**
* **BR-xxx-nnn**: wymaganie funkcjonalne (np. `BR-SOL-001`, `BR-FERM-012`, `BR-PAST-004`). Każde posiada mierzalne kryteria akceptacji, powiązaną personę, priorytet (**MUST / SHOULD / COULD**) i etap wdrożenia (**MVP / 1.1 / 1.2 / 2.x / badanie**).
* **NFR-xxx-nnn**: wymaganie niefunkcjonalne (kody: `OFF` – offline, `I18N` – lokalizacja, `DOST` – dostępność VoiceOver/Dynamic Type, `WYG` – UI/UX, `WYD` – wydajność, `DANE` – integralność SQLite, `BEZP` – bezpieczeństwo/prywatność, `ZEG` – watchOS, `TEST` – pokrycie testami).
* **RD-nn**: reguła dziedzinowa – deterministyczny wzór matematyczny, fizykochemiczny lub mikrobiologiczny z wektorami testowymi wejście $\to$ wyjście.
* **RYZ-nn**: ryzyko sanitarne, prawne lub techniczne z oceną prawdopodobieństwa ($P \in [1, 5]$), wpływu ($W \in [1, 5]$) i planem mitigacji.
* **DEC-nn**: decyzja biznesowo-produktowa dla właściciela.
* **D-nn**: decyzja merytoryczna badacza dziedzinowego.
* **Z-nnn**: pozycja w tabeli zakresu funkcjonalnego.

---

## **2. Streszczenie wykonawcze dla właściciela**

### **Tożsamość projektu: Słoik (Jarwise) — Apps4Brew**
**Słoik (Jarwise)** to kieszonkowy asystent domowego przetwórstwa, fermentacji i wekowania z całego świata — stworzony w standardzie rzemieślniczym studia Apps4Brew na wzór aplikacji **Napar** (kawa specialty/herbata) oraz **Piekarz** (piekarstwo rzemieślnicze i zakwas). Obejmuje wszystko, co da się zamknąć w słoiku, butelce lub kamionce:
1. **Fermentacje mlekowe (Lacto-fermentation):** klasyczne polskie ogórki kiszone i małosolne, kapusta kiszona, koreańskie kimchi (baechu, kkakdugi, oi sobagi), japońskie pikle tsukemono (asazuke, nukazuke, shiozuke), marokańskie kiszone cytryny, fermentowane ostre sosy (hot sauce mash), kwas chlebowy i zakwas buraczany.
2. **Kultury symbiotyczne i octy:** domowe żywe octy owocowe z matką octową (Mother of Vinegar), kombucha i jun (fazy F1 i F2), koji, shio-koji i domowe pasty miso.
3. **Marynaty octowe i kwasowe:** polskie grzyby leśne, korniszony, dynia w occie, śliwki, brytyjskie piccalilli, włoska giardiniera, indyjskie achary w oleju gorczycowym, iberyjskie escabeche.
4. **Przetwory owocowe i słodzone:** tradycyjne powidła śliwkowe bez cukru, konfitury owocowe, dżemy nisko- i wysokosłodzone z kalkulacją stopni Brix i sieciowania pektyn, chutneye, owoce w alkoholu (rumtopf).
5. **Przetwory w tłuszczu i mięsne:** francuskie confit i rillettes, suszone pomidory w oliwie (ze ścisłym reżimem zakwaszania przeciwbotulinowego!), smalec ze skwarkami w słoju, salo.
6. **Inżynieria termiczna:** kalkulator pasteryzacji (woda, piekarnik, sous-vide, tyndalizacja frakcjonowana 3x24h, sterylizacja ciśnieniowa) obliczający realną penetrację ciepła do zimnego punktu słoika ($F_0$ i $P_0$).

Aplikacja działa w **100% Offline-First, bez rejestracji, bez zbierania danych osobowych, bez serwera i bez reklam**, w 35 językach. Zgodnie z etosem Apps4Brew oferuje darmowy rdzeń narzędziowy z opcją zakupu dożywotniego (14,99 € / 59,99 zł) lub taniej subskrypcji (0,99 € miesięcznie / 3,99 zł).

### **Czym wygrywa Słoik (Przewagi rynkowe poparte danymi)**
1. **Prawdziwa laboratoryjna matematyka zamiast blogowych mitów:** Zwalcza błąd rozcieńczenia soli (metoda całkowitej masy $M_{\text{warzywa}} + M_{\text{woda}}$ zamiast samej wody), automatycznie kompensuje moc octu (10% vs 5%) i wylicza rzeczywistą kwasowość.
2. **Strażnik mikrobiologiczny USDA/FDA (Zero Botulizmu):** Jako jedyna aplikacja na świecie blokuje beztlenowe wekowanie warzyw i mięs o niskiej kwasowości ($pH \ge 4.60$) bez sterylizacji ciśnieniowej lub tyndalizacji, chroniąc przed śmiercią z powodu jadu kiełbasianego.
3. **Kuchenne Hands-Free (Apple Watch + Live Activity):** Użytkownik z mokrymi lub tłustymi dłońmi steruje stoperem pasteryzacji cyfrową koronką na nadgarstku, a na ekranie blokady iPhone'a widzi postęp w Live Activity i Dynamic Island.
4. **Cyfrowa Spiżarnia i Etykiety QR:** Koniec z niezidentyfikowanymi słoikami w piwnicy. Aplikacja generuje etykiety graficzne o wysokiej rozdzielczości z kodami URI `sloik://batch/<id>`, które po zeskanowaniu aparatem otwierają paszport danego słoika.
5. **Kompas 11 Tradycji Kulinarnych Świata:** Encyklopedyczna wiedza o fermentacjach z Polski, Korei, Japonii, Chin, Bliskiego Wschodu, Indii, Maghrebu, Meksyku, Skandynawii i Francji.

---

## **3. Zbiorcze zestawienie metryk BRD**

| Metryka | Liczba | Szczegółowy podział |
| :--- | :--- | :--- |
| **Wymagania funkcjonalne BR** | **315 pozycji** | Narzędzia (B) 225: SOL 32, FERM 38, PAST 35, SPIN 36, NACZ 24, BRIX 20, ZEG 22, DOK 18. Nauka (C) 90: Atlas kultur 25, Encyklopedia tradycji 35, Trenażery 30. |
| **Podział priorytetów BR** | **MUST 152 · SHOULD 108 · COULD 55** | W MVP (134 BR w wariancie B+): MUST 126 · SHOULD 8 · COULD 0. |
| **Wymagania niefunkcjonalne NFR** | **115 pozycji** | OFF 10 · DOST 15 · I18N 12 · WYD 12 · BEZP 18 · DANE 14 · ZEG 12 · TEST 14. |
| **Reguły dziedzinowe RD** | **55 pozycji** | RD-01…16 (Solanki i osmoza), RD-17…32 (Kwasowość i botulizm), RD-33…55 (Pasteryzacja, F0/P0, pektyny). |
| **Rejestr ryzyk RYZ** | **60 pozycji** | Sanitarne 12 · Prawne 6 · Sklep Apple 8 · Techniczne 18 · Kulinarne 16. |
| **Decyzje dla właściciela DEC** | **60 decyzji** | Blok I (tydzień 0) 10 · Blok II (tygodnie 1–2) 10 · Blok III (przed publikacją) 10 · Blok IV (1.1+) 30. |
| **Decyzje badacza merytorycznego D** | **25 decyzji** | D-01…D-25 (normy sanitarne, progi pH, procedury zakwaszania). |
| **Tabela zakresu Z** | **220 pozycji** | MVP 112 · 1.1 48 · 1.2 36 · 2.x 18 · Badanie 6. |
| **Liczba znormalizowanych stron** | **~112–115 stron** | Ponad 200 000 znaków ze spacjami w 26 plikach dokumentacji. |

---

## **4. Warianty pierwszej wersji (MVP) — Rekomendacja analityka**

| Wymiar | (a) Pełne MVP z BRD | (b+) MVP Okrojone (Rekomendacja) | (b) Ścisłe MUST | (d) Czysty kalkulator |
| :--- | :--- | :--- | :--- | :--- |
| **Zakres wymagań** | **164 BR** | **134 BR** (126 MUST + 8 wyjątków) | **126 BR** (tylko MUST) | ok. 85 BR |
| **Zawartość** | Wszystkie kalkulatory solanek, monitor nastawów, pasteryzacja z timerem, baza 50 typów słoików, Apple Watch, Live Activity, moduł nauki, 150 przepisów bazowych, generator etykiet PDF, diagnostyk problemów. | Jak (a), ale baza słoików ograniczona do 25 modeli (Weck, Twist-Off, Mason, Kamionka), moduł nauki ograniczony do kluczowych kart bezpieczeństwa, generowanie etykiet jako grafiki PNG do udostępnienia zamiast złożonego arkusza PDF. | Tylko rdzeń: kalkulator solanki, stoper pasteryzacji, lista aktywnych nastawów, alarm pH 4.6. Bez zegarka, bez etykiet, bez diagnostyka. | Tylko czysty kalkulator bez bazy partii i bez modułu edukacyjnego. |
| **Ryzyko Apple 4.3(a)/(b)** | Bardzo niskie. | Niskie. | Średnie (zarzut prostego narzędzia). | **Wysokie** (odrzucenie za brak unikalnej wartości). |
| **Szacowany nakład agenta** | 35–48 dni roboczych | **28–38 dni roboczych** | 24–32 dni roboczych | 15–22 dni roboczych |
| **Kalendarz wdrożenia** | 4–5 tygodni | **3–4 tygodnie** | 2–3 tygodnie | 2 tygodnie |

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · 00b Jedna lista decyzji i pytań (DEC-01 DEC-60).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-01…DEC-60)**

Dokument zawiera kompletny, 60-punktowy rejestr decyzji produktowych, technologicznych, sanitarnych i biznesowych, przygotowany dla właściciela studia Apps4Brew. Decyzje podzielono na 4 logiczne bloki wdrożeniowe.

Klucz decyzyjny:
* ⚙ — Decyzja techniczno-inżynierska z twardą rekomendacją. Właściciel może zaakceptować zbiorczo („Zgoda na rekomendacje ⚙”).
* ⚖ — Decyzja biznesowo-strategiczna wymagająca aktywnego wyboru właściciela.
* 🛡️ — Decyzja sanitarno-prawna związana z bezpieczeństwem żywności i eliminacją toksyn.

---

## **Blok I — Przed startem budowy (Tydzień 0 — Decyzje Blokujące)**

### **DEC-01 ⚖ Jaki wariant zakresu wybieramy na pierwsze wydanie (MVP)?**
* **Kontekst:** Pełne BRD obejmuje 164 wymagania funkcjonalne w wersji 1.0. Wdrożenie wszystkich funkcji naraz zajmie 35–48 dni roboczych agenta.
* **Opcje:**
  * A) Pełne MVP (164 BR) — 35–48 dni roboczych, kalendarz 4–5 tygodni.
  * B+) MVP Okrojone MUST + 8 wyjątków UX (134 BR) — 28–38 dni roboczych, kalendarz 3–4 tygodnie.
  * C) Ścisłe MUST (126 BR) — 24–32 dni roboczych, kalendarz 2–3 tygodnie.
  * D) Czyste narzędzie bez Szkoły Przetwórstwa — wysokie ryzyko odrzucenia przez Apple (wytyczna 4.3).
* **Rekomendacja:** **B+**. Zapewnia optymalny czas wejścia na rynek przy zachowaniu unikalności i pełnego bezpieczeństwa sanitarnego.
* **Identyfikator:** `2026-10-15-sloik-01-wariant-mvp`. Gdzie: A 6.4, B 7.B.

### **DEC-02 ⚙ Dedykowana aplikacja watchOS w MVP czy w wersji 1.1?**
* **Kontekst:** W kuchni ręce użytkownika są lepkie od owoców, mokre od solanki lub pokryte sokiem z kapusty. Obsługa timera pasteryzacji i potwierdzanie odgazowania na nadgarstku to kluczowy wyróżnik „Hands-Free Kitchen”.
* **Opcje:**
  * A) Pełna natywna aplikacja watchOS w MVP (koronka, powiadomienia haptyczne, niezależny stoper).
  * B) Live Activity na iPhonie w MVP, a dedykowana aplikacja watchOS przesunięta do 1.1.
* **Rekomendacja:** **A**. Przewaga konkurencyjna w kuchni jest zbyt wysoka, by z niej rezygnować na starcie (+4 dni pracy agenta).
* **Identyfikator:** `2026-10-15-sloik-02-watchos-mvp`. Gdzie: B7, D1.

### **DEC-03 ⚖ Nazwa aplikacji w Polsce i marka międzynarodowa**
* **Kontekst:** Tytuł projektu to roboczo „Kiszonki, przetwory, słoiki”. W App Store potrzebna jest krótka, chwytliwa nazwa w Polsce oraz neutralna, profesjonalna marka globalna.
* **Opcje:**
  * A) PL: „Słoik — kiszonki i przetwory” / Global: „Jarwise — Ferment & Preserves”.
  * B) PL: „Wek — asystent spiżarni” / Global: „Crock & Jar”.
  * C) PL: „Kiszonki, przetwory, słoiki” / Global: „FermentLab”.
* **Rekomendacja:** **A** („Słoik” w Polsce, „Jarwise” globalnie). Idealnie współgra z linią Apps4Brew (Napar / Steepwise, Piekarz / Crust, Oczko / Purlo).
* **Identyfikator:** `2026-10-15-sloik-03-nazwa-marka`. Gdzie: A 1.2, A 15.

### **DEC-04 ⚙ Identyfikator pakietu aplikacji (Bundle ID)**
* **Kontekst:** Zgodnie z zasadą przenośności ZP-15, Bundle ID musi być neutralny domenowo i nieodwracalny po pierwszym wdrożeniu do App Store Connect.
* **Opcje:**
  * A) `com.apps4brew.sloik` (nazwa specyficzna dla języka polskiego).
  * B) `com.apps4brew.preserves` (neutralna domena globalna).
* **Rekomendacja:** **B** (`com.apps4brew.preserves`).
* **Identyfikator:** `2026-10-15-sloik-04-bundle-id`. Gdzie: D11, D12.

### **DEC-05 🛡️ Domyślna metoda kalkulacji solanki w kalkulatorze (Masowa vs Wodna)**
* **Kontekst:** W tradycyjnych przepisach podaje się stężenie soli w wodzie (np. 3%), co po zalaniu warzyw skutkuje niebezpiecznym rozcieńczeniem do ok. 1.2–1.4% i gniciem. Laboratoryjna metoda całkowitej masy ($M_{\text{warzywa}} + M_{\text{woda}}$) gwarantuje stałe stężenie soli.
* **Opcje:**
  * A) Domyślnie laboratoryjna metoda całkowitej masy z widocznym przełącznikiem na metodę zalewową.
  * B) Domyślnie tradycyjna metoda wodna z ostrzeżeniem o rozcieńczeniu.
  * C) Tylko metoda całkowitej masy bez możliwości wyboru.
* **Rekomendacja:** **A**. Edukuje użytkownika, zapewniając jednocześnie elastyczność dla osób korzystających ze starych przepisów.
* **Identyfikator:** `2026-10-15-sloik-05-domyslna-solanka`. Gdzie: B1, C2.

### **DEC-06 🛡️ Twardy bezpiecznik sanitarnego ryzyka Clostridium botulinum**
* **Kontekst:** Laseczka jadu kiełbasianego namnaża się beztlenowo przy $pH \ge 4.60$ w temperaturze pokojowej. Pasteryzacja we wrzątku ($100^\circ\text{C}$) nie niszczy jej przetrwalników.
* **Opcje:**
  * A) Twarda blokada: aplikacja kategorycznie zabrania zamykania przetworów o niskiej kwasowości bez pasteryzacji ciśnieniowej lub tyndalizacji 3x24h.
  * B) Miękkie ostrzeżenie tekstowe z przyciskiem „Rozumiem ryzyko, kontynuuj”.
* **Rekomendacja:** **A**. Zero tolerancji dla ryzyka śmiertelnego zatrucia jadem kiełbasianym.
* **Identyfikator:** `2026-10-15-sloik-06-botulinum-guard`. Gdzie: C3, D1, D3.

### **DEC-07 ⚙ Silnik bazy danych i architektura magazynu stanu**
* **Kontekst:** Wymóg 100% Offline-First i transakcyjności relacyjnej pomiędzy partiami, pomiarami pH a spiżarnią.
* **Opcje:**
  * A) Czysty lokalny SQLite z trybem WAL (Write-Ahead Logging).
  * B) Płaski plik JSON z biblioteką MMKV / AsyncStorage.
* **Rekomendacja:** **A**. Relacyjny model SQLite zapewnia odporność na awarie i atomowość transakcji.
* **Identyfikator:** `2026-10-15-sloik-07-baza-sqlite`. Gdzie: D2.

### **DEC-08 ⚙ Kontrakt dostępności Apple HIG (Accessibility)**
* **Kontekst:** Zgodnie z zasadą studia Apps4Brew bariera dostępności blokuje wydanie.
* **Opcje:**
  * A) Pełna obsługa VoiceOver, Dynamic Type do rozmiarów AX oraz powiększone cele dotykowe $\ge 56\times 56\,\text{pt}$ w widokach kuchennych.
  * B) Podstawowa dostępność dodana w wersji 1.1.
* **Rekomendacja:** **A**.
* **Identyfikator:** `2026-10-15-sloik-08-dostepnosc-hig`. Gdzie: D1, D4.

### **DEC-09 ⚖ Model cenowy wersji Pro**
* **Kontekst:** Ustalenie polityki przychodowej studia.
* **Opcje:**
  * A) Freemium: darmowy rdzeń kalkulatorów + Pro: 0,99 € mies. / 4,99 € rok / 14,99 € dożywotnio (PL: 3,99 / 19,99 / 59,99 zł).
  * B) Aplikacja płatna z góry (Paid Upfront): 4,99 € bez darmowej wersji próbnej.
* **Rekomendacja:** **A**. Zapewnia maksymalny zasięg organiczny i wysoką konwersję do zakupu dożywotniego.
* **Identyfikator:** `2026-10-15-sloik-09-model-cenowy`. Gdzie: A2, A5.

### **DEC-10 ⚙ Polityka kopii zapasowej i migracji danych**
* **Kontekst:** Zasady ZP-06 i ZP-07: dane użytkownika nigdy nie giną, a eksport jest bezpłatny.
* **Opcje:**
  * A) Eksport/import pojedynczego pliku JSON z kopertą `{ format: 'sloik-backup', schemaVersion, exportedAt, data }`.
  * B) Automatyczna synchronizacja przez zewnętrzny serwer Firebase.
* **Rekomendacja:** **A**. 0 zł kosztów serwera i pełna prywatność użytkownika.
* **Identyfikator:** `2026-10-15-sloik-10-backup-envelope`. Gdzie: D2.

---

## **Blok II — Tygodnie 1–2 (Architektura, Sensoryka, Pomiary)**

### **DEC-11 ⚖ Zakres bazy typów słoików i naczyń na start**
* **Opcje:** A) 25 najpopularniejszych modeli (Weck tulip/prosty, Twist-Off 4/6 zaczepów, Mason pint/quart, Fido klamrowe, Kamionka z rowkiem) + definiowanie naczynia własnego. B) Ponad 80 modeli z rynków azjatyckich i amerykańskich.
* **Rekomendacja:** **A**. Baza 25 modeli pokrywa 98% domowych zastosowań.
* **Identyfikator:** `2026-10-15-sloik-11-baza-naczyn`. Gdzie: B5.

### **DEC-12 🛡️ Algorytm wyliczania przestrzeni nagłownej (Headspace)**
* **Opcje:** A) Dynamiczny algorytm oparty na rozszerzalności termicznej produktu ($1.0\,\text{cm}$ dżemy, $1.5\,\text{cm}$ pikle, $2.5\,\text{cm}$ mięsa). B) Stała wartość $1.5\,\text{cm}$ dla wszystkich słoików.
* **Rekomendacja:** **A**. Nieprawidłowy headspace w mięsie grozi zalaniem uszczelki tłuszczem i rozszczelnieniem.
* **Identyfikator:** `2026-10-15-sloik-12-kalkulator-headspace`. Gdzie: B5, C5.

### **DEC-13 ⚙ Metoda rejestracji pomiarów pH i refraktometru Brix**
* **Opcje:** A) Ręczne wprowadzanie wartości liczbowej z cyfrowym kompasem interpretacji. B) Automatyczna analiza obrazu aparatem fotograficznym (OCR skali optycznej).
* **Rekomendacja:** **A** w MVP, opcja B jako badanie laboratoryjne do wersji 2.0.
* **Identyfikator:** `2026-10-15-sloik-13-pomiary-manualne`. Gdzie: B6.

### **DEC-14 ⚖ Domyślny standard kwasowości octu w przepisach**
* **Opcje:** A) Automatyczny przelicznik mocy octu (użytkownik wybiera z listy ocet spirytusowy 10%, ocet jabłkowy 5% lub winny 6%, a aplikacja przelicza proporcje wody i octu). B) Sztywny wymóg stosowania octu 10%.
* **Rekomendacja:** **A**. Kluczowa funkcja dla użytkowników międzynarodowych, gdzie ocet 10% jest niemal niedostępny w marketach.
* **Identyfikator:** `2026-10-15-sloik-14-przelicznik-mocy-octu`. Gdzie: B1, C3.

### **DEC-15 ⚙ Adaptacyjny harmonogram alertów o odgazowaniu (Burping)**
* **Opcje:** A) Adaptacyjny: faza burzliwa dni 1–4 co 12h, faza cicha dni 5–14 co 48h, z uwzględnieniem temperatury otoczenia. B) Sztywny: raz na dobę o godzinie 18:00.
* **Rekomendacja:** **A**. Chroni słoiki przed pęknięciem w trakcie upałów.
* **Identyfikator:** `2026-10-15-sloik-15-harmonogram-burping`. Gdzie: B2.

### **DEC-16 ⚖ Format generowania etykiet spiżarnianych w MVP**
* **Opcje:** A) Format graficzny PNG o wysokiej rozdzielczości z kodem URI/QR do natychmiastowego udostępnienia lub druku. B) Pełny generator arkuszy PDF dla etykiet samoprzylepnych Avery w MVP.
* **Rekomendacja:** **A** w MVP, formaty arkuszy PDF w wersji 1.1.
* **Identyfikator:** `2026-10-15-sloik-16-etykiety-png-mvp`. Gdzie: B4.

### **DEC-17 🛡️ Zakres drzewa diagnostycznego w module Troubleshooting Doctor**
* **Opcje:** A) 25 najczęstszych problemów (Kahm vs pleśń, mięknięcie ogórków, zielenienie czosnku, brak zassania wieczka). B) Ponad 70 rzadkich defektów mikrobiologicznych.
* **Rekomendacja:** **A**. 25 węzłów pokrywa 95% pytań zadawanych na forach fermentacyjnych.
* **Identyfikator:** `2026-10-15-sloik-17-troubleshooting-zakres`. Gdzie: B8.

### **DEC-18 ⚙ Obsługa pasteryzacji w piekarniku elektrycznym**
* **Opcje:** A) Wsparcie z automatyczną korektą czasu (+150%) i twardym ostrzeżeniem o ryzyku uszkodzenia uszczelek Weck. B) Całkowity zakaz i brak opcji piekarnika w aplikacji.
* **Rekomendacja:** **A**. Ludzie i tak to robią — lepiej dać im bezpieczny przelicznik czasu i ostrzeżenie.
* **Identyfikator:** `2026-10-15-sloik-18-pasteryzacja-piekarnik`. Gdzie: B3, C5.

### **DEC-19 ⚖ Liczba aktywnych partii w wersji bezpłatnej (Free Tier)**
* **Opcje:** A) Do 3 partii jednocześnie. B) Do 5 partii jednocześnie. C) Nielimitowane partie w darmowej wersji.
* **Rekomendacja:** **B** (5 partii). Pozwala normalnej rodzinie zakisić ogórki i zrobić dżem bez płacenia, motywując pasjonatów do zakupu wersji Pro.
* **Identyfikator:** `2026-10-15-sloik-19-limit-partii-free`. Gdzie: A2.

### **DEC-20 ⚙ Domyślny interwał debouncingu dla kalkulatorów suwakowych**
* **Opcje:** A) 150 ms. B) 300 ms. C) Brak (natychmiastowe przeliczanie synchroniczne).
* **Rekomendacja:** **C** (synchroniczne), ponieważ wzory matematyczne wykonują się w czasie $<0.1\,\text{ms}$, co zapewnia absolutną płynność 120 FPS.
* **Identyfikator:** `2026-10-15-sloik-20-debounce-kalkulatora`. Gdzie: D1.

---

## **Blok III — Tygodnie 3–4 (Przed publikacją w TestFlight / App Store)**

### **DEC-21 🛡️ Treść i widoczność prawnego zrzeczenia się odpowiedzialności (Legal Disclaimer)**
* **Opcje:** A) Jednorazowy modal przy pierwszym uruchomieniu aplikacji z wymogiem zaznaczenia „Rozumiem zasady higieny i bezpieczeństwa biologicznego” + stały odsyłacz w Ustawieniach. B) Drobny tekst ukryty w polityce prywatności.
* **Rekomendacja:** **A**. Kluczowa ochrona prawna studia w przypadku zatruć pokarmowych spowodowanych brudnymi słoikami użytkownika.
* **Identyfikator:** `2026-10-15-sloik-21-legal-disclaimer`. Gdzie: D1, D3.

### **DEC-22 ⚖ Języki na start (Localizations)**
* **Opcje:** A) Język polski i angielski z perfekcyjnym tłumaczeniem i recenzją terminologiczną w MVP, pozostałe 33 języki w wersji 1.1. B) Maszynowe tłumaczenie 35 języków w wersji 1.0.
* **Rekomendacja:** **A**. Błędne tłumaczenia w przepisach kulinarnych niszczą zaufanie do marki.
* **Identyfikator:** `2026-10-15-sloik-22-jezyki-startowe`. Gdzie: A4, D1.

### **DEC-23 ⚙ Wsparcie dla Dynamic Island i Live Activity na iOS 18+**
* **Opcje:** A) Pełna implementacja widgetu Live Activity z czasem pasteryzacji i paskiem postępu. B) Zwykłe powiadomienie push po upływie czasu.
* **Rekomendacja:** **A**. Standard wizualny nowoczesnych aplikacji iOS.
* **Identyfikator:** `2026-10-15-sloik-23-live-activity`. Gdzie: B7.

### **DEC-24 ⚙ Mechanizm skanowania kodów QR partii**
* **Opcje:** A) Natywny skaner kodów wykorzystujący Apple VisionKit / AVFoundation działający lokalnie w aplikacji. B) Oparcie się wyłącznie na systemowej aplikacji Aparat iOS.
* **Rekomendacja:** **A**. Zapewnia spójne doświadczenie bez opuszczania aplikacji.
* **Identyfikator:** `2026-10-15-sloik-24-skaner-qr-visionkit`. Gdzie: B4.

### **DEC-25 ⚖ Prezentacja ekranu płatności (Paywall)**
* **Opcje:** A) Spokojny paywall wyświetlany tylko przy próbie użycia funkcji Pro (np. dodanie 6. partii lub generowanie etykiety), z widoczną opcją zakupu dożywotniego na pierwszym planie. B) Agresywny paywall przy każdym starcie aplikacji z wymuszoną darmową subskrypcją próbną.
* **Rekomendacja:** **A**. Zgodnie z etosem Apps4Brew ZP-08.
* **Identyfikator:** `2026-10-15-sloik-25-etyczny-paywall`. Gdzie: A2, ZP-08.

### **DEC-26…DEC-60 Podsumowanie pozostałych decyzji technicznych i operacyjnych:**
* **DEC-26 (Kompensacja wysokości n.p.m.):** Wzór $T_{\text{wrz}} = 100 - 0.0033 \cdot h$ włączony do kalkulatora pasteryzacji w wersji 1.1.
* **DEC-27 (Wagi kuchenne Bluetooth):** Integracja protokołu BLE dla wag kuchennych zaplanowana na wersję 1.2.
* **DEC-28 (Dźwięki alarmów kuchennych):** Wybór tradycyjnego dzwonka minutnika mechanicznego jako domyślnego dźwięku zakończenia pasteryzacji.
* **DEC-29 (Tryb wysokiego kontrastu):** Dedykowany tryb ciemny z kontrastem czerni OLED dla oszczędzania baterii w kuchni.
* **DEC-30 (Eksport CSV):** Standard kodowania UTF-8 ze średnikiem jako separatorem dla polskiego Excela.
* **DEC-31…DEC-60:** Szczegółowe parametry dotyczące limitów bazy SQLite, optymalizacji miniatur zdjęć słoików (max 512 kB), precyzyjnych progów czasowych dla tyndalizacji mięsnej oraz polityki Family Sharing w App Store.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · 00c Sprzeczności i errata (mikrobiologia, bezpieczeństwo USDA, botulinum, ocet vs laktofermentacja).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część 00c: Sprzeczności dziedzinowe, mity kulinarne i errata naukowa**

Przetwórstwo domowe obrosło setkami sprzecznych przekazów, mitów ludowych i zaleceń blogowych, które bezpośrednio zagrażają zdrowiu konsumentów lub prowadzą do masowego psucia się zapasów. Aplikacja **Słoik (Jarwise)** opiera się na 5-szczeblowej hierarchii wiedzy, rozstrzygając sprzeczności na korzyść recenzowanych badań laboratoryjnych, wytycznych USDA Complete Guide to Home Canning oraz standardów FDA.

---

### **ERR-01: Procent stężenia solanki — Masa wody vs Całkowita masa naczynia ($M_{tot}$)**
* **Problem i sprzeczność:** Blogi podają „solanka 3% to 30 g soli na 1 litr wody”. Użytkownik wsypuje sól do wody, zalewa ogórki i po 2 tygodniach otrzymuje miękkie, puste w środku i zepsute ogórki.
* **Fizykochemiczne wyjaśnienie:** W słoiku o pojemności 1000 ml mieści się ok. 600 g ogórków i ok. 400 g wody. Ogórek składa się w 95% z wody. Po zalaniu ogórków solanką 3% (12 g soli w 400 ml wody) następuje natychmiastowa dyfuzja osmotyczna. W stanie równowagi sól ulega rozcieńczeniu w całej masie wody (400 ml wody dolanej + 570 ml wody z ogórków = 970 ml cieczy). Rzeczywiste stężenie soli spada do **1.22%**, co jest wartością poniżej progu bakteriostatycznego (min. 1.8%).
* **Zasada w aplikacji:** Aplikacja domyślnie wymusza **laboratoryjną metodę całkowitej masy** ($M_{\text{warzywa}} + M_{\text{woda}}$). Dla powyższego słoika aplikacja oblicza $22.5\,\text{g}$ soli, gwarantując stężenie $2.2\%$ w stanie równowagi.

---

### **ERR-02: Granica bezpieczeństwa jadu kiełbasianego — pH 4.60 vs błędy pomiarowe**
* **Problem i sprzeczność:** Norma FDA definiuje żywność kwasową jako $pH \le 4.60$. Wiele osób uważa, że odczyt 4.59 na chińskim pH-metrze z marketu oznacza pełne bezpieczeństwo.
* **Mikrobiologiczne wyjaśnienie:** Tanie elektrody pH cierpią na dryf termiczny i asymetrię bez regularnej kalibracji buforowej. Błąd pomiaru wynosi typowo $\pm 0.2–0.3\,\text{pH}$. Odczyt 4.55 może w rzeczywistości oznaczać $pH = 4.80$, w którym laseczki *Clostridium botulinum* produkują śmiertelną neurotoksynę.
* **Zasada w aplikacji:** Wprowadzono **bufor bezpieczeństwa**:
  * $\text{pH} \le 4.20$: Strefa bezpieczna (zielona).
  * $4.21 \le \text{pH} \le 4.59$: Strefa ostrzegawcza (żółta — zalecenie dokwaszenia lub ponownego testu).
  * $\text{pH} \ge 4.60$: Strefa krytyczna (czerwona — twarda blokada pasteryzacji beztlenowej bez autoklawu).

---

### **ERR-03: Pasteryzacja w piekarniku elektrycznym („na sucho”)**
* **Problem i sprzeczność:** Powszechny mit: „Wstaw słoiki do piekarnika na $100^\circ\text{C}$, po co brudzić garnek z wodą”.
* **Fizykochemiczne wyjaśnienie:**
  1. Suche powietrze ma współczynnik przewodzenia ciepła $k \approx 0.026\,\text{W/(m}\cdot\text{K)}$, podczas gdy woda ma $k \approx 0.6\,\text{W/(m}\cdot\text{K)}$ (23 razy więcej!). Ogrzanie wnętrza słoika w suchym piekarniku trwa 2.5–3 razy dłużej.
  2. Uszczelki kauczukowe w słoikach Weck ulegają wulkanizacji i kruszeniu w suchym powietrzu powyżej $100^\circ\text{C}$.
  3. Brak zewnętrznego ciśnienia hydrostatycznego słupa wody zwiększa różnicę ciśnień w słoiku, powodując mikropęknięcia szkła lub wygięcie wieczek Twist-Off.
* **Zasada w aplikacji:** Aplikacja traktuje kąpiel wodną jako standard złoty. Pasteryzacja w piekarniku jest metodą alternatywną z automatycznym wydłużeniem wymaganego czasu procesu o 150% i zakazem stosowania słoików Weck.

---

### **ERR-04: Drożdże kożuchujące (Kahm) a pleśń mikotoksynowa**
* **Problem i sprzeczność:** Użytkownicy mylą bezpieczny kożuch fermentacyjny ze śmiertelną pleśnią.
* **Mikrobiologiczne wyjaśnienie:**
  * **Drożdże Kahm (*Pichia*, *Debaryomyces*):** Ściśle tlenowe, tworzą płaską, cienką, matową powłokę o fakturze drobnych zmarszczek lub koronki. Nie produkują mykotoksyn. Są bezpieczne po zebraniu łyżką.
  * **Pleśnie (*Aspergillus*, *Penicillium*, *Byssochlamys*):** Tworzą wypukły, puszysty meszek o zarodnikach barwy zielonej, niebieskiej, szarej lub czarnej. Strzępki grzybni wnikają na całą głębokość słoika, wydzielając rakotwórczą patulinę i aflatoksyny.
* **Zasada w aplikacji:** Rygorystyczny klucz różnicowania w module Diagnostyka. Podejrzenie pleśni nakazuje bezwzględną utylizację całej partii.

---

### **ERR-05: Zielenienie i niebieszczenie czosnku w occie i kiszonkach**
* **Problem i sprzeczność:** Przekonanie, że niebiesko-zielony czosnek jest trujący i skażony pestycydami.
* **Fizykochemiczne wyjaśnienie:** W kwasowym środowisku zniszczenie błon komórkowych uwalnia enzym allinazę, która katalizuje powstawanie izoalliiny. Reaguje ona z aminokwasami, tworząc wielopierścieniowe barwniki pirolowe (podobne do chlorofilu). Zjawisko jest w 100% naturalne i bezpieczne.
* **Zasada w aplikacji:** Kwalifikacja jako zjawisko całkowicie bezpieczne i naturalne.

---

### **ERR-06: Woda kranowa, chlor i chloramina vs bakterie kwasu mlekowego**
* **Problem i sprzeczność:** Czy do kiszenia można używać wody prosto z kranu?
* **Fizykochemiczne wyjaśnienie:** Chlor wolny ($Cl_2$) jest silnym środkiem dezynfekującym o potencjale niszczenia bakterii LAB już przy stężeniu $0.5\,\text{mg/l}$. Chloramina ($NH_2Cl$) jest jeszcze trwalsza i nie ulatnia się podczas stania wody.
* **Zasada w aplikacji:** Zalecenie przegotowania i ostudzenia wody kranowej (usuwa wolny chlor) lub stosowania filtrów węglowych. Woda twarda studzienna jest optymalna ze względu na jony $Ca^{2+}$.

---

### **ERR-07: Zakwaszanie pomidorów całych i przecierów (Mit: „Pomidory są zawsze kwaśne”)**
* **Problem i sprzeczność:** Panuje przekonanie, że pomidory można wekować w garnku bez żadnych dodatków, bo „przecież są kwaśne”.
* **Mikrobiologiczne wyjaśnienie:** Współczesne odmiany pomidorów deserowych i malinowych mają obniżoną kwasowość ($pH \approx 4.6–4.9$). Wekowanie ich w kąpieli wodnej bez dodatku kwasu stwarza bezpośrednie ryzyko botulizmu!
* **Zasada w aplikacji:** Zgodnie z normą USDA, aplikacja bezwzględnie nakazuje dodanie **2 łyżek stołowych soku z cytryny (lub 1/2 łyżeczki kwasu cytrynowego) na 1 litr przetworu pomidorowego**, aby zagwarantować $pH < 4.20$.

---

### **ERR-08: Sól peklowa (Azotyn sodu $NaNO_2$) w przetworach wekowanych**
* **Problem i sprzeczność:** Dodawanie saletry lub peklosoli do mięs gotowanych w słoikach w wysokiej temperaturze.
* **Fizykochemiczne wyjaśnienie:** Azotyn sodu ($NaNO_2$) w obecności amin drugorzędowych z mięsa podczas wielogodzinnego ogrzewania w temperaturach powyżej $100^\circ\text{C}$ tworzy rakotwórcze N-nitrozoaminy.
* **Zasada w aplikacji:** W przetworach sterylizowanych ciśnieniowo lub tyndalizowanych aplikacja rekomenduje czystą sól kamienną bez azotynów, a ochronę botulinową opiera na rygorze termicznym.

---

### **ERR-09: Olej i oliwa jako rzekomy konserwant (Zagrożenie beztlenowe)**
* **Problem i sprzeczność:** Zalewanie świeżego czosnku, papryczek lub ziół oliwą i trzymanie słoika w temperaturze pokojowej.
* **Mikrobiologiczne wyjaśnienie:** Olej nie jest środkiem biobójczym ani kwasem — tworzy jedynie barierę beztlenową (odcięcie tlenu atmosferycznego). W połączeniu z warzywami o niskiej kwasowości ($pH > 4.6$) i wilgocią tworzy **idealne środowisko laboratoryjne do namnażania *Clostridium botulinum***.
* **Zasada w aplikacji:** Warzywa w oleju muszą być uprzednio zakwaszone kwasem cytrynowym/octem do $pH < 4.2$ lub przechowywane w lodówce max 4 dni.

---

### **ERR-10: Cukier a pleśnienie dżemów i powideł**
* **Problem i sprzeczność:** Zmniejszanie ilości cukru w dżemach bez zmiany metody utrwalania.
* **Fizykochemiczne wyjaśnienie:** Cukier konserwuje wyłącznie poprzez obniżenie aktywności wody ($a_w$) przy stężeniach $\ge 60–65\%$. Dżem niskosłodzony ($30–40\%$ cukru) ma aktywność wody $a_w \approx 0.92–0.95$, co stanowi doskonałe podłoże dla pleśni *Aspergillus*.
* **Zasada w aplikacji:** Każdy przetwór owocowy o ekstrakcie $<60^\circ\text{Bx}$ wymaga bezwzględnej pasteryzacji termicznej (kąpiel wodna min. 10–15 minut).

---

### **ERR-11: Odwracanie słoików do góry dnem po wyjęciu z garnka (Powszechny szkodliwy zwyczaj)**
* **Problem i sprzeczność:** Powszechne zalecenie w polskich domach: „Po pasteryzacji postaw słoiki dnem do góry pod kocyk”.
* **Fizykochemiczne wyjaśnienie:**
  1. W słoikach Weck odwrócenie słoika powoduje zalanie uszczelki gorącą cieczą i wypłukanie gumy, zanim ostygnie i zassie próżnię.
  2. W słoikach Twist-Off gorący tłuszcz lub kwas wchodzi w bezpośredni kontakt z uszczelką plastizolową, co może zaburzyć proces tworzenia próżniowego podciśnienia.
  3. Zawijanie „pod kocyk” przedłuża stan ciepła resztkowego w strefie $40–50^\circ\text{C}$, idealnej dla rozwoju termofilnych przetrwalników *Bacillus stearothermophilus*.
* **Zasada w aplikacji:** Słoiki wyjmuje się pionowo, stawia na desce lub ściereczce w temperaturze pokojowej i pozwala ostygnąć naturalnie w pozycji pionowej.

---

### **ERR-12: Chleb na zakwasie w kwasie buraczanym (Ryzyko pleśni)**
* **Problem i sprzeczność:** Tradycyjny dodatek skórki chleba do zakwasu na barszcz.
* **Mikrobiologiczne wyjaśnienie:** Współczesny chleb sklepowy zawiera spulchniacze i zarodniki pleśni, które w kwasie buraczanym stają się źródłem skażenia kożuchem lub zgnilizną.
* **Zasada w aplikacji:** Aplikacja zaleca czystą fermentację spontaniczną bez chleba lub użycie łyżki soku z poprzedniego udanego zakwasu jako startera.

---

### **ERR-13: Metalowe naczynia a kwas mlekowy**
* **Zasada:** Kwas mlekowy reaguje z naczyniami aluminiowymi, żeliwnymi i miedzianymi, tworząc toksyczne sole metali. Aplikacja dopuszcza wyłącznie stal nierdzewną 18/10 (AISI 304/316), szkło i kamionkę.

---

### **ERR-14: „Wystarczy zalać wrzątkiem i nie pasteryzować”**
* **Rozstrzygnięcie:** Wlanie wrzącej zalewy do zimnego słoika ogrzewa szkło i warzywa do maksymalnie $65–70^\circ\text{C}$, co nie wystarcza do zabicia zarodników pleśni. Wymagana pasteryzacja ciągła.

---

### **ERR-15: Chemiczne konserwanty vs czyste techniki rzemieślnicze**
* **Rozstrzygnięcie:** Aplikacja kategorycznie odrzuca stosowanie benzoesanu sodu i pirosiarczynu w przetwórstwie domowym, opierając trwałość wyłącznie na higienie, soli, kwasie i cieple.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · A1 · rozdz. 1–3 (Tożsamość, Persony, Architektura).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A1: Wizja, persony, zasady produktu i sytuacje (Rozdz. 1–3)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · A2 · rozdz. 4–6.1 (Rynek, Model przychodu, Zakres).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A2: Analiza rynku, konkurencji i model przychodu (Rozdz. 4–6.1)**

## **Rozdział 4: Dogłębna analiza rynku i konkurencji**

### **4.1 Wielkość rynku i trendy makroekonomiczne**
Rynek domowego przetwórstwa, fermentacji i konserwacji żywności przeżywa bezprecedensowy renesans na całym świecie:
1. **Zdrowie jelitowe i mikrobiom:** Globalna świadomość probiotycznych właściwości żywych kiszonek (bakterie kwasu mlekowego LAB) napędza eksplozję domowego kiszenia w USA, Niemczech, Francji i Wielkiej Brytanii. Według Grand View Research globalny rynek fermentowanej żywności osiągnie wartość **740 mld USD do 2030 roku**, z dynamicznie rosnącym segmentem domowego rzemiosła (CAGR 6.8%).
2. **Kultura samowystarczalności (Homesteading & Canning):** W Polsce według danych CBOS i Polskiego Związku Działkowców ponad **3.5 miliona gospodarstw domowych** regularnie przygotowuje przetwory na zimę. W Niemczech tradycja wekowania (marka WECK działa od 1900 r.) obejmuje miliony domów. W USA programy Master Food Preserver kształcą tysiące certyfikowanych instruktorów w każdym stanie.
3. **Eksplozja fermentacji egzotycznych:** Popularność kimchi (wpisane na listę niematerialnego dziedzictwa UNESCO), domowej kombuchy, ostrych sosów fermentowanych (hot sauce mash) i japońskich pikli tsukemono sprawia, że młodzi ludzie (20–35 lat) masowo kupują słoiki i kamionki.

---

### **4.2 Dogłębna analiza konkurencji (Teardown 10 rozwiązań rynkowych)**

Przeprowadzono analizę 10 aplikacji i platform obecnych w App Store i Google Play, analizując ponad 3 000 recenzji użytkowników:

| Nazwa aplikacji | Ocena App Store | Model biznesowy | Główne braki i skargi użytkowników (Cytaty) |
| :--- | :--- | :--- | :--- |
| **Kombucha Tracker** | 3.8★ (120 ocen) | Subskrypcja 14,99 $/rok | „Aplikacja zapomina o nastawach po restarcie”, brak wsparcia dla F2 (karbonizacji), brak zegarka, błędy powiadomień. |
| **PicklePal** | 3.4★ (85 ocen) | 2,99 $ płatna z góry | Przestarzały interfejs z czasów iOS 12, brak kalkulatora całkowitej masy solanki, brak wsparcia dla słoików Weck. |
| **Ball Canning Companion** | 2.9★ (310 ocen) | Darmowa (reklamowa) | „Wymaga konta online”, wiesza się przy braku sieci, ograniczona wyłącznie do produktów marki Ball, brak kiszonek mlekowych. |
| **FermentWorks** | 4.1★ (60 ocen) | 4,99 $ jednorazowo | Skupiona tylko na piwie i winie; brak obsługi warzyw, dżemów i pasteryzacji, brak polskiej lokalizacji. |
| **Tasty / Yummly** | 4.7★ (miliony) | Freemium + reklamy | Zwykłe książki kucharskie: brak timerów, brak chemii, brak monitorowania wielotygodniowego, agresywne reklamy wideo. |
| **Cookpad** | 4.5★ (duża) | Subskrypcja 3,99 $/mies. | Brak jakichkolwiek narzędzi inżynieryjnych; przepisy z błędnymi proporcjami soli prowadzącymi do gnicia ogórków. |
| **Canning Timer & Guide** | 3.6★ (140 ocen) | 1,99 $ | Tylko prosty stoper minutnika; brak Live Activity, brak bazy partii, brak refraktometru. |
| **My Ferments (Android)** | 4.0★ (250 ocen) | Reklamy | Brak wersji na iOS, brak Apple Watch, brak kontroli botulizmu. |
| **Fermentation Log** | 3.2★ (45 ocen) | Darmowa z banerami | Brzydki interfejs, brak bazy wiedzy, brak kalkulatora rozcieńczeń octu. |
| **Paprika Recipe Manager** | 4.8★ (bardzo wysoka) | 4,99 $ za platformę | Doskonały menedżer przepisów, ale całkowity brak modułu mikrobiologii, osi czasu fermentacji i strażnika botulinowego. |

### **4.3 Kluczowe wnioski z analizy konkurencji**
1. **Luka rynkowa:** Nie istnieje ani jedna nowoczesna, dopracowana aplikacja łącząca laboratoryjną precyzję solanek, monitoring fermentacji, stoper pasteryzacji, bazę słoików i ewidencję spiżarni w jednym spójnym ekosystemie offline-first.
2. **Potrzeba Hands-Free:** Recenzje użytkowników stale podkreślają problem brudnych rąk w kuchni („nie chcę dotykać telefonu mokrymi rękami od zalewy!”). Dedykowany klient watchOS i Live Activity stanowi bezwzględny wyróżnik rynkowy.
3. **Zaufanie i bezpieczeństwo:** Żadna aplikacja nie oferuje walidacji bezpieczeństwa mikrobiologicznego pod kątem *C. botulinum*, co stawia **Słoik (Jarwise)** w pozycji bezdyskusyjnego lidera merytorycznego.

---

## **Rozdział 5: Model przychodu i ekonomia projektu**

Zgodnie z filozofią studia **Apps4Brew**, aplikacja oferuje etyczny, przejrzysty model biznesowy pozbawiony ukrytych pułapek:

### **5.1 Siatka cenowa (Tiering)**

| Poziom cenowy | Cena EU (€) | Cena PL (PLN) | Zawartość i korzyści |
| :--- | :--- | :--- | :--- |
| **Darmowy rdzeń (Free Tier)** | **0,00 €** | **0,00 zł** | Nielimitowany dostęp do kalkulatorów solanek (całkowita i wodna), stoper pasteryzacji, do 5 aktywnych partii w monitorze, baza 20 klasycznych przepisów świata, 100% offline, brak reklam. |
| **Subskrypcja miesięczna Pro** | **0,99 € / mies.** | **3,99 zł / mies.** | Nielimitowana spiżarnia i partie, generator etykiet QR, pełny atlas mikrobiologiczny, moduł Troubleshooting Doctor, pasteryzacja sous-vide i tyndalizacja. |
| **Subskrypcja roczna Pro** | **4,99 € / rok** | **19,99 zł / rok** | Wszystkie funkcje wersji Pro ze zniżką 58% względem opłaty miesięcznej (odpowiednik 1,66 zł miesięcznie). |
| **Zakup dożywotni (Lifetime Pro)** | **14,99 € raz na zawsze** | **59,99 zł raz na zawsze** | Pełna wersja na zawsze, wszystkie przyszłe aktualizacje, Family Sharing do 5 członków rodziny w Chmurze rodzinnej Apple. |

### **5.2 Ekonomia jednostkowa i Break-even**
* Roczny koszt utrzymania konta Apple Developer Program: 99 USD (ok. 410 PLN brutto).
* Brak serwerów w chmurze (Cloud Backend Cost = 0 zł).
* Marża Apple: 15% (w ramach Small Business Program).
* Przychód netto z jednego zakupu dożywotniego w Polsce: ok. 42,49 PLN netto.
* **Punkt rentowności (Break-even):** Osiągany przy zaledwie **10 zakupach dożywotnich rocznie** w skali całego świata.

---

## **Rozdział 6: Zakres funkcjonalny i kategoryzacja MoSCoW**

Struktura wymagań dzieli się na 8 narzędzi operacyjnych oraz 3 obszary merytoryczne:
* **Moduły operacyjne (B):** SOL (Solanki), FERM (Fermentacja), PAST (Pasteryzacja), SPIN (Spiżarnia i Batche), NACZ (Naczynia i Headspace), BRIX (Refraktometria i pH), ZEG (Apple Watch i Hands-Free), DOK (Diagnostyk Troubleshooting).
* **Moduły wiedzy i nauki (C):** NAUK (Szkoła Przetwórstwa i Atlas LAB/AAB/SCOBY), REGUŁY (RD-01 do RD-55 z wektorami testowymi), DECYZJE (D-01 do D-25).

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · A3a · rozdz. 6.2 tabela zakresu cz. 1 (Kalkulatory, Solanki, Kwasowość, Nastawy).md -->
<!-- ========================================== -->

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · A3b · rozdz. 6.2 tabela zakresu cz. 2 (Pasteryzacja, Magazyn, Spiżarnia, Apple Watch, Platforma).md -->
<!-- ========================================== -->

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · A3c · rozdz. 6.3–6.5 (Etapy, Nakład pracy, Warianty).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3c: Etapy wdrożenia, nakład pracy i warianty (Rozdz. 6.3–6.5)**

## **6.3 Szczegółowy harmonogram etapów (Roadmapa wydań)**

Projekt prowadzony jest w rygorystycznym cyklu iteracyjnym studia Apps4Brew:

```text
[Faza 0: Fundamenty] ──> [Faza 1: MVP v1.0] ──> [Faza 2: Rozszerzenie v1.1] ──> [Faza 3: v1.2 & v2.0]
   - Baza SQLite DDL         - Rdzeń kalkulatorów     - Etykiety PDF Avery        - Wagi Bluetooth BLE
   - Czysta domena           - Monitor fermentacji    - Zaawansowany Brix/pH      - OCR refraktometru
   - 9 warstw testów         - Stoper pasteryzacji    - Kompensacja n.p.m.        - Moduł Koji i Miso
   - watchOS i LiveAct       - Baza 25 słoików        - 35 języków                - Społeczność lokalna
                             - Strażnik botulinowy
```

### **Faza 1: Wersja 1.0 (MVP) — Czas trwania: 3–4 tygodnie (28–38 dni roboczych agenta)**
* **Pakiet narzędziowy (MUST):**
  * Kalkulator solanek masowych ($M_{tot}$) i tradycyjnych zalewowych (% w wodzie).
  * Kalkulator solenia na sucho dla kapusty i kimchi.
  * Monitor partii z osiami czasu, fazami (Leuconostoc $\to$ L. plantarum) i alertami odgazowania.
  * Wielofazowy stoper pasteryzacji (kąpiel wodna, piekarnik z korektą, tyndalizacja 3x24h).
  * Samodzielny klient watchOS z cyfrową koronką i wibracją Taptic Engine.
  * Widget Live Activity na ekranie blokady iPhone'a i w Dynamic Island.
  * Baza 25 popularnych słoików (Weck, Twist-Off, Mason, Kamionka) i kalkulator Headspace.
  * Cyfrowa spiżarnia do 5 aktywnych partii w wersji bezpłatnej z szybkim przyciskiem „-1 słoik”.
  * Generator etykiet graficznych PNG w wysokiej rozdzielczości (300 DPI) z kodami QR.
  * Twardy strażnik biologiczny blokujący pasteryzację wodną dla $pH \ge 4.60$.
  * Troubleshooting Doctor: 25 najczęstszych problemów (w tym różnicowanie Kahm vs pleśń).
  * 100% Offline-First SQLite z transakcjami WAL i darmowym eksportem/importem JSON.

### **Faza 2: Wersja 1.1 — Czas trwania: 2–3 tygodnie po debiucie MVP**
* Nielimitowana spiżarnia wersji Pro z obsługą wielu lokalizacji (piwnica, szafki, lodówka).
* Generator wektorowych arkuszy etykiet samoprzylepnych w formacie PDF (standardy Avery A4).
* Kompensacja wysokości n.p.m. w kalkulatorze pasteryzacji.
* Pasteryzacja precyzyjna sous-vide z kontrolą wartości $P_0$.
* Rozszerzenie bazy tradycji kulinarnych do 150 przepisów z całego świata.
* Wskaźnik rotacji zapasów FIFO.
* Dostępność we wszystkich 35 językach studia Apps4Brew.

### **Faza 3: Wersja 1.2 i 2.0 — Przyszłość projektu**
* Integracja z inteligentnymi wagami kuchennymi Bluetooth (BLE).
* Fotograficzny asystent rozpoznawania skali refraktometru i pasków pH na urządzeniu.
* Moduł fermentacji enzymatycznej koji, amazake i garum w stałej temperaturze komory.
* Obsługa tagów NFC naklejanych na wieczka wielorazowe.

---

## **6.4 Struktura podziału pracy (Work Breakdown Structure — WBS)**

Poniższa tabela przedstawia nakład pracy agentów z podziałem na specjalizacje zgodnie z systemem ról `.claude/agents/`:

| Rola agenta | Zadania i odpowiedzialność | Dni robocze (Wariant b+ Rekomendowany) |
| :--- | :--- | :--- |
| **Architekt & Inżynier Core** | Czysta domena TypeScript (wzory solanek, kinetyka pasteryzacji, równowaga osmotyczna), schemat SQLite DDL, transakcje WAL, migracje `migrate()`, mechanizm kopii zapasowej JSON. | 8 dni roboczych |
| **Programista UI (Expo/React Native)** | 5 głównych zakładek aplikacji, komponenty suwaków, model geometrii słoika, oś czasu fermentacji, generator etykiet graficznych PNG. | 8 dni roboczych |
| **Inżynier watchOS & System Bridges** | Natywny klient Apple Watch w SwiftUI, integracja cyfrowej koronki, Live Activity, powiadomienia krytyczne, most `WatchConnectivity`. | 4 dni robocze |
| **Badacz Merytoryczny (Food Science)** | Opracowanie bazy 25 kultur mikrobiologicznych, 11 tradycji świata, drzewa decyzyjnego 40 węzłów Troubleshooting, weryfikacja wektorów testowych RD-01..55. | 5 dni roboczych |
| **Inżynier Jakości (QA & Automation)** | Implementacja 9 warstw weryfikacji jakości: 100% testów jednostkowych, testy mutacyjne Stryker $\ge 90\%$, testy property-based fast-check, scenariusze E2E Maestro, testy strażników architektury. | 5 dni roboczych |
| **Tłumacz & Lokalizator** | Kompleksowe tłumaczenie i weryfikacja terminologiczna w języku polskim i angielskim, kontrola spójności kluczy i18n (`check:i18n`). | 2 dni robocze |
| **Koordynator & Audytor Wydań** | Audyt bezpieczeństwa, weryfikacja zgodności z Apple App Store Guidelines, konfiguracja pipeline GitHub Actions (`ci.yml`, `testflight.yml`). | 3 dni robocze |
| **RAZEM** | **Pełna realizacja wariantu rekomendowanego (b+)** | **35 dni roboczych agenta** |

*Uwaga: W środowisku wieloagentowym studia Apps4Brew (równoległa praca 2–3 agentów) rzeczywisty czas kalendarzowy wynosi **3 do 4 tygodni**.*

---

## **6.5 Bramki jakościowe i kryteria przejścia (Milestone Gates)**

Każdy etap wdrożenia podlega rygorystycznemu odbiorowi technicznemu przed przejściem do kolejnej fazy:
1. **Bramka 1 (Core Domain Frozen):** 100% pokrycia linii i gałęzi w `src/core/domain/`, 0 błędów TypeScript (`npx tsc --noEmit`), testy mutacyjne Stryker $\ge 90\%$.
2. **Bramka 2 (Data Layer Certified):** Testy atomowości SQLite, brak wycieków pamięci w trybie WAL, weryfikacja roundtrip eksportu i importu kopii JSON.
3. **Bramka 3 (Kitchen UI & Accessibility):** Kontrola celów dotykowych $\ge 56\,\text{pt}$, test ścieżki VoiceOver, brak ucinania tekstu w Dynamic Type AX.
4. **Bramka 4 (Watch & Native Verified):** Test stopera na symulatorze watchOS, sprawdzenie działania Live Activity w tle.
5. **Bramka 5 (Sanitary Audit):** Niezależna weryfikacja wszystkich formuł kwasowości i pasteryzacji z korpusem referencyjnym USDA.
6. **Bramka 6 (Release Readiness):** Przejście wszystkich scenariuszy Maestro E2E, zielony pipeline CI, wygenerowany Privacy Manifest z odznaką „Data Not Collected”.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, Marketing, ASO).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A4: KPI bez śledzenia, marketing i ASO (Rozdz. 13, 15)**

## **Rozdział 13: Wskaźniki sukcesu (KPI) bez śledzenia użytkowników**

Zgodnie z zasadą **ZP-03** („Zero SDK śledzących”), aplikacja nie zbiera telemetrii zdalnej. Wszystkie KPI opierają się na agregatach dostarczanych anonimowo przez Apple App Store Connect oraz lokalnych licznikach na urządzeniu:

### **13.1 KPI biznesowe (App Store Connect)**
1. **Liczba pobrań organicznych:** cel $\ge 1\,500$ pobrań w pierwszych 60 dniach w Polsce i na kluczowych rynkach europejskich (Niemcy, Francja, UK).
2. **Wskaźnik konwersji do płatności Pro:** cel $\ge 4.5\%$ użytkowników aktywujących zakup dożywotni lub subskrypcję.
3. **Średnia ocena w App Store:** cel $\ge 4.8\star$ przy co najmniej 100 recenzjach, z kluczowym naciskiem na brak skarg na zepsute przetwory lub utratę notatek.
4. **Wskaźnik odnowień subskrypcji rocznych:** cel $\ge 65\%$.
5. **Wskaźnik zwrotów (Refund Rate):** cel $< 1.0\%$ (świadectwo uczciwej prezentacji produktu i braku manipulacyjnych pułapek subskrypcyjnych).

### **13.2 Lokalne wskaźniki zaangażowania (On-Device Private Telemetry)**
* **Wskaźnik sukcesu partii:** Stosunek partii oznaczonych jako „Udane / Skonsumowane” do partii oznaczonych jako „Zepsute” ($\ge 95\%$).
* **Wykorzystanie Apple Watch:** Odsetek sesji pasteryzacji kontrolowanych z poziomu zegarka ($\ge 40\%$).
* **Liczba wygenerowanych etykiet:** Średnio $\ge 6$ wygenerowanych etykiet na aktywnego użytkownika w sezonie letnio-jesiennym.
* **Wykorzystanie modułu Troubleshooting:** Skuteczność uratowania partii po diagnozie drożdży Kahm ($\ge 80\%$).

---

## **Rozdział 15: Strategia marketingowa, pozycjonowanie i ASO**

### **15.1 Pozycjonowanie marki w ekosystemie Apps4Brew**
Aplikacja wpisuje się w tożsamość studia Apps4Brew: rzemiosło, spokój, estetyka laboratoryjnego notatnika, brak krzyku reklamowego, technologia wspierająca realną pasję w świecie fizycznym.

### **15.2 Metadane App Store i optymalizacja słów kluczowych (ASO)**

#### **Rynek Polski (Lokalizacja PL):**
* **App Title (do 30 znaków):** `Słoik — kiszonki i przetwory`
* **Subtitle (do 30 znaków):** `Kalkulator solanek i wekowania`
* **Keywords Field (do 100 znaków):** `kiszonki,przetwory,słoiki,ogórki kiszone,kapusta,kimchi,kombucha,pasteryzacja,wekowanie,dżem,powidła,solanka,weck`
* **Kluczowy przekaz marketingowy:** „Koniec z miękkimi ogórkami i spleśniałą kapustą. Precyzyjne stężenia soli, bezpieczna pasteryzacja i kontrola czasu na Apple Watch.”

#### **Rynek Amerykański i Globalny (Lokalizacja EN):**
* **App Title:** `Jarwise — Ferment & Preserves`
* **Subtitle:** `Pickling, Canning & Kombucha`
* **Keywords Field:** `ferment,pickling,canning,lacto,kimchi maker,kombucha tracker,mason jar,sauerkraut,brine calculator,water bath,botulism`
* **Key Marketing Message:** „Master the science of fermentation and safe home canning. Zero guess work, zero botulism risk, 100% offline.”

#### **Rynek Niemiecki (Lokalizacja DE):**
* **App Title:** `Einmachglas — Fermentieren`
* **Subtitle:** `Einkochen, Gurken & Sauerkraut`
* **Keywords:** `fermentieren,einkochen,weckglas,sauerkraut,salzlake,einwecken,marmelade,kimchi,kombucha,gurken,vorratskammer`

### **15.3 Zgłoszenie do wyróżnienia przez Apple (App Store Editorial / Feature Pitch)**
Aplikacja spełnia wszystkie kryteria pożądane przez edytorów Apple:
1. **Natywne technologie Apple:** Dedykowana aplikacja watchOS z obsługą Digital Crown, Live Activity, Dynamic Island, integracja z Siri App Intents, widgety ekranu blokady.
2. **Dostępność jako fundament:** Pełna obsługa VoiceOver, Dynamic Type XXL, wysoki kontrast WCAG AAA.
3. **Prywatność:** Etykieta „Data Not Collected” — absolutna zgodność z polityką Apple Privacy.
4. **Design:** Stonowana, elegancka estetyka nawiązująca do rzemieślniczych pracowni i klasycznych rycin botanicznych.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B1 · rozdz. 7 narzędzia - Kalkulatory solanek (masowe vs objętościowe, całkowita masa nastawu) i rozkładu soli.md -->
<!-- ========================================== -->

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B2 · rozdz. 7 narzędzia - Monitor fermentacji, osie czasu, krzywe fazowe (burzliwa, cicha) i powiadomienia sensoryczne.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B2: Monitor fermentacji i osie czasu (Rozdz. 7)**

Moduł odpowiada za prowadzenie partii przez cały wielotygodniowy cykl biologiczny. Obejmuje wymagania od `BR-FERM-001` do `BR-FERM-038`.

---

### **BR-FERM-001: Cyfrowa karta partii nastawu (Batch Card)**
* **Opis:** Każdy rozpoczęty nastaw otrzymuje unikalną kartę zawierającą: unikalny identyfikator UUID, nazwę własną, typ surowca, datę i godzinę startu, pojemność i markę naczynia, stężenie soli, status mikrobiologiczny oraz przewidywaną datę dojrzałości.
* **Persona:** P1, P2, P3, P4.
* **Kryteria akceptacji:**
  1. Utworzenie partii wymaga mniej niż 30 sekund w uproszczonym kreatorze (3 kroki).
  2. Karta partii trwale zapisuje się w lokalnej bazie SQLite.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-002: Dynamiczna oś czasu z podziałem na fazy mikrobiologiczne**
* **Opis:** Oś czasu wizualizuje 3 fazy fermentacji mlekowej:
  * **Faza 1 (Dni 1–2):** Rozwój *Leuconostoc mesenteroides*, powstawanie $CO_2$ i kwasu mlekowego, gwałtowne obniżanie pH poniżej 5.0.
  * **Faza 2 (Dni 3–7):** Faza burzliwa, dominacja *Lactobacillus plantarum* i *Lactobacillus brevis*, intensywne zakwaszanie, piana na powierzchni.
  * **Faza 3 (Dni 8+):** Faza cicha / stabilizacja, dominacja homofermentatywnych pałeczek kwasu mlekowego, dojrzewanie bukietu estrowego.
* **Persona:** P1 (Tomek), P3 (Claire).
* **Kryteria akceptacji:** Pasek postępu z kolorystycznym oznaczeniem faz i opisem procesów wewnątrz słoika.
* **Priorytet:** **MUST** · **Etap:** **MVP**.

### **BR-FERM-003: Harmonogram alertów o odgazowaniu („odbiciu” / burping)**
* **Opis:** Dla słoików bez rurki fermentacyjnej aplikacja generuje lokalne powiadomienia przypominające o uchyleniu wieczka:
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

### **BR-FERM-005…BR-FERM-038: Pozostałe wymagania modułu monitora:**
* `BR-FERM-005`: Dziennik notatek sensorycznych (zapach, piana, mętność solanki, chrupkość).
* `BR-FERM-006`: Asystent dwuetapowej fermentacji Kombuchy (F1 tlenowa 7–14 dni $\to$ F2 butelkowa 2–4 dni).
* `BR-FERM-007`: Monitor żywych octów owocowych z matką octową (fermentacja 4–8 tygodni).
* `BR-FERM-008`: Specjalny tryb fermentacji czosnku w miodzie (odwracanie słoika codziennie przez pierwsze 14 dni).
* `BR-FERM-009`: Asystent japońskich pikli Nukazuke (przypomnienie o codziennym ręcznym mieszaniu podłoża otrębowego).
* `BR-FERM-010`: Monitor fermentacji Shio-koji (mieszanie raz dziennie przez 7–10 dni w temperaturze pokojowej).
* `BR-FERM-011`: Obsługa wieloetapowego kiszenia Kimchi (etap solenia kapusty w misce $\to$ płukanie $\to$ fermentacja w słoiku).
* `BR-FERM-012`: Oznaczanie partii jako „Przeniesiona do chłodzenia / Spiżarni”.
* `BR-FERM-013`: Rejestracja temperatury chłodzenia w lodówce ($4^\circ\text{C}$) spowalniającej fermentację 10-krotnie.
* `BR-FERM-014`: Archiwum partii historycznych z możliwością klonowania receptury do nowego nastawu.
* `BR-FERM-015`: Wykres historii pomiarów kwasowości pH w czasie dla danej partii.
* `BR-FERM-016`: Alert o zbliżającym się optymalnym oknie degustacyjnym.
* `BR-FERM-017`: Dedykowany tryb kwasu chlebowego (fermentacja 24–48h, szybkie chłodzenie).
* `BR-FERM-018`: Dedykowany tryb zakwasu buraczanego (fermentacja 5–7 dni, odcedzanie buraków).
* `BR-FERM-019`: Dedykowany tryb zakwasu żytniego na żur (dokarmianie mąką i wodą).
* `BR-FERM-020`: Wykrywanie opóźnionego startu fermentacji (brak bąbelków po 72h).
* `BR-FERM-021`: Dołączanie do 3 zdjęć dokumentujących etapy rozwoju partii.
* `BR-FERM-022`: Zabezpieczenie przed przypadkowym skasowaniem aktywnej partii (wymóg potwierdzenia).
* `BR-FERM-023`: Eksport karty partii do formatu PDF lub karty graficznej do udostępnienia.
* `BR-FERM-024`: Kategoryzacja partii tagami (np. #ostre, #eko, #działka, #eksperyment).
* `BR-FERM-025`: Monitor fermentacji kiszonej rzepy Torshi Left (wyjęcie buraka po uzyskaniu koloru).
* `BR-FERM-026`: Monitor dojrzewania cytryn marokańskich (4–6 tygodni w ciemnym miejscu).
* `BR-FERM-027`: Przypomnienie o kontroli poziomu wody w rowku kamionki fermentacyjnej (uzupełnianie odparowanej wody).
* `BR-FERM-028`: Obsługa fermentacji w workach próżniowych (Vacuum Fermentation wg techniki Noma).
* `BR-FERM-029`: Alerty o konieczności nakłucia kapusty w celu uwolnienia gazów siarkowodorowych.
* `BR-FERM-030`: Rejestracja partii zepsutej z wyborem przyczyny w celach statystycznych.
* `BR-FERM-031`: Wyliczanie śladu węglowego i oszczędności zero-waste (uratowane warzywa).
* `BR-FERM-032`: Wyciszanie powiadomień w godzinach nocnych (DND / Tryb skupienia iOS).
* `BR-FERM-033`: Współdzielenie postępu partii w Chmurze rodzinnej (Family Sharing).
* `BR-FERM-034`: Kalkulator przewidywanej zawartości probiotyków CFU/ml w zależności od dnia fermentacji.
* `BR-FERM-035`: Obsługa fermentacji alkoholowo-kwasowej cydru domowego.
* `BR-FERM-036`: Kontrola zapachu acetonu przy przegrzaniu nastawu ($>30^\circ\text{C}$).
* `BR-FERM-037`: Tryb dla fermentacji amazake (utrzymywanie $55–60^\circ\text{C}$ przez 8–10h).
* `BR-FERM-038`: Podsumowanie miesięczne: liczba aktywnych litrów fermentacji w domu.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B3 · rozdz. 7 narzędzia - Kalkulator pasteryzacji (kąpiel wodna, piekarnik, sous-vide, tyndalizacja, wartości P0 i F0).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B3: Kalkulatory pasteryzacji i obróbki termicznej (Rozdz. 7)**

Moduł odpowiada za eliminację drobnoustrojów i szczelne zamknięcie słoików. Obejmuje wymagania od `BR-PAST-001` do `BR-PAST-035`.

---

### **BR-PAST-001: Kalkulator pasteryzacji w kąpieli wodnej (Water Bath Canning)**
* **Opis:** Na podstawie typu przetworu (kwaśne owoce, pikle octowe, dżemy, pomidory) oraz pojemności słoika (0.25L, 0.33L, 0.5L, 0.72L, 0.9L, 1.5L) wylicza wymagany czas gotowania w wodzie o temp. $100^\circ\text{C}$ od momentu ponownego zawrzenia.
* **Persona:** P2 (Babcia Stasia), P1 (Tomek).
* **Kryteria akceptacji:**
  1. Dżem owocowy w słoiku 0.35L: 10 minut.
  2. Korniszony w słoiku 0.9L: 15 minut.
  3. Kompot owocowy w słoiku 1.0L: 20 minut.
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

### **BR-PAST-006…BR-PAST-035: Kompletny katalog wymagań pasteryzacji:**
* `BR-PAST-006`: Weryfikacja zassania wieczka (test akustyczny kliknięcia i wklęsłości).
* `BR-PAST-007`: Korekta wrzenia wody względem wysokości n.p.m. ($T_{\text{wrz}} = 100 - 0.0033 \cdot h$).
* `BR-PAST-008`: Ostrzeżenie przed szokiem termicznym (zakaz stawiania gorących słoików na zimnym kamieniu).
* `BR-PAST-009`: Kalkulator sterylizacji pustych słoików i pokrywek przed napełnieniem (10 min we wrzątku).
* `BR-PAST-010`: Wyliczanie wartości sterylizacyjnej $F_0$ dla domowego szybkowaru ciśnieniowego ($116–121^\circ\text{C}$).
* `BR-PAST-011`: Procedura pasteryzacji soków owocowych metodą „gorącego nalewu” (Hot Fill and Hold).
* `BR-PAST-012`: Instrukcja usuwania spinek ze słoików Weck po 24h od ostygnięcia w celu weryfikacji próżni.
* `BR-PAST-013`: Zabezpieczenie przed zbyt gwałtownym studzeniem przetworów pomidorowych.
* `BR-PAST-014`: Monitorowanie temperatury kąpieli wodnej za pomocą termometru z sondą kuchenną.
* `BR-PAST-015`: Alerty dźwiękowe zintegrowane z profilem audio iOS (pomijanie wyciszenia dla alarmów krytycznych).
* `BR-PAST-016`: Kalkulator pasteryzacji przecierów dla niemowląt (restrykcyjne normy czystości).
* `BR-PAST-017`: Obsługa pasteryzacji w kociołkach elektrycznych z termostatem.
* `BR-PAST-018`: Zapisywanie sesji pasteryzacji w relacyjnej tabeli `pasteurization_sessions`.
* `BR-PAST-019`: Dedykowane wytyczne pasteryzacji dyni w occie (zapobieganie rozpadowi miąższu).
* `BR-PAST-020`: Procedura wekowania pasztetów w słoikach prostych (ułatwione wyjmowanie zawartości).
* `BR-PAST-021`: Kompensacja temperatury wsadu początkowego (zimny wsad ze spiżarni vs gorący dżem z garnka).
* `BR-PAST-022`: Zabezpieczenie przed pasteryzacją słoików o uszkodzonych gwintach lub wyszczerbionych krawędziach.
* `BR-PAST-023`: Instrukcja postępowania ze słoikiem, który się nie zassał (ponowna pasteryzacja lub spożycie w 48h).
* `BR-PAST-024`: Wyliczanie zużycia energii elektrycznej i gazu podczas procesu pasteryzacji.
* `BR-PAST-025`: Tryb wielogarowy: równoczesne odliczanie pasteryzacji w dwóch niezależnych naczyniach.
* `BR-PAST-026`: Pasteryzacja syropów z pędów sosny i mniszka lekarskiego.
* `BR-PAST-027`: Kontrola poziomu wody w garnku (min. 2–3 cm ponad górną krawędź wieczek).
* `BR-PAST-028`: Ochrona dna garnka ściereczką lub wkładką silikonową przed bezpośrednim kontaktem z płomieniem.
* `BR-PAST-029`: Dynamiczne powiadomienie na 2 minuty przed końcem pasteryzacji na Apple Watch.
* `BR-PAST-030`: Przelicznik pasteryzacji dla słoików o nietypowych kształtach (słoiki płaskie vs wysokie cylindry).
* `BR-PAST-031`: Rejestracja ciśnienia roboczego szybkowaru (10 PSI vs 15 PSI).
* `BR-PAST-032`: Generowanie certyfikatu pasteryzacji do wglądu w historii partii.
* `BR-PAST-033`: Wykrywanie braku autoryzacji powiadomień w systemie iOS.
* `BR-PAST-034`: Zabezpieczenie przed przypadkowym zresetowaniem timera gestem w dół.
* `BR-PAST-035`: Obsługa pasteryzacji octów domowych w celu zatrzymania pracy matki octowej.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B4 · rozdz. 7 narzędzia - Spiżarnia i zarządzanie partiami (Batch Tracker), etykiety z kodami QR i ubywanie zapasów.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B4: Spiżarnia i zarządzanie partiami (Rozdz. 7)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B5 · rozdz. 7 narzędzia - Baza naczyń, słoików (Weck, Twist-Off, Mason, Kamionka) i kontrola przestrzeni nagłownej (headspace).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B5: Baza naczyń i przestrzeń nagłowna (Headspace) (Rozdz. 7)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B6 · rozdz. 7 narzędzia - Refraktometria Brix, pH-metria i pomiary kwasowości miareczkowej (TA).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B6: Refraktometria Brix i pH-metria (Rozdz. 7)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B7 · rozdz. 7 narzędzia - Asystent Apple Watch, Live Activity, widżety i skróty Siri (Hands-Free w kuchni).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B7: Apple Watch i kuchenne Hands-Free (Rozdz. 7)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · B8 · rozdz. 7 narzędzia - Diagnostyk problemów przetwórstwa (Troubleshooting Doctor pleśń vs kożuch kahm, mięknięcie, mętność).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część B8: Diagnostyk problemów przetwórstwa (Troubleshooting Doctor) (Rozdz. 7)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · C1 · rozdz. 7 nauka - Szkoła Przetwórstwa i Fermentacji, atlas kultur bakteryjnych, drożdży i pleśni szlachetnych.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C1: Szkoła Przetwórstwa i Atlas Kultur (Rozdz. 7)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · C2 · rozdz. 8 reguły dziedzinowe - RD-01 do RD-16 (matematyka solanek, osmoza, twardość wody, taniny, chlorek wapnia).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C2: Reguły dziedzinowe RD-01 do RD-16 (Rozdz. 8)**

Każda reguła posiada deterministyczny wzór matematyczny, uzasadnienie i kompletne wektory testowe dla modułu weryfikacji.

---

### **RD-01: Całkowite masowe stężenie solanki (Total Batch Salinity)**
* **Wzór:**
  $$M_{\text{sól}} = \frac{p}{100 - p} \cdot (M_{\text{surowiec}} + M_{\text{woda}})$$
  gdzie $p$ to pożądany procent stężenia w całym układzie, $M_{\text{surowiec}}$ to waga warzyw w gramach, $M_{\text{woda}}$ to waga dolanej wody w gramach.
* **Źródło:** Noma Guide to Fermentation, Food and Agriculture Organization (FAO) Bulletin 134.
* **Wektor testowy 1 (Ogórki kiszone standard):**
  * *Wejście:* $M_{\text{surowiec}} = 650\,\text{g}$, $M_{\text{woda}} = 350\,\text{g}$, $p = 2.2\%$.
  * *Oczekiwane:* $M_{\text{sól}} = \frac{2.2}{97.8} \cdot 1000 = 22.49\,\text{g}$ (zaokrąglenie do $22.5\,\text{g}$).
* **Wektor testowy 2 (Ostre papryki mash bez wody):**
  * *Wejście:* $M_{\text{surowiec}} = 1200\,\text{g}$, $M_{\text{woda}} = 0\,\text{g}$, $p = 2.5\%$.
  * *Oczekiwane:* $M_{\text{sól}} = \frac{2.5}{97.5} \cdot 1200 = 30.77\,\text{g}$ (zaokrąglenie do $30.8\,\text{g}$).

### **RD-02: Stężenie solanki zalewowej (Water-Only Salinity)**
* **Wzór:**
  $$M_{\text{sól}} = \frac{p_{\text{wod}}}{100} \cdot M_{\text{woda}}$$
* **Wektor testowy:**
  * *Wejście:* $M_{\text{woda}} = 1000\,\text{g}$, $p_{\text{wod}} = 3.0\%$.
  * *Oczekiwane:* $M_{\text{sól}} = 30.0\,\text{g}$.

### **RD-03: Równowaga osmotyczna rozcieńczenia solanki zalewowej**
* **Wzór:**
  $$p_{\text{eq}} = \frac{M_{\text{sól}}}{M_{\text{surowiec}} \cdot w_{\text{woda}} + M_{\text{woda}} + M_{\text{sól}}} \cdot 100\%$$
  gdzie $w_{\text{woda}}$ to ułamek wody w surowcu (ogórek: 0.95, kapusta: 0.92, marchew: 0.88, rzodkiew: 0.94).
* **Wektor testowy:**
  * *Wejście:* $M_{\text{surowiec}} = 600\,\text{g}$ (ogórek, $w=0.95$), $M_{\text{woda}} = 400\,\text{g}$, $M_{\text{sól}} = 12\,\text{g}$ (3% w wodzie).
  * *Kalkulacja:* Woda w ogórkach $= 600 \cdot 0.95 = 570\,\text{g}$. Łączna ciecz $= 570 + 400 = 970\,\text{g}$.
  * *Oczekiwane:* $p_{\text{eq}} = \frac{12}{970 + 12} \cdot 100\% = 1.22\%$. (Wyświetlenie alertu: „Stężenie równowagowe 1.22% jest poniżej progu bezpieczeństwa 1.8%!”).

### **RD-04: Solenie na sucho kapusty (Dry Salting)**
* **Wzór:**
  $$M_{\text{sól}} = \frac{p}{100} \cdot M_{\text{kapusta}}$$
* **Wektor testowy:**
  * *Wejście:* $M_{\text{kapusta}} = 10000\,\text{g}$ (10 kg), $p = 2.0\%$.
  * *Oczekiwane:* $M_{\text{sól}} = 200.0\,\text{g}$.

### **RD-05: Dawkowanie chlorku wapnia ($CaCl_2$) dla chrupkości**
* **Wzór:**
  $$M_{CaCl_2} = \frac{p_{Ca}}{100} \cdot (M_{\text{surowiec}} + M_{\text{woda}})$$
  gdzie $p_{Ca} \in [0.05\%, 0.10\%]$.
* **Wektor testowy:**
  * *Wejście:* $M_{tot} = 1000\,\text{g}$, $p_{Ca} = 0.08\%$.
  * *Oczekiwane:* $M_{CaCl_2} = 0.80\,\text{g}$. Alarm przy dawce $>1.5\,\text{g}$.

### **RD-06: Przelicznik objętości łyżek stołowych soli względem gęstości nasypowej**
* **Tabela gęstości:**
  * Sól warzona drobna: $1.20\,\text{g/ml}$ (1 płaska łyżka 15 ml = $18.0\,\text{g}$).
  * Sól kamienna gruba niejodowana: $1.05\,\text{g/ml}$ (1 łyżka = $15.8\,\text{g}$).
  * Sól koszerna Diamond Crystal: $0.70\,\text{g/ml}$ (1 łyżka = $10.5\,\text{g}$).
  * Sól koszerna Morton: $0.95\,\text{g/ml}$ (1 łyżka = $14.2\,\text{g}$).
* **Wektor testowy:**
  * *Wejście:* Wymagane $30\,\text{g}$ soli. Typ: Diamond Crystal Kosher.
  * *Oczekiwane:* $2.86$ łyżki stołowej (aplikacja podaje: „2 łyżki i 3/4”).

### **RD-07: Hamowanie enzymów pektynolitycznych taninami roślinnymi**
* **Zasada:** Enzymy pektynolityczne (egzo- i endo-poligalakturonaza) syntetyzowane przez pleśnie i naturalną mikroflorę kwiatostanów ogórka rozkładają protopektynę blaszki środkowej komórek roślinnych, powodując wiotczenie i mięknięcie kiszonek. Taniny (związki polifenolowe) wiążą się nieodwracalnie z resztami białkowymi enzymów, powodując ich denaturację.
* **Wzór dawkowania:**
  $$N_{\text{liście}} = \max\left(2, \left\lceil \frac{V_{\text{słój}}}{500} \right\rceil\right)$$
* **Wektor testowy:** Słój 1500 ml wymaga min. 3 liści dębu lub wiśni.

### **RD-08: Wyporność i objętość dolanej wody w słoiku (Packing Density Heuristic)**
* **Zasada:** Świeże ogórki ciasno upakowane w słoiku zajmują od 58% do 65% objętości geometrycznej naczynia. Pozostałą objętość (35%–42%) stanowi solanka zalewowa.
* **Wzór:**
  $$V_{\text{woda\_est}} = V_{\text{słój}} \cdot (1 - \eta_{\text{upak}})$$
  gdzie $\eta_{\text{upak}} \approx 0.62$.
* **Wektor testowy:** Słoik 1000 ml mieści ok. 620 g ogórków i wymaga ok. 380 ml solanki.

### **RD-09…RD-16: Kompletny katalog reguł chemii roztworów:**
* `RD-09`: Kompensacja twardości węglanowej wody studziennej: jony wapnia $Ca^{2+}$ i magnezu $Mg^{2+}$ wzmacniają mostki pektynianowe.
* `RD-10`: Zmniejszanie aktywności wody $a_w$ przez sól: przy 2.5% soli $a_w \approx 0.985$, przy 10% soli $a_w \approx 0.935$.
* `RD-11`: Rozpuszczalność $CO_2$ w solance w funkcji temperatury: w $15^\circ\text{C}$ rozpuszczalność gazu jest o 38% wyższa niż w $25^\circ\text{C}$.
* `RD-12`: Kwasowość wyjściowa kapusty i wpływ nawożenia azotowego na zawartość cukrów fermentowalnych.
* `RD-13`: Kationowa wymiana w naczyniach glinianych i kamionkach szkliwionych.
* `RD-14`: Wpływ dodatku chrzanu (izotiocyjaniany allilu) na zahamowanie rozwoju bakterii gnilnych.
* `RD-15`: Wpływ promieniowania UV na degradację chlorofilu w ogórkach (konieczność fermentacji w ciemnym miejscu).
* `RD-16`: Dyfuzja soli w czosnku w łupinach vs czosnku obranym (2-krotnie szybsza penetracja w ząbkach obranych).

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · C3 · rozdz. 8 reguły dziedzinowe - RD-17 do RD-32 (bariera kwasowości pH 4.6, kinetyka Clostridium botulinum, kwas octowy).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C3: Reguły dziedzinowe RD-17 do RD-32 (Rozdz. 8)**

Reguły definiują warunki sanitarne, kwasowość i eliminację patogenów beztlenowych.

---

### **RD-17: Bariera botulinowa (Krytyczny próg kwasowości pH 4.60)**
* **Zasada biologiczna:** Przetrwalniki *Clostridium botulinum* nie kiełkują i nie produkują toksyny botulinowej, jeśli aktywność kwasowa spełnia warunek:
  $$\text{pH} < 4.60$$
* **Źródło:** US FDA 21 CFR Part 114, USDA Complete Guide to Home Canning.
* **Klasyfikacja stref:**
  * $\text{pH} \le 4.20$: **STREFA ZIELONA** (Bezpieczna). Pasteryzacja w kąpieli wodnej $100^\circ\text{C}$ lub pasteryzacja sous-vide $80^\circ\text{C}$ wystarcza do zapewnienia trwałości.
  * $4.21 \le \text{pH} \le 4.59$: **STREFA ŻÓŁTA** (Ostrzegawcza). Ryzyko błędu domowego pomiaru; zalecane zakwaszenie (ocet, sok z cytryny) do $\text{pH} \le 4.20$.
  * $\text{pH} \ge 4.60$: **STREFA CZERWONA** (Zagrożenie życia w warunkach beztlenowych). Zakaz zamykania w słoikach bez pasteryzacji ciśnieniowej ($121.1^\circ\text{C}$) lub tyndalizacji 3x24h.

### **RD-18: Przelicznik mocy kwasu octowego (Dilution Formula)**
* **Wzór:**
  $$V_1 \cdot C_1 = V_2 \cdot C_2 \implies V_{\text{ocet}} = V_{\text{zalewa}} \cdot \frac{C_{\text{docelowe}}}{C_{\text{wyjściowe}}}$$
* **Wektor testowy 1 (Przepis na ocet 10% zamieniany na ocet jabłkowy 5%):**
  * *Wejście:* W przepisie wymagane $100\,\text{ml}$ octu $10\%$. Użytkownik posiada ocet $5\%$.
  * *Oczekiwane:* $V_{5\%} = 100 \cdot \frac{10}{5} = 200\,\text{ml}$ octu 5%, a ilość wody w przepisie zostaje automatycznie zmniejszona o $100\,\text{ml}$.

### **RD-19: Minimalne stężenie kwasu octowego w stabilnych marynatach zimnych**
* **Zasada:** Marynaty warzywne niepasteryzowane (np. korniszony octowe przechowywane w spiżarni) wymagają minimalnego stężenia kwasu octowego w całkowitej objętości cieczy:
  $$C_{\text{AcOH}} \ge 2.5\%$$
* **Wektor testowy:**
  * *Wejście:* Słoik 1000 ml z 500 ml zalewy o stężeniu octu 2.0%.
  * *Oczekiwane:* Alert: „Stężenie kwasu 2.0% za niskie dla marynaty niepasteryzowanej. Wymagana pasteryzacja 10 min w $100^\circ\text{C}$ lub zwiększenie stężenia do min. 2.5%”.

### **RD-20: Kinetyka spadku pH w fermentacji mlekowej w funkcji czasu i temperatury**
* **Model estymacyjny:** W typowym nastawie ogórkowym przy $21^\circ\text{C}$:
  * Doba 0: $\text{pH} \approx 6.0–6.5$.
  * Doba 2: $\text{pH} \approx 4.8–5.2$.
  * Doba 4: $\text{pH} \le 4.2$ (przekroczenie bariery bezpieczeństwa).
  * Doba 7: $\text{pH} \approx 3.5–3.8$ (stabilizacja).
* **Wektor testowy:** Jeśli w dobie 4 zmierzone $\text{pH} > 4.6$, aplikacja sygnalizuje opóźnioną fermentację (możliwa za niska temperatura lub zakażenie).

### **RD-21…RD-32: Kompletny katalog reguł kwasowości:**
* `RD-21`: Kwasowość miareczkowa (TA) moszczu jabłkowego do produkcji octu: przeliczanie na gramy kwasu jabłkowego na litr.
* `RD-22`: Stechiometria utleniania etanolu do kwasu octowego przez bakterie Acetobacter: z 1 g etanolu powstaje ok. 1.3 g kwasu octowego.
* `RD-23`: Buforowanie kwasowości przez białka mięsne: mięso wymaga 3-krotnie większego stężenia kwasu niż warzywa do obniżenia pH o 1 jednostkę.
* `RD-24`: Bezpieczne zakwaszanie czosnku w oliwie: moczenie w 3% kwasie cytrynowym obniża pH rdzenia ząbka czosnku do $<4.0$.
* `RD-25`: Kwasowość wina używanego jako baza do octu winnego (wymóg stężenia alkoholu $6\%–8\%$).
* `RD-26`: Spadek pH pod wpływem dwutlenku węgla rozpuszczonego w kombuchy ($H_2CO_3$).
* `RD-27`: Wpływ kwasowości na inaktywację enzymów brunatnienia (polifenolooksydaza traci aktywność przy $\text{pH} < 3.5$).
* `RD-28`: Korekta odczytu szklanej elektrody pH-metru względem temperatury roztworu (równanie Nernsta).
* `RD-29`: Stężenie kwasu mlekowego w dojrzałej kapuście kiszonej ($1.2\%–1.8\%$).
* `RD-30`: Stosunek kwasu mlekowego do octowego w fermentacjach heterofermentatywnych (optymalne ratio sensoryczne $4:1$).
* `RD-31`: Hamowanie wzrostu drożdży kożuchujących Kahm przy pH $< 3.2$.
* `RD-32`: Wpływ kwasu askorbinowego na potencjał redox solanki fermentacyjnej.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D1 do D25.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C4: Proces treści merytorycznych i decyzje badacza (Rozdz. 8.P)**

Zgodnie z nadrzędną zasadą studia Apps4Brew, kwestii merytorycznych (biologia, chemia, normy sanitarne) nie rozstrzyga właściciel ani programista, lecz badacz dziedzinowy według 5-szczeblowej hierarchii źródeł:
1. **Szczebel 1:** Prawa fizykochemii i matematyki (obliczenia stechiometryczne, kinetyka cieplna, termodynamika).
2. **Szczebel 2:** Oficjalne normy sanitarne i procedury rządowe (USDA Complete Guide to Home Canning, US FDA 21 CFR, PN-EN, FAO Food Nutrition Papers).
3. **Szczebel 3:** Podręczniki akademickie mikrobiologii i technologii żywności (Ray & Bhunia „Fundamental Food Microbiology”, Rene Redzepi & David Zilber „The Noma Guide to Fermentation”, Sandor Katz „The Art of Fermentation”).
4. **Szczebel 4:** Publikacje uznanych uniwersyteckich stacji rozszerzenia rolniczego (Penn State Extension, UC Davis Food Safety, National Center for Home Food Preservation — NCHFP).
5. **Szczebel 5:** Tradycyjna praktyka społeczności i forów rzemieślniczych (wyłącznie jako ciekawostka kulturowa, nigdy jako twarda reguła bezpieczeństwa).

---

## **Kompletny rejestr decyzji badacza merytorycznego (D-01…D-25)**

### **D-01: Bezwzględny wymóg pasteryzacji ciśnieniowej lub tyndalizacji dla produktów o pH $\ge 4.60$**
* **Decyzja:** Kategorycznie zabrania się instruowania użytkowników, że gotowanie w garnku z wrzątkiem jest bezpieczne dla warzyw niekwasowych (fasolka, groszek, kukurydza) oraz przetworów mięsnych. Woda wrząca w warunkach atmosferycznych osiąga maksymalnie $100^\circ\text{C}$, podczas gdy inaktywacja termiczna przetrwalników *Clostridium botulinum* wymaga temperatury $121.1^\circ\text{C}$ pod ciśnieniem lub 3-krotnej pasteryzacji frakcjonowanej (tyndalizacji).
* **Odrzucona alternatywa:** Zezwolenie na pasteryzację wodną z ostrzeżeniem tekstowym (odrzucono ze względu na śmiertelne ryzyko zatrucia toksyną botulinową).
* **Źródło:** USDA Bulletin 539, FDA BAM Chapter 17.

### **D-02: Przyjęcie laboratoryjnego marginesu bezpieczeństwa pH 4.20 dla domowych pomiarów**
* **Decyzja:** Chociaż literatura naukowa podaje wartość graniczną 4.60, ze względu na błędy pomiarowe domowych pH-metrów (dryf elektrody szklanej, brak kompensacji temperatury ATC) oraz pasków lakmusowych wprowadzono próg zielony $\le 4.20$.
* **Źródło:** NCHFP Guidelines on Acidified Foods.

### **D-03: Kwalifikacja drożdży kożuchujących Kahm jako wady estetycznej, a nie skażenia toksynowego**
* **Decyzja:** Drożdże kożuchujące (*Pichia*, *Debaryomyces*) nie produkują mykotoksyn. W module Diagnostyka zaklasyfikowano je jako wadę estetyczną: usunięcie kożucha i wygotowanie docisku wystarcza do uratowania partii.
* **Źródło:** Kurtzman et al. „The Yeasts: A Taxonomic Study”.

### **D-04: Czosnek w oliwie — obowiązkowe wstępne zakwaszenie kwasem cytrynowym**
* **Decyzja:** Świeży czosnek zalany oliwą i trzymany w temperaturze pokojowej to klasyczne środowisko powstawania botulizmu. Aplikacja nakazuje 24-godzinne moczenie ząbków w roztworze kwasu cytrynowego $3\%$ przed zalaniem oliwą lub przechowywanie w chłodzie max 4 dni.
* **Źródło:** UC Davis Division of Agriculture and Natural Resources, Publication 8004.

### **D-05: Zakwaszanie przetworów pomidorowych sokiem z cytryny**
* **Decyzja:** Ze względu na zmienne pH nowoczesnych odmian pomidorów ($pH \approx 4.5–4.9$), aplikacja bezwzględnie nakazuje dodanie 2 łyżek stołowych soku z cytryny (lub 1/2 łyżeczki kwasu cytrynowego) na 1 litr przetworu pomidorowego pasteryzowanego w kąpieli wodnej.
* **Źródło:** USDA Guide 3: Selecting, Preparing, and Canning Tomatoes.

### **D-06: Minimalne bezpieczne stężenie soli w kiszonkach probiotycznych**
* **Decyzja:** Ustalenie minimalnego progu stężenia soli w całkowitej masie na poziomie **$1.8\%$**. Wartości poniżej 1.8% sprzyjają dominacji bakterii gnilnych i enzymatycznemu mięknięciu ogórków.
* **Źródło:** Fleming et al. „Fermented and Acidified Vegetables”.

### **D-07: Zakaz stosowania soli z antyzbrylaczem ($E536$) w kiszonkach**
* **Decyzja:** Żelazocyjanek potasu ($E536$) reaguje z kwasem mlekowym i jonami żelaza, powodując nieestetyczne szare zabarwienie solanki i osad na dnie. Aplikacja zaleca czystą sól kamienną kłodawską niejodowaną lub sól morską bez dodatków chemicznych.

### **D-08: Rygor czasowy tyndalizacji (odstęp 24–36 godzin)**
* **Decyzja:** Faza odpoczynku pomiędzy kolejnymi gotowaniami musi wynosić min. 24h i max 36h w temperaturze pokojowej ($20–25^\circ\text{C}$). Odstęp krótszy niż 20h nie pozwala przetrwalnikom wykiełkować; odstęp dłuższy niż 40h grozi wytworzeniem toksyny przez namnożone bakterie.
* **Źródło:** Podręcznik „Technologia Przetwórstwa Mięsnego”, SGGW.

### **D-09: Zastosowanie chlorku wapnia ($CaCl_2$) w stężeniu 0.05%–0.10%**
* **Decyzja:** Jony $Ca^{2+}$ wiążą się z wolnymi grupami karboksylowymi kwasu poligalakturonowego, usztywniając blaszki środkowe komórek roślinnych. Dawka $>0.15\%$ wprowadza nieprzyjemny, gorzko-słony smak.

### **D-10: Kryteria rozpoznawania pleśni w kiszonkach**
* **Decyzja:** Jakikolwiek nalot o strukturze puszystego meszku (zarodniki zielone, czarne, różowe, szare) dyskwalifikuje partię. Zakazuje się „zdejmowania pleśni łyżką”, gdyż mikotoksyny (np. patulina) dyfundują w głąb roztworu wodnego.

### **D-11…D-25: Rejestr pozostałych decyzji badacza:**
* `D-11`: Dopuszczalność stosowania octu jabłkowego 5% jako substytutu octu spirytusowego 10% przy odpowiednim przeliczeniu proporcji wody.
* `D-12`: Ustalenie optymalnego stężenia cukru w powidłach śliwkowych bez cukru na min. $60^\circ\text{Bx}$.
* `D-13`: Wykluczenie naczyń aluminiowych i miedzianych z kontaktu z kwasem mlekowym.
* `D-14`: Standard usuwania spinek Weck po 24h od zakończenia pasteryzacji.
* `D-15`: Wymóg pozostawienia przestrzeni nagłownej $2.5\,\text{cm}$ dla przetworów mięsnych.
* `D-16`: Temperatura pasteryzacji sous-vide korniszonów ustalona na $77–82^\circ\text{C}$ przez 30 minut.
* `D-17`: Korekta wrzenia wody o $0.33^\circ\text{C}$ na każde 100 m n.p.m.
* `D-18`: Czas solenia wstępnego kapusty pekińskiej na kimchi ustalony na 6–8 godzin.
* `D-19`: Zakaz odwracania słoików Weck dnem do góry po pasteryzacji.
* `D-20`: Zalecenie stosowania szkła ciśnieniowego do wtórnej fermentacji kombuchy F2.
* `D-21`: Ustalenie czasu maceracji cytryn marokańskich na minimum 4 tygodnie w temperaturze pokojowej.
* `D-22`: Wymóg stosowania ziela angielskiego i liścia laurowego jako naturalnych fitoncydów.
* `D-23`: Kwalifikacja niebieskiego czosnku jako barwnika pirolowego nieszkodliwego dla zdrowia.
* `D-24`: Zakaz chłodzenia gorących słoików zimną wodą lub przeciągiem (ochrona przed pęknięciem szkła).
* `D-25`: Wymóg mycia i wyparzania słoików w temperaturze min. $70^\circ\text{C}$ przed napełnieniem.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · C5 · rozdz. 8 reguły dziedzinowe - RD-33 do RD-55 (kinetyka termiczna pasteryzacji, F0 P0, równowaga cukier-kwas-pektyna).md -->
<!-- ========================================== -->

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · D1 · rozdz. 9-10 wymagania niefunkcjonalne (NFR) i zgodność z Apple.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D1: Wymagania niefunkcjonalne (NFR) i zgodność z Apple (Rozdz. 9–10)**

## **Rozdział 9: Wymagania niefunkcjonalne (NFR-001…NFR-115)**

Wymagania niefunkcjonalne stanowią twarde ograniczenia jakościowe dla całego systemu. Każde wymaganie podlega automatycznej weryfikacji w pipeline CI.

---

### **9.1 Offline i Niezależność Sieciowa (NFR-OFF-001…010)**
* **NFR-OFF-001:** 100% funkcjonalności aplikacji (kalkulatory solanek, monitor fermentacji, stoper pasteryzacji, baza naczyń, spis spiżarni, moduł diagnostyczny, eksport i import kopii zapasowej) działa bez aktywnego połączenia z siecią w trybie samolotowym.
* **NFR-OFF-002:** Aplikacja nie zawiera żadnych odwołań sieciowych (`fetch`, `XMLHttpRequest`, `axios`, `WebSocket`) do zewnętrznych serwerów w warstwie domenowej ani prezentacji.
* **NFR-OFF-003:** Baza danych SQLite jest inicjalizowana lokalnie w katalogu piaskownicy aplikacji (`NSDocumentDirectory`).
* **NFR-OFF-004:** Baza wiedzy (atlas kultur mikrobiologicznych, przepisy bazowe, drzewa diagnostyczne) jest w całości skompilowana w lokalnym bundle aplikacji i nie wymaga pobierania dodatkowych pakietów.
* **NFR-OFF-005:** Generowanie etykiet graficznych i kodów QR odbywa się w 100% na procesorze urządzenia bez odpytywania zewnętrznych API graficznych.
* **NFR-OFF-006…010:** Weryfikacja braku uprawnień sieciowych w `app.json` i `Info.plist`, odporność na błędy braku łączności w watchOS.

---

### **9.2 Dostępność i Ergonomia Kuchenna (NFR-DOST-001…015)**
* **NFR-DOST-001:** 100% elementów interaktywnych posiada pełne etykiety VoiceOver (`accessibilityLabel`, `accessibilityHint`, `accessibilityRole`).
* **NFR-DOST-002:** Minimalny cel dotykowy w widokach kuchennych (np. przycisk startu pasteryzacji, odhaczenie odgazowania) wynosi co najmniej $56 \times 56\,\text{pt}$ (zwiększony standard dla mokrych lub ubrudzonych palców).
* **NFR-DOST-003:** Dynamic Type: wszystkie teksty skalują się bez obcięć (Zero Truncation) od rozmiaru `xSmall` do największego rozmiaru dostępnościowego `AccessibilityXXL`.
* **NFR-DOST-004:** Kontrast barwny tekstu do tła spełnia kryteria WCAG 2.1 AAA: minimalny kontrast $7.0:1$ dla tekstu zwykłego i $4.5:1$ dla nagłówków.
* **NFR-DOST-005:** Żadna informacja o stanie mikrobiologicznym (np. strefa bezpieczeństwa pH) nie jest przekazywana wyłącznie za pomocą koloru — zawsze towarzyszy jej wyrazista ikona i jednoznaczny opis tekstowy.
* **NFR-DOST-006…015:** Dźwiękowe i haptyczne potwierdzenia dla osób niewidomych, obsługa zewnętrznych klawiatur Bluetooth i przełączników dostępnościowych iOS.

---

### **9.3 Lokalizacja i Wielojęzyczność (NFR-I18N-001…012)**
* **NFR-I18N-001:** Architektura i18n oparta na silniku lokalizacyjnym studia Apps4Brew z precyzyjnymi słownikami kluczy.
* **NFR-I18N-002:** Obsługa formatowania liczb, separatorów dziesiętnych (przecinek w PL vs kropka w US) oraz jednostek miar zgodnie z `Intl.NumberFormat`.
* **NFR-I18N-003:** Dynamiczne dopasowanie jednostek (metryczne: g, kg, ml, l, cm vs imperialne: oz, lb, fl oz, cal).
* **NFR-I18N-004…012:** Pokrycie testami 100% kluczy językowych, brak martwych kluczy w słownikach (`npm run check:i18n`).

---

### **9.4 Wydajność i Czas Reakcji (NFR-WYD-001…012)**
* **NFR-WYD-001:** Zimny start aplikacji (Cold Start) na urządzeniach od iPhone 11 w górę trwa poniżej $800\,\text{ms}$.
* **NFR-WYD-002:** Stabilne 60 FPS (i 120 FPS na ekranach ProMotion) podczas przewijania list w spiżarni z 500 słoikami.
* **NFR-WYD-003:** Synchroniczne przeliczanie formuł solanki i pasteryzacji w czasie $< 2\,\text{ms}$.
* **NFR-WYD-004…012:** Czas renderowania etykiety PNG $< 150\,\text{ms}$, limity zużycia pamięci RAM $< 90\,\text{MB}$.

---

### **9.5 Bezpieczeństwo i Prywatność (NFR-BEZP-001…018)**
* **NFR-BEZP-001:** Zero zbierania danych telemetrycznych i osobowych („Data Not Collected” w App Store Privacy Manifest).
* **NFR-BEZP-002:** Wszystkie zapytania SQL korzystają ze zmiennych wiązanych (`?`), eliminując 100% podatności na SQL Injection.
* **NFR-BEZP-003:** Wyłączona telemetria systemowa stron trzecich; brak Crashlytics czy SDK analitycznych.
* **NFR-BEZP-004…018:** Bezpieczne przechowywanie kopii zapasowej, brak ekspozycji identyfikatorów w logach.

---

### **9.6 Niezawodność i Integralność Danych (NFR-DANE-001…014)**
* **NFR-DANE-001:** Tryb SQLite WAL (`PRAGMA journal_mode = WAL;`) i pełna atomowość transakcji zapisu partii.
* **NFR-DANE-002:** Zero utraty danych przy nagłym ubiciu procesu w trakcie pasteryzacji.
* **NFR-DANE-003:** Automatyczna kopia zapasowa przed każdą migracją schematu bazy danych.
* **NFR-DANE-004…014:** Weryfikacja sum kontrolnych SHA-256 eksportowanego pliku JSON.

---

### **9.7 Interakcja i Zegarek watchOS (NFR-ZEG-001…012)**
* **NFR-ZEG-001:** Aplikacja watchOS działa w pełni autonomicznie bez konieczności ciągłego połączenia Bluetooth z telefonem.
* **NFR-ZEG-002:** Sterowanie cyfrową koronką (Digital Crown) z haptyczną informacją zwrotną co 1 minutę pasteryzacji.
* **NFR-ZEG-003…012:** Live Activity na ekranie blokady, obsługa Dynamic Island, automatyczne wznawianie stopera.

---

### **9.8 Rygor Testowy (NFR-TEST-001…014)**
* **NFR-TEST-001:** 100% pokrycia linii, gałęzi i funkcji w czystej logice domenowej `src/core/domain/`.
* **NFR-TEST-002:** Wskaźnik przeżywalności testów mutacyjnych Stryker poniżej 10% ($\ge 90\%$ zabitych mutantów).
* **NFR-TEST-003…014:** Testy property-based `fast-check`, testy odpornościowe transakcji, automatyczne scenariusze Maestro E2E.

---

## **Rozdział 10: Zgodność z wytycznymi Apple App Store Review Guidelines**

1. **Wytyczna 4.3(a) & 4.3(b) (Spam i brak unikalności):** Aplikacja broni się bogatym, unikalnym modułem laboratoryjnej fizykochemii (solanki masowe, penetracja ciepła, kinetyka fermentacji), natywną aplikacją na Apple Watch z cyfrową koronką, Live Activity oraz Szkołą Przetwórstwa. Nie jest prostym licznikiem ani generyczną książką kucharską.
2. **Wytyczna 5.1.1 (Prywatność i zbieranie danych):** Etykieta App Privacy zawiera wyłącznie status „Data Not Collected”. Brak profilowania, brak wymogu logowania.
3. **Wytyczna 3.1.2 (Subskrypcje i zakupy in-app):** Jasna prezentacja cen, przywracanie zakupów (Restore Purchases) widoczne na pierwszym planie, pełny opis korzyści wersji Pro.
4. **Wytyczna 1.4.1 (Bezpieczeństwo żywności i zdrowie):** Aplikacja zawiera wyraźny disclaimer prawny informujący, że stanowi narzędzie wspomagające, a odpowiedzialność za higienę surowców i bezpieczeństwo przetworów spoczywa na użytkowniku. Ostrzeżenia o botulizmie są zgodne z oficjalnymi wytycznymi agencji rządowych.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · D2 · rozdz. 11-12 architektura, relacyjny model danych SQLite i przenośność.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D2: Architektura techniczna i model danych SQLite (Rozdz. 11–12)**

## **Rozdział 11: Architektura systemu**

Aplikacja oparta jest na wzorcu **Czystej Architektury (Hexagonal / Clean Architecture)** gwarantującym absolutną niezależność domeny matematyczno-biologicznej od frameworków UI.

```text
+-----------------------------------------------------------------------------------+
|                        PREZENTACJA (Expo Router / UI / WatchOS)                   |
|   - Ekrany: Kalkulator, Monitor partii, Pasteryzacja, Spiżarnia, Szkoła, Ustawienia |
|   - Komponenty: JarGeometryViewer, BrineSlider, PhaseTimeline, WatchCompanion     |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        APLIKACJA (Application Use Cases)                          |
|   - CreateBatchUseCase, CompleteFermentationUseCase, ExecutePasteurizationUseCase |
|   - GenerateQrLabelUseCase, EvaluateSafetyStatusUseCase, ExportBackupUseCase      |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        DOMENA (Pure TypeScript Domain Core)                       |
|   - Modele: Batch, Jar, SalinityFormula, HeatPenetrationCurve, PectinEquilibrium  |
|   - Reguły: RD-01..RD-55 (Zero zależności od react-native, 100% testów)           |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                   INFRASTRUKTURA (Persistence & Native Bridges)                   |
|   - SQLiteDatabaseDriver (WAL mode, Foreign Keys), FileSystemStorage              |
|   - AppleWatchConnectivityBridge, HapticsFeedbackService, LocalNotifications      |
+-----------------------------------------------------------------------------------+
```

---

## **Rozdział 12: Relacyjny schemat bazy danych SQLite (DDL) i migracje**

Baza danych `preserves.db` inicjalizowana jest poniższym kompletnym skryptem DDL:

```sql
-- Włączenie kluczy obcych i trybu WAL
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = FULL;
PRAGMA busy_timeout = 5000;

-- Tabela 1: Partie przetworów (Batches)
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('lacto_ferment', 'vinegar_pickle', 'jam_preserve', 'beverage', 'meat_fish', 'confit', 'koji_miso', 'custom')),
    recipe_id TEXT,
    jar_type_id TEXT NOT NULL,
    jar_volume_ml INTEGER NOT NULL,
    jar_count INTEGER NOT NULL DEFAULT 1,
    vegetable_mass_g REAL NOT NULL,
    water_mass_g REAL NOT NULL,
    salt_mass_g REAL NOT NULL,
    salt_percent REAL NOT NULL,
    salinity_mode TEXT NOT NULL CHECK(salinity_mode IN ('total_mass', 'water_only', 'dry_salting')),
    target_ph REAL,
    measured_ph REAL,
    safety_status TEXT NOT NULL DEFAULT 'PENDING' CHECK(safety_status IN ('SAFE', 'WARNING', 'CRITICAL_BOTULISM_RISK', 'PENDING')),
    status TEXT NOT NULL CHECK(status IN ('active_ferment', 'pasteurizing', 'mature_in_pantry', 'consumed', 'spoiled')),
    started_at TEXT NOT NULL,
    ferment_f1_end_at TEXT,
    mature_at TEXT,
    best_before_at TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabela 2: Predefiniowane i własne naczynia/słoiki (Jars)
CREATE TABLE IF NOT EXISTS jars (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL, -- 'Weck', 'Twist-Off', 'Mason', 'Kamionka', 'Fido', 'Inny'
    closure_type TEXT NOT NULL CHECK(closure_type IN ('glass_clamp', 'twist_lid', 'mason_band', 'wire_bail', 'water_groove', 'open_cloth')),
    volume_ml INTEGER NOT NULL,
    diameter_mm INTEGER,
    recommended_headspace_mm INTEGER NOT NULL,
    can_pressure_can BOOLEAN NOT NULL DEFAULT 0,
    is_custom BOOLEAN NOT NULL DEFAULT 0
);

-- Tabela 3: Pomiary laboratoryjne partii (Measurements)
CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    measured_at TEXT NOT NULL DEFAULT (datetime('now')),
    measurement_type TEXT NOT NULL CHECK(measurement_type IN ('ph', 'brix', 'temperature_c', 'salinity_pct', 'sensory_note')),
    numeric_value REAL,
    text_value TEXT,
    photo_uri TEXT
);

-- Tabela 4: Sesje pasteryzacji (Pasteurization_Sessions)
CREATE TABLE IF NOT EXISTS pasteurization_sessions (
    id TEXT PRIMARY KEY,
    batch_id TEXT REFERENCES batches(id) ON DELETE SET NULL,
    method TEXT NOT NULL CHECK(method IN ('water_bath', 'oven', 'sous_vide', 'tyndallization_d1', 'tyndallization_d2', 'tyndallization_d3', 'pressure')),
    target_temp_c REAL NOT NULL,
    duration_seconds INTEGER NOT NULL,
    completed_seconds INTEGER NOT NULL,
    is_successful BOOLEAN NOT NULL DEFAULT 0,
    calculated_p0 REAL,
    calculated_f0 REAL,
    started_at TEXT NOT NULL,
    finished_at TEXT
);

-- Tabela 5: Zapasy spiżarni (Pantry_Items)
CREATE TABLE IF NOT EXISTS pantry_items (
    id TEXT PRIMARY KEY,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    storage_location TEXT NOT NULL DEFAULT 'Piwnica',
    shelf_identifier TEXT,
    remaining_jars INTEGER NOT NULL,
    initial_jars INTEGER NOT NULL,
    qr_code_payload TEXT UNIQUE NOT NULL
);

-- Tabela 6: Historia i audyt (Audit_Log)
CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indeksy wydajnościowe
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_category ON batches(category);
CREATE INDEX IF NOT EXISTS idx_measurements_batch_id ON measurements(batch_id);
CREATE INDEX IF NOT EXISTS idx_pantry_batch_id ON pantry_items(batch_id);
CREATE INDEX IF NOT EXISTS idx_pantry_qr ON pantry_items(qr_code_payload);
```

### **12.2 Mechanizm migracji schematu `migrate()`**
Migracje zarządzane są w dedykowanym module `src/core/state/migrate.ts`.
Przed uruchomieniem jakiejkolwiek migracji baza tworzy automatyczną kopię zapasową w pliku `preserves.pre_v{old}.bak`.

```typescript
export interface Migration {
  fromVersion: number;
  toVersion: number;
  up: (db: DatabaseClient) => Promise<void>;
  down: (db: DatabaseClient) => Promise<void>;
}

export const MIGRATIONS: Migration[] = [
  {
    fromVersion: 0,
    toVersion: 1,
    up: async (db) => {
      await db.executeSql(DDL_SCHEMA_V1);
    },
    down: async (db) => {
      await db.executeSql('DROP TABLE IF EXISTS audit_log;');
      await db.executeSql('DROP TABLE IF EXISTS pantry_items;');
      await db.executeSql('DROP TABLE IF EXISTS pasteurization_sessions;');
      await db.executeSql('DROP TABLE IF EXISTS measurements;');
      await db.executeSql('DROP TABLE IF EXISTS jars;');
      await db.executeSql('DROP TABLE IF EXISTS batches;');
    }
  }
];
```

### **12.3 Koperta kopii zapasowej JSON (Backup Envelope)**
Zgodnie z zasadą ZP-06 eksport danych tworzy pojedynczy, samowystarczalny plik JSON z sumą kontrolną:
```json
{
  "format": "sloik-backup",
  "schemaVersion": 1,
  "exportedAt": "2026-10-15T23:00:00Z",
  "appVersion": "1.0.0",
  "checksum": "sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "data": {
    "batches": [],
    "jars": [],
    "measurements": [],
    "pantryItems": [],
    "pasteurizationSessions": []
  }
}
```

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · D3 · rozdz. 14, 16 rejestr ryzyk (RYZ-01 RYZ-60) i otwarte pytania.md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D3: Rejestr ryzyk i pytania otwarte (Rozdz. 14, 16)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: Kiszonki BRD 0.1 · D4 · rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości dla bezpieczeństwa żywności i logiki).md -->
<!-- ========================================== -->

# **Kiszonki, przetwory, słoiki BRD 0.1 — Część D4: Wielowarstwowa strategia testów — 9 warstw jakości (Rozdz. 17)**

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

---
