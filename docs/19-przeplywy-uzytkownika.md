# Słoik (Jarwise) — Kompletna Mapa Przepływów Użytkownika (User Flows)

Dokument definiuje wszystkie przepływy funkcjonalne w aplikacji **Słoik (Jarwise)** ułożone w logicznej, chronologicznej kolejności — od pierwszego uruchomienia aplikacji, przez dobór warzyw i nastaw słoika na blacie kuchennym, pasteryzację, burzliwą fermentację, aż po leżakowanie w spiżarni, diagnostykę mikrobiologiczną, eksperymenty A/B oraz kopię zapasową offline.

---

## Spis Przepływów (Kolejność Cyklu Życia Słoika)

1. **Przepływ 1:** Pierwsze Uruchomienie, Personalizacja i Edukacja (`Onboarding & Fundament`)
2. **Przepływ 2:** Rytuał Nastawu — Ścieżka A: Styl Dowolny (`Fermentuj z Lodówki`)
3. **Przepływ 3:** Rytuał Nastawu — Ścieżka B: Baza 155 Receptur Mistrzów i Klasyki
4. **Przepływ 4:** Tworzenie Własnej Procedury i Kalibracja Sprzętu (`Warsztat Rzemieślnika`)
5. **Przepływ 5:** Pasteryzacja i Kontrola Bezpieczeństwa (`Stoper Kuchenny & Strażnik USDA`)
6. **Przepływ 6:** Dojrzewalnia — Część 1: Monitorowanie Aktywnej Fermentacji (`Na Blacie`)
7. **Przepływ 7:** Dojrzewalnia — Część 2: Zarządzanie Spiżarnią, Etykiety QR i Paszport Słoika (`W Spiżarni`)
8. **Przepływ 8:** Wiedza Rzemieślnicza i Doktor Mikrobiologiczny (`Ratowanie Nastawów`)
9. **Przepływ 9:** Laboratorium Eksperymentów A/B (`Split-Batch & Cupping 100 pkt`)
10. **Przepływ 10:** Ustawienia, Suwerenność Danych Offline i Kopia Zapasowa (`Backup & Recovery`)

---

## 1. Pierwsze Uruchomienie, Personalizacja i Edukacja

Przepływ wprowadzający użytkownika w filozofię rzemiosła i obsługę aplikacji bez konieczności zakładania konta.

```
[🚀 Pierwsze otwarcie aplikacji Słoik]
   │
   ▼
[1] KROK 1: Wybór Profilu Rzemieślnika (CraftOnboardingModal)
    • Użytkownik wybiera swój główny kierunek:
      - 🥒 Klasyczne Kiszonki (ogórki, kapusta, zakwas buraczany)
      - 🌶️ Fermenty Świata (kimchi, pikle azjatyckie, sosy chili)
      - 🍓 Domowe Weki i Konfitury (dżemy, kompoty, pasteryzacja)
    • Wybór zapisuje się w lokalnej bazie SQLite i dopasowuje domyślne presety.
   │
   ▼
[2] KROK 2: Złote Zasady Kiszenia — 5 Reguł Mistrza (QuickStartGuideModal)
    • Stały baner na górze ekranu Rytuału („FUNDAMENT RZEMIOSŁA”)
    • 5 żelaznych praw mikrobiologii:
      1. Precyzja stężenia soli (2.0%–3.5% niejodowanej soli kamiennej)
      2. Beztlenowe środowisko (wszystko pod lustrem solanki + docisk)
      3. Kontrola temperatury (18–22°C start, potem chłodzenie)
      4. Higiena i odgazowywanie (codzienny „burp” CO₂)
      5. Rozróżnienie kożucha Kahm (nieszkodliwy) od pleśni (do utylizacji)
   │
   ▼
[3] KROK 3: Interaktywny Przewodnik po Funkcjach (AppTourModal)
    • Dostępny z banera „🧭 Przewodnik: Jak działa aplikacja?” oraz ikony w nagłówku
    • 7 slajdów wyjaśniających krok po kroku każdy moduł aplikacji:
      Rytuał ➔ Styl Dowolny ➔ 155 Receptur ➔ Dojrzewalnia ➔ Spiżarnia QR ➔ Doktor ➔ 100% Offline
```

