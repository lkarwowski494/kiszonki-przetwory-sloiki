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
- **Otwarte pytania produktowe** (rozstrzyga właściciel):
  - czy atlas ma być w katalogu `site/` tego repozytorium, czy na osobnej domenie;
  - ile języków na start.
- **Treść merytoryczna atlasu** musi przejść ten sam proces co treść aplikacji (BRD C4, rozdz. 8.P: proces treści merytorycznych).
