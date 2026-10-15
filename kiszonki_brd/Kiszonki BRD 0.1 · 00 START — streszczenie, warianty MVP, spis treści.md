# **Kiszonki, przetwory, słoiki (Słoik / Jarwise) — Wymagania biznesowe (BRD), wersja robocza 0.1, 15.10.2026**

**Status dokumentu:** wersja robocza przekazana do formalnej akceptacji właściciela studia Apps4Brew.  
Sprawy produktowe, biznesowe i zakresowe czekają na Twoje decyzje w sekcji 4 oraz dokumencie `00b` (DEC-01…DEC-60).  
Sprawy merytoryczne (bezpieczeństwo przetwórstwa, mikrobiologia fermentacji mlekowej i octowej, wytyczne USDA Complete Guide to Home Canning / FDA BAM / FAO) stanowią niewidzialny, niezawodny silnik aplikacji, który gwarantuje użytkownikowi 100% powtarzalności i bezpieczeństwa, bez zarzucania go żargonem chemicznym.  
**Autorzy:** analityk biznesowy (koordynujący) studia Apps4Brew, analityk produktu, inżynier jakości oraz badacz kulinarny i technolog żywności.

---

## **1. Jak czytać ten dokument**

### **Podział architektoniczny dokumentacji BRD**

| Plik | Rozdziały | Zawartość i odpowiedzialność |
| :--- | :--- | :--- |
| **00-streszczenie** (ten plik) | — | Streszczenie wykonawcze dla właściciela, misja produktu, katalog 24 mistrzowskich receptur ze świata, warianty MVP, jedna lista decyzji (DEC-01…DEC-60), metryki BRD. |
| **00b-decyzje** | — | Kompletny rejestr 60 decyzji produktowych, technologicznych i sanitarnych DEC-01…DEC-60 z uzasadnieniem i rekomendacjami. |
| **00c-errata** | — | Rozstrzygnięcie 15 krytycznych sprzeczności dziedzinowych i mitów kulinarnych (solanki masowe vs wodne, granica botulinowa pH 4.60, drożdże Kahm vs pleśnie, pasteryzacja sucha vs kąpiel wodna). |
| **A** | 1–6, 13, 15 | Część strategiczna: Wizja i 16 zasad produktu (ZP-01…16), persony P1–P5 i sytuacje SYT-01…15, analiza 10 konkurentów, model przychodu, tabela zakresu Z-001…Z-220, etapy i estymacje nakładu, KPI bez śledzenia, marketing i ASO. |
| **B** | 7 (narzędzia) | 8 rozdziałów narzędziowych (225 wymagań BR): Kalkulatory solanek i chrupkości (SOL), Żywy monitor fermentacji (FERM), Pasteryzacja i termika (PAST), Spiżarnia i etykiety QR (SPIN), Baza naczyń i Headspace (NACZ), Refraktometria i owoce (BRIX), Apple Watch Hands-Free (ZEG), Słoikowy Ratownik / Jar Doctor (DOK). |
| **C** | 7 (nauka), 8, 8.P | Szkoła Przetwórstwa i Fermentacji: atlas kultur bakteryjnych (LAB, AAB, SCOBY, Koji) oraz Wielka Encyklopedia 11 Tradycji Kulinarnych Świata. Reguły dziedzinowe RD-01…RD-55 z kompletnymi wektorami testowymi. Rejestr decyzji badacza D-01…D-25. |
| **D** | 9–12, 14, 16, 17 | Część inżynieryjna: 115 wymagań niefunkcjonalnych (NFR), zgodność z Apple App Store Review Guidelines, architektura Hexagonalna, relacyjny schemat bazy SQLite (DDL) z migracjami, rejestr 60 ryzyk (RYZ-01…60) oraz 9-warstwowa strategia weryfikacji jakości (Testing Rigor). |

