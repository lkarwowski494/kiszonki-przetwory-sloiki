# 26. Decyzja: miejsce Słoika w kolejce portfela (01.11.2026)

Identyfikator na tablicy decyzji: `2026-11-01-kolejka-wydan` (wersja 4). Decyzję podjął właściciel.

## Decyzja

1. **Słoik rozwijamy równolegle** z dwoma innymi strumieniami: Trening 1.1 + atlas ćwiczeń oraz Oczko. Razem trzy strumienie naraz.
2. **Najpierw atlas kiszonek i fermentacji** (strona internetowa), potem kolejne funkcje aplikacji.
3. **Bezpieczeństwo żywności:**
   - każda instrukcja w atlasie i w aplikacji ma przeczytane źródło;
   - kiszenie (laktofermentacja) i wekowanie/pasteryzacja są w osobnych działach i nie mieszają się w jednej instrukcji. Powód: ryzyko jadu kiełbasianego (*Clostridium botulinum*) — patrz errata 00c i reguły RD-17…RD-32 w `docs/brd/`.

## Dlaczego atlas jako pierwszy

Pomiar odsłon Wikipedii, 01.11.2026, w 17 językach. Skala jest względna: atlas ćwiczeń = 1,00. Szczegóły w repozytorium `portfel-aplikacji`: `ATLASY.md` (sekcja „Dopomiar 01.11.2026”), dane w `dane/atlasy_wikipedia2.json` i `dane/atlasy_odslony_surowe2.csv`.

| Obszar | Popyt techniczny | Wyświetlenia/mies.: pesymistycznie / normalnie / optymistycznie | Reklamy na stronie, USD/rok (scenariusz normalny) | Instalacje z atlasu/rok (scenariusz normalny) |
|---|---:|---|---:|---:|
| Kiszonki i fermentacja | **2,44** | 21 960 / **219 600** / 1 122 400 | 5 270 | 7 906 |
| Przetwory i konserwowanie | 0,28 | 2 520 / 25 200 / 128 800 | 605 | 907 |

- Kiszonki mają najwyższy popyt spośród 58 zmierzonych obszarów.
- SEO potrzebuje 6–12 miesięcy, zanim strona zacznie dawać ruch, więc im wcześniej atlas wystartuje, tym lepiej.
- Słoik nie jest powiązany z postanowieniami noworocznymi, więc nie musi zdążyć przed grudniem (w odróżnieniu od Treningu i Oczka).

**Zastrzeżenie.** Liczby wyświetleń, przychodu i instalacji to szacunek, nie pomiar. Wynikają z założeń: 2 USD za 1000 wyświetleń oraz 0,3% odwiedzających instaluje aplikację.

## Konsekwencje dla tego repozytorium

- **Reklamy tylko na stronie atlasu, nigdy w aplikacji.** Zakaz reklam z `CLAUDE.md` (pkt 1, „Zero telemetrii”) nadal obowiązuje w aplikacji.
- Otwarte pytania o domenę i języki rozstrzygnięte 01.11.2026 — sekcja niżej.
- **Treść merytoryczna atlasu** musi przejść ten sam proces co treść aplikacji (BRD C4, rozdz. 8.P: proces treści merytorycznych).

## Uzupełnienie 01.11.2026: domena, języki, struktura

Identyfikator na tablicy decyzji: `2026-11-01-sloik-atlas-domena-jezyki`.

**Decyzja właściciela**
- Atlas na **osobnej domenie** (opcja B), tak jak atlas ćwiczeń. Odrzucona opcja: katalog `site/` w tym repozytorium.
- Docelowo **35 języków**.
- **Struktura gotowa od pierwszego dnia**, a karty atlasu wdrażamy falami (grupami języków lub typów).

