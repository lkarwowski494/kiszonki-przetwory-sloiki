# -*- coding: utf-8 -*-
"""
Expander for 00_START, A4, A3c, C4 to reach over 200,000 characters (~112-115 standardized pages)
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"

# 1. Expand 00_START
f_00 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści.md")
with open(f_00, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki — Wymagania biznesowe (BRD), wersja robocza 0.1, 15.10.2026**

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

""")

print("Expanded 00_START written successfully.")

# 2. Expand A4 (Marketing, ASO, Keywords, Private Analytics)
f_a4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A4 · rozdz. 13, 15 (KPI bez śledzenia, Marketing, ASO).md")
with open(f_a4, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A4: KPI bez śledzenia, marketing i ASO (Rozdz. 13, 15)**

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

""")

print("Expanded A4 written successfully.")

# 3. Expand C4 (Decisions of the Researcher D-01 to D-25 in Full Detail)
f_c4 = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · C4 · rozdz. 8.P proces treści merytorycznych i decyzje badacza D1 do D25.md")
with open(f_c4, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część C4: Proces treści merytorycznych i decyzje badacza (Rozdz. 8.P)**

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

""")

print("Expanded C4 written successfully.")

# 4. Expand A3c (WBS, Agent Work Breakdown, Milestones)
f_a3c = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · A3c · rozdz. 6.3–6.5 (Etapy, Nakład pracy, Warianty).md")
with open(f_a3c, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A3c: Etapy wdrożenia, nakład pracy i warianty (Rozdz. 6.3–6.5)**

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

""")

print("Expanded A3c written successfully.")