---

## 2. Rytuał Nastawu — Ścieżka A: Styl Dowolny („Fermentuj z Lodówki”)

Główny przepływ kreatywny dla użytkownika, który ma w kuchni dowolne warzywa i chce, aby aplikacja wyliczyła bezpieczne proporcje, dobrała zioła i poprowadziła za rękę.

```
[Zakładka: ⚖️ Rytuał] ➔ [Tryb: 🧪 Styl Dowolny]
   │
   ▼
[1] KROK 1: Co dzisiaj kisimy? (Wybór warzyw z zamkniętej listy)
    • Filtr kategorii warzyw: [🌟 Wszystkie] [🥬 Kapusty & Liście] [🥒 Warzywa] [🥕 Korzenie] [🧄 Aromaty]
    • Użytkownik zaznacza 1 lub więcej składników (np. Buraki + Rzodkiew + Czosnek)
    • Pasek „Wybrane składniki (X)” pokazuje pigułki z opcją szybkiego odpięcia (✕)
    • Karta Kompozycji na żywo generuje:
      - Nazwę nastawu i rekomendowaną metodę (Solanka wodna vs Solenie na sucho)
      - Bezpieczne stężenie soli (%) oraz czas fermentacji (dni)
      - Dedykowaną mieszankę ziół i wskazówkę technologiczną
    • Karta Aktywnego Nastawu podsumowuje wybrany profil pod spodem.
   │
   ▼
[2] KROK 2: Waga surowca i naczynie
    • Użytkownik waży warzywa i wpisuje gramaturę na szalce (np. 1250 g) lub klika [+100g] [+250g] [+500g] [+1kg]
    • Wybiera słoik z listy (np. Słoik Weck 1000 ml, Twist-Off 900 ml, Kamionka 5L)
   │
   ▼
[3] KROK 3: Święte Proporcje dla Twojej Wagi (SacredNumbersBar)
    • Automatyczne przeliczenie co do grama dla wybranej wagi:
      - Waga surowca (g / oz)
      - Objętość wody do solanki (ml / fl oz) lub informacja „Sok własny”
      - Dokładna gramatura soli kamiennej (g / oz) przy zadanym % zasolenia
    • Karta przypraw wyświetla listę ziół dopasowanych do wybranych warzyw.
   │
   ▼
[4] KROK 4: Procedura nastawu krok po kroku (CraftProcedureModal)
    • Kliknięcie [🚀 Zacznij procedurę nastawu krok po kroku →] otwiera pełnoekranowego asystenta blatu:
      - Ekran nie gaśnie (`useKeepAwake` — obsługa mokrymi dłońmi)
      - Na górze widnieje pasek postępu, miniatury kroków oraz ściąga z gramaturą soli i wody
      - Na środku: AKTUALNY KROK wielką czcionką (czytelny z 1 metra) + wskazówka mistrza
      - Na dole: nawigacja [← Poprzedni krok] oraz [Krok zrobiony ✓ (Dalej →)]
    • Na ostatnim kroku przycisk zmienia się w:
      [Zakończ i zapisz słoik 🫙]
    • Po kliknięciu słoik trafia do bazy SQLite, planowane są powiadomienia fazowe, a aplikacja przenosi do Dojrzewalni.
```

---

## 3. Rytuał Nastawu — Ścieżka B: Baza 155 Receptur Mistrzów i Klasyki

Przepływ dla użytkownika szukającego sprawdzonego przepisu z kanonu polskiego lub światowego.

