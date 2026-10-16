# Kiszonki BRD 0.1 — Rozdział 7.9: Laboratorium Eksperymentów Wielowariantowych i Panel Sensoryczny (Multi-Jar Split-Batch Lab & Sensory Showdown)

---

## 1. Koncepcja i Uzasadnienie Biznesowe (Problem & Solution)

### 1.1. Problem Domowego Przetwórcy
Domowe przetwórstwo cierpi na syndrom **„ulotnej pamięci piwnicznej”**:
1. Pasjonat nastawia w lipcu 10 słoików ogórków, do części dając więcej chrzanu, do części liście dębu, do jednego szczyptę chili, a do innego 2.0% zamiast 2.5% soli.
2. W listopadzie otwiera słoik, który okazuje się absolutnym kulinarnym arcydziełem (perfekcyjny trzask, idealna kwasowość, głęboki aromat).
3. **Pytanie bez odpowiedzi:** *Który to był słoik? Ile dokładnie gramów soli i czosnku tam trafiło? Jaka to była woda?*
4. W efekcie za rok przetwórca zaczyna od zera, powtarzając błędy i nie potrafiąc ustabilizować swojego idealnego smaku.

### 1.2. Rozwiązanie Apps4Brew: Multi-Jar Split-Batch Lab
Funkcja **Laboratorium Eksperymentów (F-07)** wprowadza metodologię naukową i laboratoryjną precyzję pod strzechy:
- Pozwala podzielić jeden zbiór/nastaw surowca (np. 5 kg ogórków czy 3 główki kapusty) na serię **$N$ słoików ($N \ge 2$, do 8 słoików w serii)** z precyzyjnie zdefiniowaną macierzą różnic (*delta variables*).
- Każdy słoik w serii otrzymuje natychmiast własny, unikalny kod paszportu partii (`sloik://exp/<seriesId>/<variantLetter>`), wydrukowany na etykiecie QR.
- W dowolnym momencie po 2 tygodniach, 3 miesiącach lub roku użytkownik kieruje aparat telefonu na słoik i widzi dokładną specyfikację laboratoryjną: gramatury z dokładnością do 0.1 g, stężenie solanki i technologię.
- Po dojrzeniu nastawu użytkownik uruchamia **Panel Ślepej Degustacji (Sensory Cupping Mode)**, porównuje warianty obok siebie, wyłania zwycięzcę i jednym dotknięciem **awansuje go do stałego Przepisu Mistrzowskiego** z możliwością skalowania na dowolną masę surowca w kolejnych latach!

---

## 2. Architektura Osi Badawczych (Experimental Dimensions)

Aplikacja udostępnia 5 predefiniowanych matryc eksperymentalnych oraz tryb pełnej dowolności (*Freeform Lab*):

