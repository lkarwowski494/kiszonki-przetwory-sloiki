# Kiszonki, przetwory, słoiki (Słoik / Jarwise) 🫙🥒🍅

[![Platform](https://img.shields.io/badge/Platform-iOS%2018%2B%20%7C%20watchOS%2011%2B-blue.svg)](https://apple.com)
[![Architecture](https://img.shields.io/badge/Architecture-100%25%20Offline--First%20SQLite%20WAL-success.svg)](#architektura)
[![Privacy](https://img.shields.io/badge/Privacy-Data%20Not%20Collected%20(Zero%20SDKs)-brightgreen.svg)](#prywatno%C5%9B%C4%87)
[![Cost](https://img.shields.io/badge/Stack%20Cost-0%20PLN%20outside%20Apple%20Fee-orange.svg)](#standardy-apps4brew)
[![BRD Depth](https://img.shields.io/badge/BRD%20Volume-99.14%20Pages%20%7C%20178k%20Chars-purple.svg)](docs/brd/)

> Kompleksowy system przetwórstwa, fermentacji i pasteryzacji domowej z całego świata. Aplikacja mobilna i asystent kuchenny w ekosystemie Apple, stworzony według rygorystycznych standardów inżynieryjnych **Apps4Brew** (na wzór projektów *Napar*, *Piekarz*, *Oczko* i *Trening*).

---

## 📖 Spis treści
1. [Wizja i tożsamość produktu](#-wizja-i-to%C5%BCsamo%C5%9B%C4%87-produktu)
2. [Osiem filarów narzędziowych (Kalkulatory i Moduły)](#-osiem-filar%C3%B3w-narz%C4%99dziowych)
3. [Rygor mikrobiologiczny i bezpieczeństwo żywności](#-rygor-mikrobiologiczny-i-bezpiecze%C5%84stwo-%C5%BCywno%C5%9Bci)
4. [Architektura techniczna i Hands-Free Kitchen](#-architektura-techniczna-i-hands-free-kitchen)
5. [Struktura dokumentacji BRD (Business Requirements Document)](#-struktura-dokumentacji-brd)
6. [Statystyki i metryki BRD](#-statystyki-i-metryki-brd)
7. [Standardy Apps4Brew i 9 Warstw Jakości](#-standardy-apps4brew-i-9-warstw-jako%C5%9Bci)
8. [Uruchamianie i weryfikacja](#-uruchamianie-i-weryfikacja)

---

## 🎯 Wizja i tożsamość produktu

Przetwórstwo domowe to nie tylko hobby kulinarne — to **precyzyjna biotechnologia kuchenna**, w której spotykają się osmoza, kinetyka wymierania drobnoustrojów chorobotwórczych, ekologia mikrobiologiczna oraz dziedzictwo kulinarne 11 tradycji świata.

Większość domowych przetworów cierpi na:
* **Błąd rozcieńczenia solanki:** Wsypanie soli liczonej od wody (np. 3%) do słoika pełnego ogórków (zawierających 95% wody wolnej) powoduje spadek stężenia w układzie do poniżej 1.3%, wywołując mięknięcie pektyn i gnicie.
* **Ryzyko botulizmu (*Clostridium botulinum*):** Błędne przekonanie, że gotowanie warzyw w wodzie o $pH \ge 4.60$ zabija przetrwalniki jadu kiełbasianego.
* **Nieoptymalna pasteryzacja:** Przegotowywanie owoców i dżemów niszczące witaminy i aromat lub niedogotowanie skutkujące fermentacją drożdżową.
* **Brak kontroli nad spiżarnią:** Zapomniane słoiki w piwnicy tracące przydatność po 2 latach.

Aplikacja **Słoik / Jarwise** łączy naukowe modele biochemiczne z ergonomią asystenta kuchennego, który prowadzi użytkownika krok po kroku od kalkulacji surowców, przez fazy fermentacji, aż po etykiety z kodami QR i ubywanie zapasów w domowej spiżarni.

---

## 🧮 Osiem filarów narzędziowych

Aplikacja zawiera 8 wyspecjalizowanych modułów obliczeniowych i asystenckich (225 sformalizowanych wymagań funkcjonalnych `BR-SOL` do `BR-DOK`):

| Narzędzie | Kod | Zakres odpowiedzialności |
|---|---|---|
| **Kalkulator Solanek** | `SOL` | Precyzyjne dozowanie soli morskiej/kamiennej w masie całkowitej ($M_{\text{układ}} = M_{\text{surowiec}} + M_{\text{woda}}$). Przeliczanie gęstości solanki, solenia na sucho (*dry salting*), solanek zrównoważonych (*equilibrium brine*), twardości wody i dodatku chlorku wapnia ($CaCl_2$) dla chrupkości. |
| **Monitor Fermentacji** | `FERM` | Śledzenie faz kinetycznych (faza adaptacyjna LAG, fermentacja burzliwa LOG z *Leuconostoc mesenteroides*, stabilizacja stacjonarna ze szczepami *Lactobacillus plantarum*). Harmonogram odgazowywania słoików (*burping*), adaptacyjne powiadomienia sensoryczne. |
| **Kalkulator Pasteryzacji** | `PAST` | Modele letalności termicznej w 4 metodach: kąpiel wodna, piekarnik, sous-vide oraz trzykrotna tyndalizacja. Obliczanie wartości pasteryzacyjnej $P_0$ (dla przetworów kwaśnych) oraz sterylizacyjnej $F_0$ z uwzględnieniem penetracji ciepła i objętości słoika. |
| **Zarządzanie Spiżarnią** | `SPIN` | Rejestr partii (*Batch Tracker*), lokalizacje (piwnica, szafka, lodówka), status dojrzałości, generowanie etykiet kuchennych w formacie PDF z kodami QR, inteligentny mechanizm ubywania zapasów i powiadomienia o terminach spożycia. |
| **Baza Naczyń i Headspace** | `NACZ` | Geometria i objętość naczyń: Weck (z gumką i klipsami), Twist-Off, Mason Jars, kamionki, rurki fermentacyjne. Obliczanie wymaganej przestrzeni nagłownej (*headspace*) zależnie od temperatury i wydzielania gazu ($CO_2$). |
| **Refraktometria i Kwasowość** | `BRIX` | Pomiary cukru refractometrem w skali Brix, obliczanie kwasowości miareczkowej (TA), korekta współczynnika załamania światła pod wpływem temperatury i alkoholu, bilans cukier-pektyna-kwas dla dżemów i galaretek. |
| **Asystent Hands-Free** | `ZEG` | Aplikacja na Apple Watch z cyfrową koronką (Digital Crown) do przewijania przepisów i odmierzania czasów. Dynamiczna wyspa (Dynamic Island) oraz Live Activities na ekranie blokady iOS z bieżącym statusem pasteryzacji i degazacji. Skróty Siri Intent. |
| **Diagnostyk Problemów** | `DOK` | Interaktywny algorytm drzewa decyzyjnego dla niepowodzeń: pleśń mykotoksynowa vs kożuch fermentacyjny (*Kahm yeast*), ciemnienie czosnku na niebiesko/zielono (reakcja enzymów siarkowych z miedzią), zmiękczenie tkanek warzyw, śluzowatość zalewy (*dextran*). |

---

## 🔬 Rygor mikrobiologiczny i bezpieczeństwo żywności

Wszystkie procedury zaimplementowane w aplikacji podlegają ścisłym regułom dziedzinowym opartym o literaturę akademicką i oficjalne przewodniki USDA (*Agriculture Information Bulletin No. 539*):

### 1. Wzór na całkowite zasolenie układu (RD-01)
Aby osiągnąć docelowe stężenie soli $p$ [%] w gotowym słoiku przy wadze warzyw $M_{\text{surowiec}}$ i wadze wody $M_{\text{woda}}$:
$$M_{\text{sól}} = \frac{p}{100 - p} \cdot (M_{\text{surowiec}} + M_{\text{woda}})$$

### 2. Krytyczna bariera botulinowa (RD-17, D-01)
$$pH_{\text{krytyczne}} = 4.60 \quad (\text{w aplikacji: bufor bezpieczeństwa } pH \le 4.20)$$
Przetwory o $pH \ge 4.60$ (niska kwasowość: warzywa w zalewie bez octu, czosnek w oliwie, mięso, ryby, fasola szparagowa) stanowią środowisko sprzyjające namnażaniu *Clostridium botulinum* i wytwarzaniu śmiertelnej neurotoksyny botulinowej. Aplikacja:
* **Blokuje** sugerowanie zwykłej pasteryzacji wodnej dla takich produktów.
* **Wymaga** sterylizacji ciśnieniowej ($121.1^\circ\text{C}$ / 15 PSI, minimalna letalność $F_0 \ge 3.0$) lub trzykrotnej tyndalizacji w odstępach 24h.

### 3. Wartość pasteryzacyjna i letalność termiczna (RD-33, RD-34)
Dla kwasowych przetworów owocowych ($pH < 4.0$) aplikacja całkuje skumulowaną wartość $P_0$ (temperatura odniesienia $T_{\text{ref}} = 80^\circ\text{C}$, współczynnik odporności termicznej $z = 10^\circ\text{C}$):
$$P_0 = \int_0^t 10^{\frac{T(\tau) - 80}{10}} d\tau$$

---

## 📱 Architektura techniczna i Hands-Free Kitchen

### Standard Inżynieryjny:
* **Środowisko:** React Native (Expo SDK 52+) z modułami natywnymi Swift dla iOS 18+ i watchOS 11+.
* **Baza danych:** 100% lokalny SQLite zarządzany w transakcyjnym trybie WAL (`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;`).
* **Zarządzanie stanem:** Lokalny store oparty o niezmienniki domenowe, pełna spójność asynchroniczna.
* **Kuchenne Hands-Free:**
  - Siri Shortcuts & App Intents: *"Hej Siri, ile soli na 2 kg ogórków?"*, *"Hej Siri, sprawdź pasteryzację"*.
  - Apple Watch Standalone App: Obsługa w trakcie prac kuchennych (mokre ręce, rękawice kuchenne) przy użyciu Digital Crown i haptyki Taptic Engine.
  - Live Activities: Monitorowanie gotowania i studzenia słoików w czasie rzeczywistym na Dynamicznej Wyspie.

---

## 📚 Struktura dokumentacji BRD

Kompletna specyfikacja wymagań biznesowych, architektonicznych i merytorycznych znajduje się w katalogu [`docs/brd/`](docs/brd/) (oraz lustrzanym [`kiszonki_brd/`](kiszonki_brd/)) w 26 modułach:

```
kiszonki_brd/
├── Kiszonki BRD 0.1 – 00 START – streszczenie, warianty MVP, spis treści.md
├── Kiszonki BRD 0.1 – 00b Jedna lista decyzji i pytań (DEC-01 DEC-60).md
├── Kiszonki BRD 0.1 – 00c Sprzeczności i errata (mikrobiologia, bezpieczeństwo USDA, botulinum).md
├── Kiszonki BRD 0.1 – A1 – rozdz. 1–3 (Tożsamość, Persony, Architektura).md
├── Kiszonki BRD 0.1 – A2 – rozdz. 4–6.1 (Rynek, Model przychodu, Zakres).md
├── Kiszonki BRD 0.1 – A3a – rozdz. 6.2 tabela zakresu cz. 1 (Kalkulatory, Solanki, Kwasowość).md
├── Kiszonki BRD 0.1 – A3b – rozdz. 6.2 tabela zakresu cz. 2 (Pasteryzacja, Magazyn, Spiżarnia).md
├── Kiszonki BRD 0.1 – A3c – rozdz. 6.3–6.5 (Etapy, Nakład pracy, Warianty).md
├── Kiszonki BRD 0.1 – A4 – rozdz. 13, 15 (KPI bez śledzenia, Marketing, ASO).md
├── Kiszonki BRD 0.1 – B1 – rozdz. 7 narzędzia - Kalkulatory solanek i rozkładu soli.md
├── Kiszonki BRD 0.1 – B2 – rozdz. 7 narzędzia - Monitor fermentacji i powiadomienia sensoryczne.md
├── Kiszonki BRD 0.1 – B3 – rozdz. 7 narzędzia - Kalkulator pasteryzacji (P0, F0, tyndalizacja).md
├── Kiszonki BRD 0.1 – B4 – rozdz. 7 narzędzia - Spiżarnia, Batch Tracker i etykiety QR.md
├── Kiszonki BRD 0.1 – B5 – rozdz. 7 narzędzia - Baza naczyń, słoików i kontrola headspace.md
├── Kiszonki BRD 0.1 – B6 – rozdz. 7 narzędzia - Refraktometria Brix, pH-metria i kwasowość TA.md
├── Kiszonki BRD 0.1 – B7 – rozdz. 7 narzędzia - Asystent Apple Watch, Live Activity i Siri.md
├── Kiszonki BRD 0.1 – B8 – rozdz. 7 narzędzia - Diagnostyk problemów przetwórstwa (Troubleshooting).md
├── Kiszonki BRD 0.1 – C1 – rozdz. 7 nauka - Szkoła Przetwórstwa, atlas kultur bakteryjnych.md
├── Kiszonki BRD 0.1 – C2 – rozdz. 8 reguły dziedzinowe - RD-01 do RD-16 (matematyka solanek).md
├── Kiszonki BRD 0.1 – C3 – rozdz. 8 reguły dziedzinowe - RD-17 do RD-32 (bariera botulinowa, pH).md
├── Kiszonki BRD 0.1 – C4 – rozdz. 8.P proces treści merytorycznych i decyzje badacza D1 do D25.md
├── Kiszonki BRD 0.1 – C5 – rozdz. 8 reguły dziedzinowe - RD-33 do RD-55 (kinetyka termiczna).md
├── Kiszonki BRD 0.1 – D1 – rozdz. 9-10 wymagania niefunkcjonalne (NFR) i zgodność z Apple.md
├── Kiszonki BRD 0.1 – D2 – rozdz. 11-12 architektura, relacyjny model danych SQLite i DDL.md
├── Kiszonki BRD 0.1 – D3 – rozdz. 14, 16 rejestr ryzyk (RYZ-01 RYZ-60) i otwarte pytania.md
└── Kiszonki BRD 0.1 – D4 – rozdz. 17 wielowarstwowa strategia testów (9 warstw jakości).md
```

---

## 📊 Statystyki i metryki BRD

Dokumentacja spełnia najwyższe rygory objętościowe i analityczne, dorównując i przewyższając dokumentację referencyjną projektu *Oczko*:

| Metryka | Wartość |
|---|---|
| **Liczba modułów dokumentacji** | 26 plików Markdown |
| **Łączna liczba znaków ze spacjami** | **178 451 znaków** |
| **Liczba słów** | **23 130 słów** |
| **Liczba linii tekstu** | **2 061 linii** |
| **Objętość w znormalizowanych stronach (1800 zn./str.)** | **99.14 stron** |
| **Liczba decyzji architektonicznych i produktowych** | 60 pozycji (`DEC-01` do `DEC-60`) |
| **Liczba sformalizowanych ryzyk projektowych** | 60 pozycji (`RYZ-01` do `RYZ-60`) |
| **Liczba reguł dziedzinowych i formuł biochemicznych** | 55 reguł (`RD-01` do `RD-55`) |
| **Liczba decyzji badacza merytorycznego** | 25 pozycji (`D-01` do `D-25`) |
| **Liczba wymagań funkcjonalnych** | 225 wymagań (`BR-SOL` do `BR-DOK`) |
| **Liczba wymagań niefunkcjonalnych** | 115 wymagań (`NFR-001` do `NFR-115`) |
| **Liczba zbadanych tradycji kulinarnych świata** | 11 kultur (Europa Środkowa, Azja Wschodnia, Bliski Wschód, Ameryka Łacińska itd.) |

---

## 🛡️ Standardy Apps4Brew i 9 Warstw Jakości

Zgodnie z filozofią Apps4Brew, kod produkcyjny jest chroniony przez 9 warstw testów automatycznych:
1. **Domenowe Unit Testy:** 100% pokrycia dla matematyki solanek, kinetyki kwasowej, indeksu letalności pasteryzacji $P_0 / F_0$.
2. **Macierz Krawędziowa:** Skrajne temperatury, brak wody, niestandardowe pojemności słoików (od 40 ml do 10 l).
3. **Integralność SQLite:** Testy kluczy obcych (`ON DELETE CASCADE`), blokady transakcyjne, sprawdzanie integralności przy starcie (`PRAGMA integrity_check`).
4. **Regresja i Zepsucie Danych:** Symulacja nagłego ubicia procesu w trakcie zapisu partii słoików, weryfikacja recovery z pliku WAL.
5. **Migracje Danych:** Automatyczne testy migracji struktury bazy danych ze starszych wersji schematu.
6. **Snapshoty i Lokalizacja:** Pełne testy i18n (język polski i angielski), brak uciętych tekstów w widokach Dynamic Type.
7. **Integracja Komponentów:** Testy stanu magazynowego spiżarni, licznika ubywania słoików.
8. **E2E Maestro na iOS:** Pełne scenariusze kuchenne uruchamiane automatycznie w GitHub Actions.
9. **Audyt Bezpieczeństwa Biologicznego:** Blokady algorytmiczne uniemożliwiające zasugerowanie niebezpiecznych parametrów pasteryzacji.

---

## 🛠️ Uruchamianie i weryfikacja

### Wymagania:
* Node.js 20+ LTS
* Python 3.10+ (dla skryptów walidacyjnych i sprawdzania metryk)
* GitHub CLI (`gh`)

### Sprawdzenie metryk dokumentacji BRD:
```bash
python scripts/count_stats.py
```

### Weryfikacja spójności plików BRD:
```bash
python scripts/compile_brd.py --verify
```

---

## 📄 Licencja

Projekt jest rozwijany na licencji otwartoźródłowej (Public Repository) w ramach portfolio Apps4Brew. Wszelkie prawa do znaków towarowych i tożsamości marek należą do właściciela projektu.