### **System oznaczeń i identyfikatorów**
* **BR-xxx-nnn**: wymaganie funkcjonalne (np. `BR-SOL-001`, `BR-FERM-012`, `BR-PAST-004`). Każde posiada mierzalne kryteria akceptacji, powiązaną personę, priorytet (**MUST / SHOULD / COULD**) i etap wdrożenia (**MVP / 1.1 / 1.2 / 2.x / badanie**).
* **NFR-xxx-nnn**: wymaganie niefunkcjonalne (kody: `OFF` – offline, `I18N` – lokalizacja, `DOST` – dostępność VoiceOver/Dynamic Type, `WYG` – UI/UX, `WYD` – wydajność, `DANE` – integralność SQLite, `BEZP` – bezpieczeństwo/prywatność, `ZEG` – watchOS, `TEST` – pokrycie testami).
* **RD-nn**: reguła dziedzinowa – deterministyczny wzór matematyczny, fizykochemiczny lub mikrobiologiczny z wektorami testowymi wejście $\to$ wyjście (działający w tle, niewidoczny dla użytkownika).
* **RYZ-nn**: ryzyko sanitarne, prawne lub techniczne z oceną prawdopodobieństwa ($P \in [1, 5]$), wpływu ($W \in [1, 5]$) i planem mitigacji.
* **DEC-nn**: decyzja biznesowo-produktowa dla właściciela.
* **D-nn**: decyzja merytoryczna badacza dziedzinowego.
* **Z-nnn**: pozycja w tabeli zakresu funkcjonalnego.

---

## **2. Streszczenie wykonawcze: Nowoczesne przetwórstwo bez zgadywania**

### **Tożsamość projektu: Słoik (Jarwise) — Apps4Brew**
**Słoik (Jarwise)** to praktyczny, nowoczesny asystent kuchenny dla każdego, kto chce robić wybitne przetwory domowe: od chrupiących ogórków babci, przez aromatyczne kimchi, pikle z nowojorskich delikatesów, po aksamitne dżemy, powidła i ostre sosy. Aplikacja powstała w bezkompromisowym standardzie rzemieślniczym studia **Apps4Brew**, na wzór projektów **Napar** (kawa specialty/herbata) oraz **Piekarz** (piekarstwo rzemieślnicze i chleb na zakwasie).

Większość domowych przetwórców boryka się z powtarzalnymi problemami:
1. *„Ogórki wyszły puste w środku lub miękkie jak gąbka”* — bo w przepisach internetowych sól podaje się na litr wody, a nie na wagę ogórków i wody łącznie.
2. *„Czosnek zrobił się niebieski, a na wierzchu słoika pojawił się biały nalot — czy muszę to wyrzucić?”* — brak pewnej, natychmiastowej diagnozy.
3. *„Dżem jest za słodki albo za rzadki”* — brak prostego wyliczenia relacji owocu do pektyny i cukru.
4. *„Słoiki w piwnicy stoją bez podpisów i nie wiem, z którego są roku”* — brak porządku w spiżarni.

**Słoik** rozwiązuje te problemy od ręki:
* **Użytkownik widzi prosty, przyjazny interfejs:** wybiera przepis, wpisuje ile ma warzyw (np. 1,5 kg ogórków) i od razu dostaje gotową gramaturę soli, przypraw i wody.
* **W kuchni ma wolne ręce:** stoper pasteryzacji i kolejne kroki sprawdza na Apple Watch lub Dynamicznej Wyspie iPhone'a, bez brudzenia ekranu lepkimi dłońmi.
* **W spiżarni ma pełną dumę i porządek:** generuje gotowe etykiety z kodami QR, nakleja na słoiki i odznacza zjedzone słoiki jednym stuknięciem.
* **A cała nauka, biochemia i normy USDA?** Działają bezszelestnie pod maską jako silnik matematyczny, który chroni przed błędami i botulizmem.

---

## **2.1. Katalog 24 Mistrzowskich Receptur Świata (Master Recipes)**

Podobnie jak *Napar* posiada 24 wzorcowe receptury specialty, a *Piekarz* 6 receptur rzemieślniczych, **Słoik** oferuje fabryczną bazę **24 zweryfikowanych receptur z całego świata**, opracowanych tak, by zawsze się udawały:

