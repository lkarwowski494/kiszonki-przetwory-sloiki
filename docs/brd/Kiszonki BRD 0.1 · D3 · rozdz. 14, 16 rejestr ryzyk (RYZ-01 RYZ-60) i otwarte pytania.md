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