**Wymagania struktury.** Źródło: dokumentacja Google Search Central, przeczytana 01.11.2026:
[localized-versions](https://developers.google.com/search/docs/specialty/international/localized-versions),
[managing-multi-regional-sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites).

1. **Adresy**
   - Każdy język ma osobny adres w podkatalogu, np. `/pl/`, `/en/`.
   - Parametr `?lang=` odpada: Google pisze o nim „Not recommended”.
   - Treść nie może zależeć od ciasteczek ani ustawień przeglądarki.
2. **Stały identyfikator karty**, niezależny od języka. Dzięki temu dodanie języka nie zmienia istniejących adresów.
3. **hreflang dwukierunkowy**
   - Google: „Each language version must list itself as well as all other language versions”.
   - Google: „If two pages don't both point to each other, the tags will be ignored”.
   - Google: „you can omit some languages on some pages” — to pozwala wdrażać karty falami. hreflang generuje się wtedy tylko z wersji, które istnieją.
4. **x-default** prowadzi do strony wyboru języka.
5. **Bez automatycznego przekierowania według języka.** Google: „Avoid automatically redirecting users from one language version of a site to a different language version”.
6. **Mapa strony** generowana z listy opublikowanych kart.
7. **Zasada własna:** publikujemy tylko gotowe karty ze źródłami, bez pustych stron-zaślepek. Wynika to z zasady „merytoryczne podstawy” (każda instrukcja ma przeczytane źródło).

**Kolejność fal: wybrana opcja C (decyzja właściciela 01.11.2026)**

Udział odsłon kiszonek według języka z pomiaru 01.11.2026, dla 17 języków i wszystkich haseł:

| Język | en | fr | es | de | it | pl | ja | nl | ru | pt |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Udział odsłon | 43,5% | 11,0% | 8,0% | 7,5% | 7,3% | 3,4% | 3,4% | 3,3% | 2,8% | 2,4% |

Każdy z pozostałych zmierzonych języków ma poniżej 2%. Pierwsze 5 języków to 77%, pierwsze 10 to 93%. Pozostałych 18 z 35 języków nie mierzyliśmy.

| Opcja | Opis | Kompromis |
|---|---|---|
| A | Najpierw języki: wszystkie typy kart w 5–6 językach | Pełny atlas tam, gdzie jest ruch; pozostałe języki dochodzą późno |
| B | Najpierw typy: jedna grupa kart w 35 językach | Szeroka obecność od razu, ale płytko; 35 tłumaczeń do sprawdzenia przy każdej grupie |
| **C (wybrana)** | Hybryda: grupa podstawowa (kapusta, ogórki; ok. 10–15 kart [DO SPRAWDZENIA]) w en, fr, es, de, it, pl, potem na zmianę kolejne grupy i języki | **Rekomendacja.** Ok. 80% zmierzonego ruchu od pierwszej fali przy małym zakresie treści |

Fala 1: grupa podstawowa (kapusta, ogórki) w en, fr, es, de, it, pl. Następne fale na zmianę dodają grupy kart i języki. Odrzucone: A, B.

**Lista 35 języków** (przejęta z repozytorium `trening`, katalog `locales/`, commit `2e4b0f8`, odczyt 01.11.2026; ta sama w całym portfelu):

`bg cs da de el en es es-419 et fi fr hr hu id it ja ko lt lv ms nb nl pl pt pt-BR ro ru sk sl sr sv tr uk vi zh-Hant`

Uwagi do struktury strony:
- Kody `es-419`, `pt-BR`, `zh-Hant` to warianty regionalne i pisma. Każdy z nich dostaje osobny podkatalog i osobny wpis hreflang.
- Na liście nie ma chińskiego uproszczonego (`zh-Hans`). Pomiar Wikipedii `zh` obejmuje oba pisma, więc udział `zh` (1,7%) nie przekłada się wprost na `zh-Hant`.
- Fala 1 używa `es` (Hiszpania). `es-419` i `pt-BR` dochodzą w kolejnych falach.

**Uwaga o popycie (odczyt surowych danych, angielskie hasła):**

| Hasło | Udział w popycie kiszonek |
|---|---:|
| Kombucha | 25,9% |
| Kefir | 20,9% |
| Kimchi | 16,3% |
| Pickled cucumber | 12,6% |
| Sauerkraut | 11,5% |
| Brine | 5,9% |
| Pickling | 4,6% |

Kapusta i ogórki to razem ok. 24%. Skład grupy podstawowej jest więc otwarty i czeka na research źródeł oraz decyzję właściciela.

**Skład fali 1: wybrana opcja C (decyzja właściciela 01.11.2026; rekomendacja była B)**

Karty tematyczne:
- kapusta kiszona;
- ogórki według NCHFP;
- kimchi;
- kombucha;
- kefir mleczny.

Karty ogólne:
- solanka;
- kiszenie a wekowanie i jad kiełbasiany;
- kożuch, pleśń i zepsucie;
- naczynia;
- przechowywanie;
- problemy z ogórkami.

Razem ok. 87% popytu według angielskich haseł. Odrzucone opcje:
- A: kapusta i ogórki, ok. 24%;
- B: bez kefiru, ok. 66%.

Warunek merytoryczny:
- Karta kefiru zawiera tylko treści z przeczytanym źródłem (Codex 243, CDC/FDA o surowym mleku, USU).
- Pełna instrukcja domowa z ziaren pojawi się dopiero po znalezieniu przetestowanego źródła.

Research: [`research/27-atlas-fala1-zrodla.md`](research/27-atlas-fala1-zrodla.md).

**BRD do przebudowy (decyzja właściciela 01.11.2026).** BRD 0.1 powstało na słabszym modelu, a raport 27 wykazał sprzeczności ze źródłami. Do czasu przebudowy BRD nie jest źródłem wartości liczbowych ani instrukcji.