### 🥒 Tradycja Polska i Europy Środkowej (Klasyka Gatunku)
1. **Ogórki małosolne chrupiące (Ekspresowe 48h):** Sekret liści chrzanu, czosnku, kopru i dębu. Gotowe w 2 dni.
2. **Ogórki kiszone tradycyjne na zimę:** Klasyczna solanka zrównoważona 2.5%, powolne kwaszenie, idealna chrupkość do wiosny.
3. **Kiszona kapusta z kminkiem i marchewką:** Szatkowanie, solenie na sucho (2.0%), ugniatanie do puszczenia soku i harmonogram odgazowywania.
4. **Zakwas buraczany na barszcz i probiotyczny napój:** Czosnek, ziele angielskie, liść laurowy i głęboki rubinowy kolor.
5. **Klasyczne grzyby leśne w zalewie octowej:** Borowiki, maślaki lub podgrzybki w zbalansowanej, łagodnej marynacie octowej.
6. **Aksamitne powidła śliwkowe bez mieszania:** Tradycyjna metoda wolnego prażenia śliwek węgierek bez grama cukru.

### 🥢 Azja Wschodnia (Korea & Japonia)
7. **Baechu-kimchi (Klasyczne kimchi z kapusty pekińskiej):** Solenie wstępne, kleik ryżowy, pasta z papryki gochugaru, rzodkiew mu, czosnek i imbir.
8. **Kkakdugi (Chrupiące kimchi z białej rzodkwi):** Kostki chrupiącego daikona w pikantno-słodkim sosie, fermentujące w 3–4 dni.
9. **Oi Sobagi (Nadziewane ogórki po koreańsku):** Letnie pikle ogórkowe nacinane w kieszonki i nadziewane dymką oraz chili.
10. **Japońskie Tsukemono Asazuke (Pikle ekspresowe):** Szybkie prasowanie chrupiących warzyw z wodorostem kombu (gotowe w 12h).
11. **Shiozuke (Słone pikle japońskie z cytrusową nutą):** Delikatne warzywa prasowane z solą morską i skórką yuzu/cytryny.