```
[Zakładka: ⚖️ Rytuał] ➔ [Tryb: 📜 Receptury (155)] lub [🥒 Klasyki]
   │
   ▼
[1] KROK 1: Wybór przepisu
    • W trybie „Receptury (155)”:
      - Filtrowanie po regionie (Polska, Azja, Bliski Wschód, Ameryki, Owoce, Napoje & Octy)
      - Wyszukiwarka tekstowa (np. „kimchi”, „zakwas”, „rzodkiew”, „buraki”)
      - Kliknięcie „Wybierz →” na karcie ładuje parametry receptury
    • W trybie „Klasyki”:
      - Szybki wybór 1-Tap najpopularniejszych nastawów dopasowanych do profilu
    • Karta Aktywnego Nastawu potwierdza załadowany przepis, kulturę, % soli i dni.
   │
   ▼
[2] KROK 2: Waga surowca i naczynie
    • Domyślna waga z przepisu (np. 1000 g) może zostać dowolnie zmieniona pod ilość posiadanych warzyw
    • Wybór słoika z listy sprzętu
   │
   ▼
[3] KROK 3: Święte Proporcje dla Twojej Wagi
    • Przeliczenie gramatury soli kamiennej i wody proporcjonalnie do nowej wagi warzyw
    • Wyświetlenie pełnej listy składników i sekretów chrupkości z receptury
   │
   ▼
[4] KROK 4: Procedura i zapis słoika
    • Opcja A (Z asystentem): [🚀 Zacznij procedurę nastawu krok po kroku →] ➔ przejście przez oryginalne kroki przepisu ➔ [Zakończ i zapisz słoik 🫙]
    • Opcja B (Dla zaawansowanych): [🫙 Szybki zapis słoika (bez asystenta)] ➔ natychmiastowy zapis partii w Dojrzewalni
```

---

## 4. Tworzenie Własnej Procedury i Kalibracja Sprzętu

Przepływ rozbudowy warsztatu o własne przepisy rodzinne oraz niestandardowe naczynia.

```
[Zakładka: ⚖️ Rytuał lub 📖 Wiedza]
   │
   ├──► ŚCIEŻKA 4A: Własna Receptura (CustomRecipeModal)
   │    [1] Kliknij „📝 Zdefiniuj własną procedurę krok po kroku”
   │    [2] Wpisz nazwę nastawu, kulturę/region, docelowe % soli, wagę bazową i czas fermentacji
   │    [3] Dodaj listę składników oraz kolejne kroki procedury
   │    [4] Zapisz ➔ Receptura pojawia się na stałe w bazie Wiedzy i w Rytuale
   │
   └──► ŚCIEŻKA 4B: Warsztat Sprzętu (CustomEquipmentModal)
        [1] W Kroku 2 Rytuału kliknij „⚙️ Warsztat sprzętu”
        [2] Przeglądaj posiadane naczynia lub wypełnij formularz nowego naczynia:
            - Nazwa (np. „Kamionka Bolesławiec 8L”)
            - Pojemność w ml (np. 8000 ml)
            - Typ zamknięcia (Kołnierz wodny / Twist-Off / Weck z gumką / Rurka fermentacyjna)
        [3] Zapisz ➔ Naczynie jest dostępne przy każdym kolejnym nastawie
```

---

## 5. Pasteryzacja i Kontrola Bezpieczeństwa (Stoper & Strażnik USDA)

Przepływ obróbki termicznej przetworów gwarantujący bezpieczeństwo mikrobiologiczne i ochronę przed *Clostridium botulinum*.

```
[Nagłówek Rytuału] ➔ [Ikona: ⏱️ Stoper Pasteryzacji (PasteurizerTimerScreen)]
   │
   ▼
[1] KROK 1: Dobór czasu do pojemności słoika
    • Użytkownik wybiera wielkość słoików w garnku:
      - Słoik 350 ml (10 min)
      - Słoik 500 ml (15 min)
      - Słoik 1L (20 min)
      - Słoik duży (30 min)
    • Strażnik Bezpieczeństwa USDA (`safety-guard`) weryfikuje barierę kwasowości pH <= 4.6
   │
   ▼
[2] KROK 2: Odliczanie czasu pasteryzacji
    • Kliknięcie [Start Pasteryzacji ▶️] uruchamia zegar oparty na znacznikach czasu (`endAtMs`)
    • Odporność na uśpienie telefonu: po wybudzeniu aplikacji z tła czas wylicza się bez opóźnień
    • Możliwość wstrzymania [Pauza ⏸️] lub zresetowania [Reset ↺]
   │
   ▼
[3] KROK 3: Alarm zakończenia i Test Wieczka
    • Po upływie czasu włącza się sygnał dźwiękowy i komunikat o wyjęciu słoików
    • Karta instruktażowa przeprowadza przez „🔍 Test Wieczka (po 12–24h)” — kontrola wklęsłości i próżni
```

