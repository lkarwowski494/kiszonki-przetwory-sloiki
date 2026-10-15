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