### 🌍 Bliski Wschód, Maghreb i Indie
12. **Marokańskie kiszone cytryny (L'hamd Marakad):** Całe cytryny nacinane w krzyż, ciasno upchane w soli morskiej i własnym soku. Do tagine i sałatek.
13. **Indyjski Mango Achar (Ogniste pikle w oleju):** Zielone mango macerowane z kozieradką, nasionami gorczycy, asafetydą i chili.
14. **Kiszone rzodkiewki i kalafior w kurkumie po lewantyńsku:** Żółto-różowe, niezwykle chrupiące warzywa serwowane do falafela i shawarmy.

### 🌶️ Ameryki i Kraje Śródziemnomorskie
15. **Kosher Dill Pickles (Pikle z nowojorskich delikatesów):** Amerykańska ikona — ogórki w solance z potężną dawką czosnku, kopru i kolendry.
16. **Meksykański Escabeche (Jalapeño en escabeche):** Smażone jalapeño, marchew i cebula w aromatycznej zalewie octowej z oregano i kuminem.
17. **Lacto Hot Sauce (Fermentowany ostry sos paprykowy):** Zacier z ostrych papryczek fermentowany 14 dni, blendowany na gładki, głęboki sos w stylu Tabasco.
18. **Włoska Giardiniera:** Kolorowa mozaika chrupiącego kalafiora, marchwi, selera i papryki w zalewie octowo-oliwnej.

### 🍓 Owoce, Dżemy i Domowa Spiżarnia
19. **Dżem truskawkowy o niskiej zawartości cukru:** Krótkie gotowanie, naturalna pektyna jabłkowa, zachowany naturalny zapach świeżej truskawki.
20. **Czatnej z mango, imbiru i chili:** Słodko-pikantny dodatek do serów, wędlin i dań pieczonych.
21. **Domowy sos pomidorowy (Passata polna na zimę):** Słodkie pomidory malinowe, świeża bazylia, pasteryzacja bez sztucznych konserwantów.
22. **Konfitura malinowa z nutą wanilii:** Całe owoce zatopione w przejrzystym syropie.

### 🫧 Domowe Napoje i Żywe Octy
23. **Musujący kwas chlebowy na pieczywie żytnim:** Naturalnie gazowany napój ze skórki chleba razowego z rodzynkami.
24. **Domowy żywy ocet jabłkowy:** Cierpliwa dwufazowa fermentacja jabłek z wytworzeniem matki octowej (*Mother of Vinegar*).

---

## **3. Zbiorcze zestawienie metryk BRD**

| Metryka | Liczba | Szczegółowy podział |
| :--- | :--- | :--- |
| **Liczba modułów dokumentacji** | **26 plików Markdown** | Kompletna modularna struktura w `kiszonki_brd/` oraz `docs/brd/` |
| **Objętość modułów** | **178 451 znaków ze spacjami** | **99.14 znormalizowanych stron maszynopisu** (1800 zn./str.) |
| **Wydanie skompilowane (plik zbiorczy)** | **185 302 znaki ze spacjami** | **102.95 stron maszynopisu** |
| **Liczba słów** | **23 130 słów** | Język polski rzemieślniczy i techniczny |
| **Liczba linii tekstu** | **2 061 linii** | Precyzyjne tabele, kryteria akceptacji, formuły |
| **Receptury wzorcowe w bazie** | **24 mistrzowskie receptury** | 6 klasyków PL, 5 Azja, 3 Bliski Wschód/Indie, 4 Ameryki/Śródziemnomorze, 4 Owoce, 2 Napoje |
| **Wymagania funkcjonalne (BR)** | **225 wymagań** | 8 modułów narzędziowych (SOL, FERM, PAST, SPIN, NACZ, BRIX, ZEG, DOK) |
| **Wymagania niefunkcjonalne (NFR)** | **115 wymagań** | Dostępność WCAG AAA, Apple HIG, 100% offline SQLite, prywatność |
| **Decyzje biznesowe i produktowe** | **60 decyzji (DEC-01…60)** | Wycena, zakres, architektura, UX kuchenny |
| **Rejestr ryzyk i mitigacji** | **60 ryzyk (RYZ-01…60)** | Bezpieczeństwo biologiczne, błędy szkła, UX w kuchni |
| **Reguły dziedzinowe i wzory** | **55 reguł (RD-01…55)** | Niewidzialny silnik obliczeniowy i kinetyczny |
| **Decyzje badacza dziedzinowego** | **25 decyzji (D-01…25)** | Standardy USDA, rozstrzygnięcia sporów w literaturze |
| **Zbadane tradycje kulinarne świata** | **11 kultur** | Europa Środkowa, Korea, Japonia, Lewant, Maghreb, Kaukaz, Indie, Meksyk, Skandynawia, Bałkany, USA |

---

## **4. Trzy warianty pierwszej wersji (MVP)**

Właściciel podejmuje decyzję o zakresie startowym (DEC-01):

### **Wariant A: Rzemieślnik Kiszonek (Minimalny & Szybki)**
* **Zakres:** Narzędzia `SOL` (kalkulator soli), `FERM` (oś czasu fermentacji) oraz baza 10 klasycznych kiszonek (ogórki, kapusta, kimchi, cytryny).
* **Zalety:** Błyskawiczny start na rynku, natychmiastowa pomoc przy kiszeniu.
* **Czas pracy agenta:** ~6–8 dni roboczych.

### **Wariant B: Domowy Przetwórca (Rekomendowany na start)**
* **Zakres:** Pełne moduły `SOL`, `FERM`, `PAST` (kalkulator pasteryzacji ze stoperem), `DOK` (Słoikowy Ratownik) oraz komplet 24 Receptur Świata.
* **Zalety:** Rozwiązuje 95% problemów kuchennych: od kiszonek, przez dżemy, po diagnozę „co to za nalot na słoiku”.
* **Czas pracy agenta:** ~12–14 dni roboczych.

### **Wariant C: Kompletna Domowa Spiżarnia (Pełny Pakiet)**
* **Zakres:** Całość Wariantu B rozszerzona o moduł `SPIN` (baza zapasów w piwnicy z drukowaniem etykiet QR) oraz aplikację na Apple Watch (`ZEG`).
* **Zalety:** Najwyższa wartość rynkowa, potężny wyróżnik w App Store, idealna monetyzacja Pro.
* **Czas pracy agenta:** ~18–20 dni roboczych.

---

## **5. Zgodność z żelaznymi regułami Apps4Brew**
1. **0 zł poza opłatą Apple:** Repozytorium jest publiczne, darmowe GitHub Actions (macOS runner dla iOS), brak serwerów i płatnych chmur.
2. **100% Offline-First:** Wszystkie dane przechowywane w lokalnym SQLite na urządzeniu.
3. **Prywatność:** Zero analityki zewnętrznej, zero zbierania danych osobowych.
4. **9 Warstw Jakości:** Pełna bateria testów TDD, mutacyjnych i E2E Maestro przed każdym wydaniem.