---

## 6. Dojrzewalnia — Część 1: Monitorowanie Aktywnej Fermentacji („Na Blacie”)

Przepływ opieki nad pracującymi słoikami od pierwszego dnia nastawu do zakończenia fermentacji.

```
[Zakładka: 🫙 Dojrzewalnia] ➔ [Segment: 🫧 Na Blacie (Fermentacja)]
   │
   ▼
[1] KROK 1: Przegląd aktywnych słoików i Osi Czasu
    • Każda aktywna partia wyświetla:
      - Aktualny dzień fermentacji i pasek postępu
      - Fazę mikrobiologiczną (Faza 1: Start beztlenowy ➔ Faza 2: Burzliwa z emisją CO₂ ➔ Faza 3: Kwaszenie właściwe)
      - Parametry partii (% soli, gramatura, metoda)
   │
   ▼
[2] KROK 2: Codzienna obsługa słoika (Odgazowanie & Degustacja)
    • [🫧 Odgazuj (Burp)]: 1-Tap rejestracja upuszczenia nadmiaru gazu CO₂ ze słoika
    • [📝 Dziennik / pH]: Otwiera modal wpisu sensorycznego:
      - Ocena chrupkości (1–5 gwiazdek ★)
      - Opcjonalny pomiar pH (np. pH 3.6)
      - 5 suwaków profilu sensorycznego: Kwasowość, Słoność, Chrupkość, Musowanie, Aromat
      - Notatka tekstowa z obserwacji
   │
   ▼
[3] KROK 3: Analiza Radaru Sensorycznego 5D (SensoryRadarChart)
    • Rozwijany wykres pajęczynowy na karcie słoika wizualizuje balans smakowy partii na tle wzorca
   │
   ▼
[4] KROK 4: Zakończenie fermentacji
    • Gdy smak jest optymalny, użytkownik klika [🫙 Do spiżarni]
    • Partia zmienia status z `fermenting` na `pantry` i tworzy rekord leżakowania w Spiżarni
```

---

## 7. Dojrzewalnia — Część 2: Spiżarnia, Etykiety QR i Paszport Słoika („W Spiżarni”)

Przepływ inwentaryzacji gotowych przetworów, znakowania słoików kodami QR oraz śledzenia zużycia.

```
[Zakładka: 🫙 Dojrzewalnia] ➔ [Segment: 🫙 W Spiżarni (Zapasy)]
   │
   ▼
[1] KROK 1: Organizacja zapasów i magazynu surowców
    • Filtrowanie słoików po miejscu przechowywania:
      [Wszystkie] [🧱 Piwniczka] [🚪 Szafka] [❄️ Lodówka]
    • Zarządzanie stanem surowców i akcesoriów (sól kamienna, przyprawy, wolne słoiki i wieczka)
   │
   ▼
[2] KROK 2: Generowanie Etykiety QR i Druk PDF A4
    • Kliknięcie [🏷️ Etykieta QR] na wybranym słoiku otwiera podgląd etykiety rzemieślniczej
    • Etykieta zawiera: nazwę przetworu, datę nastawu, parametry soli, termin przydatności i kod URI (`sloik://batch/...`)
    • Kliknięcie [🖨️ Eksportuj arkusz PDF (A4)] generuje gotowy do wydruku arkusz 8 etykiet na słoiki
   │
   ▼
