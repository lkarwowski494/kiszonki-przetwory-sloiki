# -*- coding: utf-8 -*-
"""
Generator for Kiszonki BRD 0.1 - Part 00 and Part A
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# 1. 00 START
f00_start = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · 00 START — streszczenie, warianty MVP, spis treści.md")
with open(f00_start, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki — Wymagania biznesowe (BRD), wersja robocza 0.1, 15.10.2026**

**Status:** wersja robocza do akceptacji właściciela. Sprawy produktowe i biznesowe czekają na Twoje decyzje (sekcja 4, DEC-01…DEC-60). Sprawy merytoryczne (mikrobiologia fermentacji mlekowej, octowej i enzymatycznej, biochemia pektyn, termodynamika pasteryzacji, kinetyka destrukcji termicznej Clostridium botulinum oraz normy sanitarne USDA/FDA/Codex Alimentarius) rozstrzyga badacz według 5-szczeblowej hierarchii źródeł. Każdą taką decyzję możesz zawetować.  
**Autor:** analityk biznesowy (koordynujący) studia Apps4Brew. Części A–D napisali analitycy produktu i badacz dziedzinowy przetwórstwa i mikrobiologii żywności.

---

## **1. Jak czytać ten dokument**

### **Części dokumentu**

| Plik | Rozdziały | Zawartość |
| :--- | :--- | :--- |
| **00-streszczenie** (ten plik) | — | Streszczenie wykonawcze dla właściciela, warianty pierwszej wersji, jedna lista decyzji (DEC-01…DEC-60), warunki wstępne, spis treści. |
| **00b-decyzje** | — | Zbiorcza lista decyzji produktowych i pytań otwartych DEC-01…DEC-60 z rekomendacjami analityka. |
| **00c-errata** | — | Sprzeczności dziedzinowe i errata: solanka masowa vs wodna, granica botulinowa pH 4.6, kożuch fermentacyjny (Kahm) vs pleśń mikotoksynowa, fizyka słoików Weck vs Twist-off. |
| **A** | 1–6, 13, 15 | Wizja i 16 zasad produktu (ZP-01…16), problem i dowody rynkowe, persony P1–P6 i sytuacje SYT-01…15, analiza rynku i konkurencji, model przychodu, tabela zakresu Z-001…Z-220 z etapami, nakład pracy agentów, KPI bez śledzenia, marketing i ASO. |
| **B** | 7 (narzędzia) | Wymagania funkcjonalne narzędzi (BR-SOL, BR-FERM, BR-PAST, BR-SPIN, BR-NACZ, BR-BRIX, BR-ZEG, BR-DOK): kalkulatory solanek i stężeń soli, monitor fermentacji z krzywymi fazowymi, kalkulator pasteryzacji (P0/F0, tyndalizacja), cyfrowa spiżarnia i etykiety QR, asystent doboru słoików (headspace), refraktometr i pH-metr, Apple Watch / Live Activity hands-free, diagnostyk problemów przetwórstwa (Troubleshooting Doctor). |
| **C** | 7 (nauka), 8, 8.P | Szkoła Przetwórstwa i Fermentacji: atlas kultur bakteryjnych (LAB: Leuconostoc, Lactobacillus, Pediococcus) i drożdży. Reguły dziedzinowe RD-01…RD-55 (stężenia soli, kinetyka pH, osmoza, chlorek wapnia, taniny, penetracja ciepła, strefa zimnego punktu słoika, równowaga pektynowa, stężenia octu) z wektorami testowymi. Proces weryfikacji treści i rejestr decyzji badacza D-01…D-25. |
| **D** | 9–12, 14, 16, 17 | Wymagania niefunkcjonalne (NFR-OFF, NFR-I18N, NFR-DOST, NFR-WYD, NFR-BEZP, NFR-ZEG), zgodność z Apple App Store (3.1.2, 4.3(a)/(b), 5.1.1, Health/Safety), architektura techniczna offline-first, schemat bazy SQLite (DDL), rejestr 60 ryzyk (RYZ-01…RYZ-60) oraz 9-warstwowa strategia weryfikacji jakości (Testing Rigor). |

### **Oznaczenia identyfikatorów**
* **BR-xxx-nnn**: wymaganie funkcjonalne (np. `BR-SOL-001`, `BR-FERM-012`, `BR-PAST-004`). Każde posiada mierzalne kryteria akceptacji, personę, priorytet (**MUST / SHOULD / COULD**) i etap (**MVP / 1.1 / 1.2 / 2.x / badanie / nigdy**).
* **NFR-xxx-nnn**: wymaganie niefunkcjonalne (kody: `OFF` – offline, `I18N` – lokalizacja, `DOST` – dostępność VoiceOver/Dynamic Type, `WYG` – UI/UX, `WYD` – wydajność, `DANE` – integralność bazy SQLite, `BEZP` – bezpieczeństwo/prywatność, `ZEG` – watchOS, `TEST` – pokrycie testami).
* **RD-nn**: reguła dziedzinowa – deterministyczny wzór matematyczny, fizykochemiczny lub mikrobiologiczny z kompletnymi wektorami testowymi.
* **RYZ-nn**: ryzyko sanitarne, prawne lub techniczne z oceną prawdopodobieństwa, wpływu i planem mitigacji.
* **DEC-nn**: decyzja produktowa lub biznesowa dla właściciela.
* **Z-nnn**: wiersz tabeli zakresu funkcjonalnego.

---

## **2. Streszczenie dla właściciela**

### **Co to jest aplikacja „Kiszonki, przetwory, słoiki” (roboczo: Słoik / Jarwise)**
**Słoik (Jarwise)** to kieszonkowy asystent domowego przetwórstwa, fermentacji i wekowania z całego świata — stworzony w standardzie rzemieślniczym studia Apps4Brew na wzór aplikacji **Napar** (kawa specialty/herbata) oraz **Piekarz** (piekarstwo rzemieślnicze i zakwas). Obejmuje wszystko, co da się zamknąć w słoiku, butelce lub kamionce:
1. **Fermentacje mlekowe (Lacto-fermentation):** klasyczne polskie ogórki kiszone i małosolne, kapusta kiszona, koreańskie kimchi (baechu, kkakdugi, oi sobagi), japońskie pikle tsukemono (asazuke, nukazuke, shiozuke), marokańskie kiszone cytryny, fermentowane ostre sosy (hot sauce mash), kwas chlebowy i zakwas buraczany.
2. **Kultury symbiotyczne i octy:** domowe żywe octy owocowe z matką octową (Mother of Vinegar), kombucha i jun (fazy F1 i F2), koji, shio-koji i domowe pasty miso.
3. **Marynaty octowe i kwasowe:** polskie grzyby leśne, korniszony, dynia w occie, śliwki, brytyjskie piccalilli, włoska giardiniera, indyjskie achary w oleju gorczycowym, iberyjskie escabeche.
4. **Przetwory owocowe i słodzone:** tradycyjne powidła śliwkowe bez cukru, konfitury owocowe, dżemy nisko- i wysokosłodzone z kalkulacją stopni Brix i sieciowania pektyn, chutneye, owoce w alkoholu (rumtopf).
5. **Przetwory w tłuszczu i mięsne:** francuskie confit i rillettes, suszone pomidory w oliwie (ze ścisłym reżimem zakwaszania przeciwbotulinowego!), smalec ze skwarkami w słoju, salo.
6. **Inżynieria termiczna:** kalkulator pasteryzacji (woda, piekarnik, sous-vide, tyndalizacja frakcjonowana 3x24h, sterylizacja ciśnieniowa) obliczający realną penetrację ciepła do zimnego punktu słoika ($F_0$ i $P_0$).

Aplikacja działa w **100% Offline-First, bez rejestracji, bez zbierania danych osobowych, bez serwera i bez reklam**, w 35 językach. Zgodnie z etosem Apps4Brew oferuje darmowy rdzeń narzędziowy z opcją zakupu dożywotniego (14,99 € / 59,99 zł) lub taniej subskrypcji (0,99 € miesięcznie / 3,99 zł).

### **Dla kogo (Persony główne)**
* **Tomek (34 lata, inżynier oprogramowania i pasjonat fermentacji):** robi własne ostre sosy z papryk habanero i jalapeño, eksperymentuje z kimchi i shio-koji. Potrzebuje precyzyjnego kalkulatora stężenia solanki masowo do całkowitej wagi naczynia (nie daje się nabrać na błąd „3% w wodzie”), osi czasu fermentacji z powiadomieniami o odgazowaniu („odbiciu” słoika / burping) na Apple Watch.
* **Pani Stanisława „Babcia Stasia” (67 lat, emerytowana nauczycielka):** od 40 lat robi setki słoików ogórków kiszonych, powideł śliwkowych i grzybów marynowanych dla całej rodziny. Potrzebuje dużego, czytelnego interfejsu (Dynamic Type, prosty język), asystenta proporcji octu i cukru, generatora etykiet do druku na słoiki z datą i rokiem oraz kalkulatora czasu gotowania słoików w garze.
* **Claire (28 lat, graficzka z Lyonu, styl życia zero-waste i weganizm):** nastawia kombuchę w słojach 5L, kisi resztki warzyw korzeniowych, robi rzepę po bliskowschodzku (torshi left). Potrzebuje monitora nasycenia $CO_2$ w butelkach F2, notatek sensorycznych i bazy bezpieczeństwa mikrobiologicznego.
* **Marek (45 lat, myśliwy i wędkarz z Mazur):** zamyka w słojach mięso z dzika, pasztety i ryby w zalewie octowej i pomidorowej. Śmiertelnie boi się jadu kiełbasianego (*Clostridium botulinum*). Wymaga bezwzględnie rygorystycznego kalkulatora tyndalizacji (trzykrotnego gotowania 3x w odstępach 24h) lub procedur szybkowaru ciśnieniowego (Pressure Canning) zgodnych z wytycznymi USDA.
* **Ewa (36 lat, osoba niewidoma, entuzjastka gotowania):** kisi ogórki i kapustę z wagą mówiącą. Potrzebuje bezbłędnej obsługi VoiceOver, precyzyjnych sygnałów dźwiękowych i wibracyjnych podczas odliczania pasteryzacji oraz bezwzględnie logicznej hierarchii nagłówków.

### **Czym wygrywa aplikacja (Przewagi rynkowe poparte dowodami)**
1. **Prawdziwa matematyka i chemia przetwórstwa zamiast „przepisów z bloga”:** Blogi kulinarne masowo podają błędne proporcje (np. „łyżka soli na słoik” albo „solanka 3%”, która po zalaniu ogórków rozcieńcza się do 1,4% i powoduje gnicie nastawu). Aplikacja implementuje laboratoryjną fizykochemię: rozróżnienie stężenia w samej wodzie vs stężenia w całkowitej masie nastawu ($M_{woda} + M_{warzywa}$), buforowanie kwasowości i korektę gęstości cukru ($^\circ\text{Bx}$).
2. **Bezpieczeństwo biologiczne USDA/FDA jako twardy fundament:** Jako jedyna aplikacja na rynku wbudowuje strażnika botulinowego: jeśli użytkownik tworzy przetwór o niskiej kwasowości ($pH \ge 4.6$) w warunkach beztlenowych (np. czosnek w oliwie, mięso, fasolka szparagowa) bez sterylizacji ciśnieniowej lub tyndalizacji, aplikacja wyświetla czerwony alert bezpieczeństwa i blokuje procedurę zwykłego wekowania.
3. **Kuchenne Hands-Free (Apple Watch + Live Activity + Duże kafle):** W trakcie pracy w kuchni ręce użytkownika są lepkie od syropu, mokre od solanki lub pokryte sokiem z kapusty. Aplikacja wspiera sterowanie gestami na Apple Watch, duże pola dotykowe $\ge 64\times 64\,\text{pt}$, odliczanie pasteryzacji w Live Activity na Dynamic Island i głosowe odznaczanie kroków przez Siri.
4. **Inteligentna Spiżarnia i Etykiety QR:** Koniec z niezidentyfikowanymi słoikami z 2019 roku w piwnicy. Aplikacja generuje wektorowe etykiety do druku (lub kody QR), które po zeskanowaniu aparatem natychmiast otwierają kartę danej partii: data nastawu, stężenie soli, czas pasteryzacji, ocena sensoryczna i sugerowany termin spożycia.
5. **Wszystkie tradycje świata w jednym kompasie kulturowym:** Łączy polską tradycję kiszenia i wekowania z fermentacjami azjatyckimi (kimchi, tsukemono, koji, nukazuke), bliskowschodnimi (torshi, makdous), śródziemnomorskimi (confit, escabeche) i indyjskimi (achar).

---

## **3. Liczby dokumentu**

| Element | Liczba | Podział |
| :--- | :--- | :--- |
| **Wymagania funkcjonalne BR** | **315** | B (Narzędzia) 225: Solanki 32, Monitor fermentacji 38, Pasteryzacja 35, Spiżarnia i Batche 36, Naczynia/Słoiki 24, Refraktometria/pH 20, Apple Watch/Hands-Free 22, Diagnostyk 18. C (Nauka) 90: Atlas kultur 25, Szkoła przetwórstwa 35, Interaktywne trenażery 30. |
| **Priorytety BR** | MUST 152 · SHOULD 108 · COULD 55 | W wariancie MVP (164 BR): MUST 134 · SHOULD 28 · COULD 2. |
| **Wymagania niefunkcjonalne NFR** | **115** | OFF 10 · I18N 12 · DOST 15 · WYG 8 · WYD 12 · DANE 14 · BEZP 18 · ZEG 12 · TEST 14. |
| **Reguły dziedzinowe RD** | **55** | RD-01…RD-16 (Solanki i chemia wody), RD-17…RD-32 (Kinetyka pH i bariera botulinowa), RD-33…RD-55 (Termodynamika pasteryzacji, F0/P0, pektyny, Brix). |
| **Rejestr ryzyk RYZ** | **60** | Ryzyka sanitarne (botulizm, pleśnie, pęknięcia szkła), prawne (wyłączenia odpowiedzialności), techniczne (migracje SQLite, watchOS background). |
| **Decyzje dla właściciela DEC** | **60** | DEC-01…DEC-60 podzielone na 4 bloki wdrożeniowe. |
| **Decyzje badacza merytorycznego D** | **25** | D-01…D-25 (normy mikrobiologiczne, progi pH, stężenia octu, czasy tyndalizacji). |
| **Tabela zakresu Z** | **220** wierszy | MVP 112 · 1.1 48 · 1.2 36 · 2.x 18 · badanie 6. |

---

## **4. Warianty pierwszej wersji (MVP) — Rekomendacja analityka**

| Wymiar | (a) Pełne MVP z BRD | (b+) MVP Okrojone (Rekomendacja) | (b) Ścisłe MUST | (d) Samo narzędzie kalkulatora |
| :--- | :--- | :--- | :--- | :--- |
| **Zakres BR** | **164 BR** (B 128 + C 36) | **134 BR** (126 MUST + 8 wyjątków UX) | **126 BR** (tylko MUST) | ok. 85 BR (narzędzia bez modułu nauki) |
| **Zawartość** | Wszystkie kalkulatory solanek, monitor nastawów, pasteryzacja z timerem, baza 50 typów słoików, Apple Watch, Live Activity, moduł nauki, 150 przepisów bazowych z całego świata, generator etykiet PDF, diagnostyk problemów. | Jak (a), ale baza słoików ograniczona do 25 najpopularniejszych typów (Weck, Twist-Off, Mason, Kamionka), moduł nauki ograniczony do 12 kluczowych kart bezpieczeństwa i mikrobiologii, generowanie etykiet jako proste grafiki PNG do udostępnienia zamiast złożonego generatora PDF z kodami QR. | Tylko rdzeń: kalkulator solanki, stoper pasteryzacji, lista aktywnych nastawów, alarm pH 4.6. Bez zegarka, bez etykiet, bez diagnostyka. | Tylko czysty kalkulator bez bazy partii i bez modułu edukacyjnego. |
| **Ryzyko Apple 4.3(a)/(b)** | Bardzo niskie. | Niskie. | Średnie (zarzut prostego kalkulatora). | **Wysokie** (odrzucenie za brak unikalnej wartości). |
| **Szacowany nakład agenta** | 35–48 dni roboczych | **28–38 dni roboczych** | 24–32 dni roboczych | 15–22 dni roboczych |
| **Kalendarz wdrożenia** | 4–5 tygodni | **3–4 tygodnie** | 2–3 tygodnie | 2 tygodnie |

""")

print("00 START written successfully.")