| Oś Badawcza | Kontrolowana Baza | Zmienna Testowa (Delta) | Typowe Warianty ($N=3$ do $5$) |
|---|---|---|---|
| **Oś Chrupkości i Tanin** | Stała masa warzyw, stała sól 2.2% | Źródło tanin / inhibitorów pektynazy | **A:** Grupa kontrolna (brak liści)<br>**B:** Liście dębu szypułkowego (2 szt.)<br>**C:** Liście czarnej porzeczki (3 szt.)<br>**D:** Korzeń chrzanu z liściem chrzanu<br>**E:** Chlorek wapnia $CaCl_2$ (0.08% masy całkowitej) |
| **Oś Zasolenia (RD-01)** | Ta sama baza warzyw i ziół | Procent soli w całkowitej masie układu | **A:** 1.8% (delikatne, małosolne)<br>**B:** 2.2% (złoty środek chrupkości)<br>**C:** 2.5% (tradycyjne zimowe)<br>**D:** 2.8% (twarde, głęboko kwaszone do wiosny) |
| **Oś Pikantności i Aromatu** | Stała solanka 2.2% | Gramatura czosnku, chili, gorczycy | **A:** Tradycyjna (czosnek 20g/L, koper)<br>**B:** Ognista (czosnek 30g + papryczka bird's eye)<br>**C:** Korzenna (gorczyca, kolendra, ziele angielskie)<br>**D:** Ziołowa (estragon, cząber) |
| **Oś Cukru i Kwasu (Dżemy/Powidła)** | Owoce 1000g | Procent cukru i dodatek pektyny | **A:** 20% cukru + pektyna jabłkowa<br>**B:** 30% cukru bez dodatków<br>**C:** 0% cukru (wolne prażenie 8h)<br>**D:** Miód lipowy zamiast cukru |
| **Oś Starterów Mikrobiologicznych** | Ta sama kapusta 1000g | Mikroflora inicjalna | **A:** Fermentacja spontaniczna (dzika flora)<br>**B:** Starter z udanego zakwasu (back-slopping 50ml)<br>**C:** Serwatka z wiejskiego mleka (10ml) |

---

## 3. Szczegółowe Wymagania Funkcjonalne (F-07.1 – F-07.5)

### F-07.1: Kreator Serii Eksperymentalnej (Split-Batch Wizard)
1. **Definicja Bazy:** Użytkownik wybiera surowiec (np. ogórki gruntowe, kapusta, papryka) i wpisuje łączną dostępną masę (np. 3500 g).
2. **Wybór Liczby Słoików ($N$):** Suwak lub selektor liczby słoików od 2 do 8 (np. 5 słoików po 700 g).
3. **Matryca Różnic (Delta Editor):**
   - Interaktywna tabela, w której użytkownik modyfikuje wybrane parametry dla każdego słoika (oznaczonych automatycznie literami **A, B, C, D, E...**).
   - Aplikacja automatycznie przelicza proporcje wody i soli zgodnie z regułą całkowitej masy $M_{\text{układ}} = M_{\text{warzywa}} + M_{\text{woda}}$ (RD-01).
4. **Zapis Serii w SQLite:**
   - Rekord nadrzędny `ExperimentSeriesRecord` (`id`, `title`, `hypothesis`, `startedAt`, `status: active|tasted|promoted`).
   - $N$ powiązanych rekordów `BatchRecord` z kluczem obcym `seriesId` oraz unikalnym identyfikatorem wariantu (`variantLetter: 'A'|'B'|'C'|...`).

### F-07.2: Inteligentne Etykiety Serii QR (Series Label Generation)
1. Etykiety generowane są seryjnie na pojedynczym arkuszu A4 (`exportLabelSheetAsPdf`).
2. Każda etykieta posiada wyraźny, elegancki nagłówek rustykalny:
   - `SERIA: [Nazwa Serii]`
   - `WARIANT [A / B / C...]`
   - Kluczowa różnica testowa wyboldowana (np. `Sól: 2.5% | Dodatek: Liść Dębu`).
   - Kod QR kodujący URI: `sloik://batch/<batchId>?exp=<seriesId>&var=<letter>`.
3. Skaner aparatu w zakładce Spiżarnia po nakierowaniu na dowolny ze słoików wyświetla:
   - Paszport tego słoika.
   - Odnośnik: *„Ten słoik należy do Serii Eksperymentalnej [Nazwa Serii] (Wariant 3 z 5). Dotknij, aby przejść do Panelu Porównania”*.

### F-07.3: Panel Ślepej Degustacji (Blind Cupping Mode)
Wzorem międzynarodowych standardów analizy sensorycznej (SCA dla kawy, BJCP dla piwa i ISO 11136 dla przetworów):
1. **Opcjonalny tryb ślepej próby:** Aplikacja ukrywa przed użytkownikiem specyfikację słoików i wyświetla jedynie litery A, B, C...
2. **Karta Oceny Sensorycznej (0–100 punktów):**
   - **Chrupkość i Tekstura (0–35 pkt):** ocena twardości, trzasku, struktury komórkowej.
   - **Balans Smakowy & Kwasowość (0–35 pkt):** przyjemny, czysty kwas mlekowy, brak nadmiernej goryczy lub octowości.
   - **Aromat & Bukiet (0–20 pkt):** nuty ziół, czosnku, przypraw, brak nut gnilnych czy chemicznych.
   - **Wygląd i Płyn (0–10 pkt):** barwa skórki, zmętnienie, perlistość.
3. **Pomiar Laboratoryjny:**
   - Wpis rzeczywistego pH zmierzonego papierkiem lakmusowym / pehametrem.

### F-07.4: Matryca Porównawcza Side-by-Side (Comparison Matrix)
1. Zestawienie tabelaryczne wszystkich wariantów na jednym ekranie:
   - Kolumny: Wariant A | Wariant B | Wariant C | Wariant D | Wariant E...
   - Wiersze: Parametry wyjściowe (Sól %, Gramatury, Dodatki) $\to$ Wyniki pomiaru pH $\to$ Punkty sensoryczne $\to$ Ocena gwiazdkowa (1–5).
2. Wykres radarowy (Radar Chart) nakładający na siebie profile sensoryczne poszczególnych słoików, wizualizujący przewagę chrupkości lub aromatu.

### F-07.5: Koronacja Zwycięzcy & Promocja do Receptur Autorskich
1. Użytkownik wybiera jeden lub więcej słoików jako **Zwycięzcę Konkursu** (np. *„Wariant B wygrywa w kategorii Tradycyjny Chrupiący”*, *„Wariant D wygrywa w kategorii Pikantny z Chili”*).
2. Przycisk **„Awansuj do Przepisów Mistrzowskich 🏆”**:
   - Tworzy nowy rekord w tabeli przepisów własnych użytkownika.
   - Generuje unikalny przepis ze skalowalnymi proporcjami (np. 1 kg, 3 kg, 5 kg, 10 kg).
   - Zapisuje notatkę historyczną: *„Receptura wyłoniona w ślepej degustacji serii [Nazwa] w dniu [Data] spośród 5 wariantów testowych.”*

---

## 4. Model Danych SQLite (DDL)

```sql
-- Seria Eksperymentalna (Wielosłoikowe Laboratorium)
CREATE TABLE IF NOT EXISTS experiment_series (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    hypothesis TEXT,
    base_produce_name TEXT NOT NULL,
    total_produce_grams REAL NOT NULL,
    jar_count INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'tasted', 'promoted'))
);

-- Rozszerzenie tabeli partii o przynależność do serii badawczej
-- Kolumny w batches:
-- series_id TEXT REFERENCES experiment_series(id) ON DELETE CASCADE,
-- variant_letter TEXT, -- 'A', 'B', 'C', 'D', 'E'...
-- variant_description TEXT, -- np. "2.2% soli + liść dębu 2 szt."
-- sensory_score INTEGER DEFAULT 0 -- wynik w punktach 0-100
```

---

## 5. Metryki Jakości i Bezpieczeństwa (NFR & Invariants)

1. **Bezpieczeństwo USDA:** Niezależnie od wariantu eksperymentalnego, kalkulator nie dopuszcza stężenia soli poniżej bezpiecznego minimum dla kiszonek ($< 1.5\%$ całkowitej masy układu) bez wyraźnego ostrzeżenia o ryzyku rozwoju drobnoustrojów gnilnych.
2. **Integralność Danych:** Usunięcie serii eksperymentalnej pyta użytkownika, czy zachować powiązane partie w spiżarni, czy usunąć całą serię kaskadowo.
3. **Zero Data Loss:** Wszystkie serie eksperymentalne i ich wyniki wchodzą w skład schematu kopii zapasowej JSON (`DatabaseBackupPayload`).