[3] KROK 3: Skanowanie QR i Paszport Słoika (batch/[id])
    • Kliknięcie [📷 Skanuj QR słoika] uruchamia skaner kamery (`QrScannerModal`) lub pozwala kliknąć słoik z listy
    • Otwiera się pełny **Paszport Słoika**:
      - Pełna metryka surowca, soli i wody
      - Status bezpieczeństwa biologicznego USDA
      - Wykres Radaru Sensorycznego 5D
      - Kompletna historia logów odgazowania i pomiarów pH od dnia nastawu
   │
   ▼
[4] KROK 4: Konsumpcja słoika
    • Kliknięcie [🍴 Zjedz 1 szt.] zmniejsza liczbę słoików na półce o 1 (lub oznacza partię jako zjedzoną)
```

---

## 8. Wiedza Rzemieślnicza i Doktor Mikrobiologiczny (Ratowanie Nastawów)

Przepływ edukacyjny oraz diagnostyczny w sytuacjach awaryjnych (nalot na powierzchni, mętna solanka, mięknięcie).

```
[Zakładka: 📖 Wiedza]
   │
   ├──► ŚCIEŻKA 8A: Encyklopedia 155 Receptur Świata
   │    [1] Wybierz segment [📖 Receptury Świata (155)]
   │    [2] Filtruj po kategorii kulturowej lub wpisz frazę w wyszukiwarkę
   │    [3] Kliknij wybraną recepturę, aby otworzyć Kompendium Przepisu:
   │        - Dokładna tabela składników i proporcji
   │        - Instrukcja krok po kroku
   │        - Sekrety chrupkości (garbniki, temperatura, cięcie)
   │        - Kamienie milowe dzień po dniu (jak ma pachnieć i wyglądać)
   │        - Typowe błędy i jak ich uniknąć
   │
   └──► ŚCIEŻKA 8B: Doktor Mikrobiologiczny (Drzewo Decyzyjne & Ratunek)
        [1] Wybierz segment [🩺 Doktor Mikrobiologiczny]
        [2] KROK 1: Wybór objawu w drzewie decyzyjnym (np. „Co niepokoi Cię w słoiku?”):
            - ☁️ Nalot lub kożuch na powierzchni
            - 🫧 Dziwna solanka (mętna, śluzowata, różowa)
            - 🥒 Problem z warzywami (miękkie, puste w środku, niebieski czosnek)
            - 👃 Niepokojący zapach (aceton, zgnilizna, drożdże)
        [3] KROK 2: Doprecyzowanie wizualne (np. „Płaski biały pomarszczony film” vs „Włochate kolorowe skupiska”)
        [4] KROK 3: Diagnoza i Werdykt Bezpieczeństwa:
            - Status: 🟢 BEZPIECZNE / 🟡 WYMAGA INTERWENCJI / 🔴 ZAGROŻENIE ZDROWIA (WYRZUĆ!)
            - Wyjaśnienie naukowe przyczyny (np. drożdże Kahm vs pleśnie mikotoksyczne)
            - Lista kroków naprawczych i prewencji
        [5] KROK 4: Kalkulator Awaryjnej Dolewki Solanki (`calculateBrineTopUp`):
            - Gdy w słoiku brakuje płynu i warzywa wystają nad powierzchnię:
            - Użytkownik wybiera brakującą objętość (150 / 250 / 400 / 500 ml) i docelowe % soli
            - Kalkulator wylicza dokładną ilość soli do rozpuszczenia w przegotowanej wodzie
            - Poniżej dostępne są karty Procedur Ratunkowych krok po kroku
```

---

## 9. Laboratorium Eksperymentów A/B (Split-Batch & Cupping Sensoryczny)

Przepływ dla pasjonatów chcących naukowo porównać wpływ jednej zmiennej (np. liść dębu vs liść wiśni vs chlorek wapnia) na tej samej partii warzyw.

```
[Nagłówek Rytuału] ➔ [Ikona: 🔬 Laboratorium Eksperymentów (ExperimentsScreen)]
   │
   ▼
[1] KROK 1: Definicja Hipotezy i Osi Eksperymentu
    • Kliknij [+ Nowy Eksperyment Split-Batch]
    • Wpisz tytuł serii, surowiec bazowy (np. Ogórki gruntowe) i łączną wagę (np. 2000 g)
    • Wybierz liczbę słoików w serii (od 2 do 6 wariantów: Słoik A, B, C, D...)
    • Wybierz oś badawczą (Garbniki i chrupkość / Stężenie soli / Temperatura / Zioła)
   │
   ▼
[2] KROK 2: Konfiguracja zmiennej Delta dla każdego słoika
    • Aplikacja równo dzieli surowiec (np. po 500 g na każdy z 4 słoików)
    • Użytkownik wpisuje unikalny dodatek dla każdego wariantu:
      - Słoik A: Wariant kontrolny (solanka 2.0%)
      - Słoik B: +2 liście dębu
      - Słoik C: +3 liście czarnej porzeczki
      - Słoik D: +0.5 g chlorku wapnia
    • Kliknięcie [Rozpocznij serię eksperymentalną] tworzy powiązane słoiki w bazie
   │
   ▼
[3] KROK 3: Arkusz Degustacyjny (Cupping 100-punktowy)
    • Po zakończeniu fermentacji użytkownik otwiera serię i klika [⚖️ Oceń słoik] przy każdym wariancie
    • Przyznaje punkty w 4 kategoriach rzemieślniczych:
      - Tekstura i chrupkość (0–35 pkt)
      - Balans kwasu i smaku (0–35 pkt)
      - Aromat i bukiet (0–20 pkt)
      - Wygląd i klarowność (0–10 pkt)
    • Dodaje notatki degustacyjne
   │
   ▼
[4] KROK 4: Automatyczny Ranking i Wnioski
    • Aplikacja sumuje punkty (0–100 pkt), sortuje warianty od najlepszego i oznacza zwycięską recepturę koroną 🏆
```

---

## 10. Ustawienia, Suwerenność Danych Offline i Kopia Zapasowa

Przepływ konfiguracji jednostek, języka oraz pełnego bezpieczeństwa danych bez udziału chmury.

```
[Nagłówek dowolnego ekranu] ➔ [Ikona: ⚙️ Ustawienia i Warsztat (SettingsScreen)]
   │
   ▼
[1] KROK 1: Personalizacja Rytuału, Języka i Jednostek
    • Zmiana aktywnego profilu rzemieślnika (Klasyka / Fermenty Świata / Weki)
    • Szybkie otwarcie Przewodnika po Aplikacji lub Złotych Zasad Kiszenia
    • Przełącznik języka interfejsu: [🇵🇱 Polski] / [🇬🇧 English] (100% pokrycia słownika)
    • Przełącznik systemu miar: [Metryczny (g, kg, ml, °C)] / [Imperialny (oz, lb, fl oz, °F)]
   │
   ▼
[2] KROK 2: Kopia Zapasowa 100% Offline (Eksport & Import JSON)
    • [📤 Eksportuj kopię zapasową (JSON)]:
      - Zrzuca wszystkie partie, logi fermentacji, spiżarnię, własne receptury, sprzęt i eksperymenty do pliku `.json`
      - Otwiera natywny arkusz udostępniania iOS (Zapisz w Plikach / AirDrop) lub kopiuje do schowka
    • [📥 Przywróć z kopii (Import JSON)]:
      - Wklejenie zawartości pliku JSON ze schowka
      - Walidacja integralności struktury i atomowe odtworzenie bazy SQLite
   │
   ▼
[3] KROK 3: Tarcza Awaryjnego Odzyskiwania (Emergency Recovery Banner)
    • Jeśli przy starcie aplikacja wykryje uszkodzenie struktury danych:
      - Automatycznie izoluje uszkodzony stan w kopii awaryjnej
      - Wyświetla na górze ekranu czerwony baner „⚠️ Wykryto problem ze stanem danych” z bezpośrednim przejściem do odtworzenia kopii.
```
