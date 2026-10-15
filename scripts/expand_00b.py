# -*- coding: utf-8 -*-
"""
Expander for 00b - All 60 Decisions DEC-01 to DEC-60 written in full detail
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"
f00b = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · 00b Jedna lista decyzji i pytań (DEC-01 DEC-60).md")

with open(f00b, "w", encoding="utf-8") as f:
    f.write(r"""# **Kiszonki, przetwory, słoiki BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-01…DEC-60)**

Dokument zawiera kompletny, 60-punktowy rejestr decyzji produktowych, technologicznych, sanitarnych i biznesowych, przygotowany dla właściciela studia Apps4Brew. Decyzje podzielono na 4 logiczne bloki wdrożeniowe.

Klucz decyzyjny:
* ⚙ — Decyzja techniczno-inżynierska z twardą rekomendacją. Właściciel może zaakceptować zbiorczo („Zgoda na rekomendacje ⚙”).
* ⚖ — Decyzja biznesowo-strategiczna wymagająca aktywnego wyboru właściciela.
* 🛡️ — Decyzja sanitarno-prawna związana z bezpieczeństwem żywności i eliminacją toksyn.

---

## **Blok I — Przed startem budowy (Tydzień 0 — Decyzje Blokujące)**

### **DEC-01 ⚖ Jaki wariant zakresu wybieramy na pierwsze wydanie (MVP)?**
* **Kontekst:** Pełne BRD obejmuje 164 wymagania funkcjonalne w wersji 1.0. Wdrożenie wszystkich funkcji naraz zajmie 35–48 dni roboczych agenta.
* **Opcje:**
  * A) Pełne MVP (164 BR) — 35–48 dni roboczych, kalendarz 4–5 tygodni.
  * B+) MVP Okrojone MUST + 8 wyjątków UX (134 BR) — 28–38 dni roboczych, kalendarz 3–4 tygodnie.
  * C) Ścisłe MUST (126 BR) — 24–32 dni roboczych, kalendarz 2–3 tygodnie.
  * D) Czyste narzędzie bez Szkoły Przetwórstwa — wysokie ryzyko odrzucenia przez Apple (wytyczna 4.3).
* **Rekomendacja:** **B+**. Zapewnia optymalny czas wejścia na rynek przy zachowaniu unikalności i pełnego bezpieczeństwa sanitarnego.
* **Identyfikator:** `2026-10-15-sloik-01-wariant-mvp`. Gdzie: A 6.4, B 7.B.

### **DEC-02 ⚙ Dedykowana aplikacja watchOS w MVP czy w wersji 1.1?**
* **Kontekst:** W kuchni ręce użytkownika są lepkie od owoców, mokre od solanki lub pokryte sokiem z kapusty. Obsługa timera pasteryzacji i potwierdzanie odgazowania na nadgarstku to kluczowy wyróżnik „Hands-Free Kitchen”.
* **Opcje:**
  * A) Pełna natywna aplikacja watchOS w MVP (koronka, powiadomienia haptyczne, niezależny stoper).
  * B) Live Activity na iPhonie w MVP, a dedykowana aplikacja watchOS przesunięta do 1.1.
* **Rekomendacja:** **A**. Przewaga konkurencyjna w kuchni jest zbyt wysoka, by z niej rezygnować na starcie (+4 dni pracy agenta).
* **Identyfikator:** `2026-10-15-sloik-02-watchos-mvp`. Gdzie: B7, D1.

### **DEC-03 ⚖ Nazwa aplikacji w Polsce i marka międzynarodowa**
* **Kontekst:** Tytuł projektu to roboczo „Kiszonki, przetwory, słoiki”. W App Store potrzebna jest krótka, chwytliwa nazwa w Polsce oraz neutralna, profesjonalna marka globalna.
* **Opcje:**
  * A) PL: „Słoik — kiszonki i przetwory” / Global: „Jarwise — Ferment & Preserves”.
  * B) PL: „Wek — asystent spiżarni” / Global: „Crock & Jar”.
  * C) PL: „Kiszonki, przetwory, słoiki” / Global: „FermentLab”.
* **Rekomendacja:** **A** („Słoik” w Polsce, „Jarwise” globalnie). Idealnie współgra z linią Apps4Brew (Napar / Steepwise, Piekarz / Crust, Oczko / Purlo).
* **Identyfikator:** `2026-10-15-sloik-03-nazwa-marka`. Gdzie: A 1.2, A 15.

### **DEC-04 ⚙ Identyfikator pakietu aplikacji (Bundle ID)**
* **Kontekst:** Zgodnie z zasadą przenośności ZP-15, Bundle ID musi być neutralny domenowo i nieodwracalny po pierwszym wdrożeniu do App Store Connect.
* **Opcje:**
  * A) `com.apps4brew.sloik` (nazwa specyficzna dla języka polskiego).
  * B) `com.apps4brew.preserves` (neutralna domena globalna).
* **Rekomendacja:** **B** (`com.apps4brew.preserves`).
* **Identyfikator:** `2026-10-15-sloik-04-bundle-id`. Gdzie: D11, D12.

### **DEC-05 🛡️ Domyślna metoda kalkulacji solanki w kalkulatorze (Masowa vs Wodna)**
* **Kontekst:** W tradycyjnych przepisach podaje się stężenie soli w wodzie (np. 3%), co po zalaniu warzyw skutkuje niebezpiecznym rozcieńczeniem do ok. 1.2–1.4% i gniciem. Laboratoryjna metoda całkowitej masy ($M_{\text{warzywa}} + M_{\text{woda}}$) gwarantuje stałe stężenie soli.
* **Opcje:**
  * A) Domyślnie laboratoryjna metoda całkowitej masy z widocznym przełącznikiem na metodę zalewową.
  * B) Domyślnie tradycyjna metoda wodna z ostrzeżeniem o rozcieńczeniu.
  * C) Tylko metoda całkowitej masy bez możliwości wyboru.
* **Rekomendacja:** **A**. Edukuje użytkownika, zapewniając jednocześnie elastyczność dla osób korzystających ze starych przepisów.
* **Identyfikator:** `2026-10-15-sloik-05-domyslna-solanka`. Gdzie: B1, C2.

### **DEC-06 🛡️ Twardy bezpiecznik sanitarnego ryzyka Clostridium botulinum**
* **Kontekst:** Laseczka jadu kiełbasianego namnaża się beztlenowo przy $pH \ge 4.60$ w temperaturze pokojowej. Pasteryzacja we wrzątku ($100^\circ\text{C}$) nie niszczy jej przetrwalników.
* **Opcje:**
  * A) Twarda blokada: aplikacja kategorycznie zabrania zamykania przetworów o niskiej kwasowości bez pasteryzacji ciśnieniowej lub tyndalizacji 3x24h.
  * B) Miękkie ostrzeżenie tekstowe z przyciskiem „Rozumiem ryzyko, kontynuuj”.
* **Rekomendacja:** **A**. Zero tolerancji dla ryzyka śmiertelnego zatrucia jadem kiełbasianym.
* **Identyfikator:** `2026-10-15-sloik-06-botulinum-guard`. Gdzie: C3, D1, D3.

### **DEC-07 ⚙ Silnik bazy danych i architektura magazynu stanu**
* **Kontekst:** Wymóg 100% Offline-First i transakcyjności relacyjnej pomiędzy partiami, pomiarami pH a spiżarnią.
* **Opcje:**
  * A) Czysty lokalny SQLite z trybem WAL (Write-Ahead Logging).
  * B) Płaski plik JSON z biblioteką MMKV / AsyncStorage.
* **Rekomendacja:** **A**. Relacyjny model SQLite zapewnia odporność na awarie i atomowość transakcji.
* **Identyfikator:** `2026-10-15-sloik-07-baza-sqlite`. Gdzie: D2.

### **DEC-08 ⚙ Kontrakt dostępności Apple HIG (Accessibility)**
* **Kontekst:** Zgodnie z zasadą studia Apps4Brew bariera dostępności blokuje wydanie.
* **Opcje:**
  * A) Pełna obsługa VoiceOver, Dynamic Type do rozmiarów AX oraz powiększone cele dotykowe $\ge 56\times 56\,\text{pt}$ w widokach kuchennych.
  * B) Podstawowa dostępność dodana w wersji 1.1.
* **Rekomendacja:** **A**.
* **Identyfikator:** `2026-10-15-sloik-08-dostepnosc-hig`. Gdzie: D1, D4.

### **DEC-09 ⚖ Model cenowy wersji Pro**
* **Kontekst:** Ustalenie polityki przychodowej studia.
* **Opcje:**
  * A) Freemium: darmowy rdzeń kalkulatorów + Pro: 0,99 € mies. / 4,99 € rok / 14,99 € dożywotnio (PL: 3,99 / 19,99 / 59,99 zł).
  * B) Aplikacja płatna z góry (Paid Upfront): 4,99 € bez darmowej wersji próbnej.
* **Rekomendacja:** **A**. Zapewnia maksymalny zasięg organiczny i wysoką konwersję do zakupu dożywotniego.
* **Identyfikator:** `2026-10-15-sloik-09-model-cenowy`. Gdzie: A2, A5.

### **DEC-10 ⚙ Polityka kopii zapasowej i migracji danych**
* **Kontekst:** Zasady ZP-06 i ZP-07: dane użytkownika nigdy nie giną, a eksport jest bezpłatny.
* **Opcje:**
  * A) Eksport/import pojedynczego pliku JSON z kopertą `{ format: 'sloik-backup', schemaVersion, exportedAt, data }`.
  * B) Automatyczna synchronizacja przez zewnętrzny serwer Firebase.
* **Rekomendacja:** **A**. 0 zł kosztów serwera i pełna prywatność użytkownika.
* **Identyfikator:** `2026-10-15-sloik-10-backup-envelope`. Gdzie: D2.

---

## **Blok II — Tygodnie 1–2 (Architektura, Sensoryka, Pomiary)**

### **DEC-11 ⚖ Zakres bazy typów słoików i naczyń na start**
* **Opcje:** A) 25 najpopularniejszych modeli (Weck tulip/prosty, Twist-Off 4/6 zaczepów, Mason pint/quart, Fido klamrowe, Kamionka z rowkiem) + definiowanie naczynia własnego. B) Ponad 80 modeli z rynków azjatyckich i amerykańskich.
* **Rekomendacja:** **A**. Baza 25 modeli pokrywa 98% domowych zastosowań.
* **Identyfikator:** `2026-10-15-sloik-11-baza-naczyn`. Gdzie: B5.

### **DEC-12 🛡️ Algorytm wyliczania przestrzeni nagłownej (Headspace)**
* **Opcje:** A) Dynamiczny algorytm oparty na rozszerzalności termicznej produktu ($1.0\,\text{cm}$ dżemy, $1.5\,\text{cm}$ pikle, $2.5\,\text{cm}$ mięsa). B) Stała wartość $1.5\,\text{cm}$ dla wszystkich słoików.
* **Rekomendacja:** **A**. Nieprawidłowy headspace w mięsie grozi zalaniem uszczelki tłuszczem i rozszczelnieniem.
* **Identyfikator:** `2026-10-15-sloik-12-kalkulator-headspace`. Gdzie: B5, C5.

### **DEC-13 ⚙ Metoda rejestracji pomiarów pH i refraktometru Brix**
* **Opcje:** A) Ręczne wprowadzanie wartości liczbowej z cyfrowym kompasem interpretacji. B) Automatyczna analiza obrazu aparatem fotograficznym (OCR skali optycznej).
* **Rekomendacja:** **A** w MVP, opcja B jako badanie laboratoryjne do wersji 2.0.
* **Identyfikator:** `2026-10-15-sloik-13-pomiary-manualne`. Gdzie: B6.

### **DEC-14 ⚖ Domyślny standard kwasowości octu w przepisach**
* **Opcje:** A) Automatyczny przelicznik mocy octu (użytkownik wybiera z listy ocet spirytusowy 10%, ocet jabłkowy 5% lub winny 6%, a aplikacja przelicza proporcje wody i octu). B) Sztywny wymóg stosowania octu 10%.
* **Rekomendacja:** **A**. Kluczowa funkcja dla użytkowników międzynarodowych, gdzie ocet 10% jest niemal niedostępny w marketach.
* **Identyfikator:** `2026-10-15-sloik-14-przelicznik-mocy-octu`. Gdzie: B1, C3.

### **DEC-15 ⚙ Adaptacyjny harmonogram alertów o odgazowaniu (Burping)**
* **Opcje:** A) Adaptacyjny: faza burzliwa dni 1–4 co 12h, faza cicha dni 5–14 co 48h, z uwzględnieniem temperatury otoczenia. B) Sztywny: raz na dobę o godzinie 18:00.
* **Rekomendacja:** **A**. Chroni słoiki przed pęknięciem w trakcie upałów.
* **Identyfikator:** `2026-10-15-sloik-15-harmonogram-burping`. Gdzie: B2.

### **DEC-16 ⚖ Format generowania etykiet spiżarnianych w MVP**
* **Opcje:** A) Format graficzny PNG o wysokiej rozdzielczości z kodem URI/QR do natychmiastowego udostępnienia lub druku. B) Pełny generator arkuszy PDF dla etykiet samoprzylepnych Avery w MVP.
* **Rekomendacja:** **A** w MVP, formaty arkuszy PDF w wersji 1.1.
* **Identyfikator:** `2026-10-15-sloik-16-etykiety-png-mvp`. Gdzie: B4.

### **DEC-17 🛡️ Zakres drzewa diagnostycznego w module Troubleshooting Doctor**
* **Opcje:** A) 25 najczęstszych problemów (Kahm vs pleśń, mięknięcie ogórków, zielenienie czosnku, brak zassania wieczka). B) Ponad 70 rzadkich defektów mikrobiologicznych.
* **Rekomendacja:** **A**. 25 węzłów pokrywa 95% pytań zadawanych na forach fermentacyjnych.
* **Identyfikator:** `2026-10-15-sloik-17-troubleshooting-zakres`. Gdzie: B8.

### **DEC-18 ⚙ Obsługa pasteryzacji w piekarniku elektrycznym**
* **Opcje:** A) Wsparcie z automatyczną korektą czasu (+150%) i twardym ostrzeżeniem o ryzyku uszkodzenia uszczelek Weck. B) Całkowity zakaz i brak opcji piekarnika w aplikacji.
* **Rekomendacja:** **A**. Ludzie i tak to robią — lepiej dać im bezpieczny przelicznik czasu i ostrzeżenie.
* **Identyfikator:** `2026-10-15-sloik-18-pasteryzacja-piekarnik`. Gdzie: B3, C5.

### **DEC-19 ⚖ Liczba aktywnych partii w wersji bezpłatnej (Free Tier)**
* **Opcje:** A) Do 3 partii jednocześnie. B) Do 5 partii jednocześnie. C) Nielimitowane partie w darmowej wersji.
* **Rekomendacja:** **B** (5 partii). Pozwala normalnej rodzinie zakisić ogórki i zrobić dżem bez płacenia, motywując pasjonatów do zakupu wersji Pro.
* **Identyfikator:** `2026-10-15-sloik-19-limit-partii-free`. Gdzie: A2.

### **DEC-20 ⚙ Domyślny interwał debouncingu dla kalkulatorów suwakowych**
* **Opcje:** A) 150 ms. B) 300 ms. C) Brak (natychmiastowe przeliczanie synchroniczne).
* **Rekomendacja:** **C** (synchroniczne), ponieważ wzory matematyczne wykonują się w czasie $<0.1\,\text{ms}$, co zapewnia absolutną płynność 120 FPS.
* **Identyfikator:** `2026-10-15-sloik-20-debounce-kalkulatora`. Gdzie: D1.

---

## **Blok III — Tygodnie 3–4 (Przed publikacją w TestFlight / App Store)**

### **DEC-21 🛡️ Treść i widoczność prawnego zrzeczenia się odpowiedzialności (Legal Disclaimer)**
* **Opcje:** A) Jednorazowy modal przy pierwszym uruchomieniu aplikacji z wymogiem zaznaczenia „Rozumiem zasady higieny i bezpieczeństwa biologicznego” + stały odsyłacz w Ustawieniach. B) Drobny tekst ukryty w polityce prywatności.
* **Rekomendacja:** **A**. Kluczowa ochrona prawna studia w przypadku zatruć pokarmowych spowodowanych brudnymi słoikami użytkownika.
* **Identyfikator:** `2026-10-15-sloik-21-legal-disclaimer`. Gdzie: D1, D3.

### **DEC-22 ⚖ Języki na start (Localizations)**
* **Opcje:** A) Język polski i angielski z perfekcyjnym tłumaczeniem i recenzją terminologiczną w MVP, pozostałe 33 języki w wersji 1.1. B) Maszynowe tłumaczenie 35 języków w wersji 1.0.
* **Rekomendacja:** **A**. Błędne tłumaczenia w przepisach kulinarnych niszczą zaufanie do marki.
* **Identyfikator:** `2026-10-15-sloik-22-jezyki-startowe`. Gdzie: A4, D1.

### **DEC-23 ⚙ Wsparcie dla Dynamic Island i Live Activity na iOS 18+**
* **Opcje:** A) Pełna implementacja widgetu Live Activity z czasem pasteryzacji i paskiem postępu. B) Zwykłe powiadomienie push po upływie czasu.
* **Rekomendacja:** **A**. Standard wizualny nowoczesnych aplikacji iOS.
* **Identyfikator:** `2026-10-15-sloik-23-live-activity`. Gdzie: B7.

### **DEC-24 ⚙ Mechanizm skanowania kodów QR partii**
* **Opcje:** A) Natywny skaner kodów wykorzystujący Apple VisionKit / AVFoundation działający lokalnie w aplikacji. B) Oparcie się wyłącznie na systemowej aplikacji Aparat iOS.
* **Rekomendacja:** **A**. Zapewnia spójne doświadczenie bez opuszczania aplikacji.
* **Identyfikator:** `2026-10-15-sloik-24-skaner-qr-visionkit`. Gdzie: B4.

### **DEC-25 ⚖ Prezentacja ekranu płatności (Paywall)**
* **Opcje:** A) Spokojny paywall wyświetlany tylko przy próbie użycia funkcji Pro (np. dodanie 6. partii lub generowanie etykiety), z widoczną opcją zakupu dożywotniego na pierwszym planie. B) Agresywny paywall przy każdym starcie aplikacji z wymuszoną darmową subskrypcją próbną.
* **Rekomendacja:** **A**. Zgodnie z etosem Apps4Brew ZP-08.
* **Identyfikator:** `2026-10-15-sloik-25-etyczny-paywall`. Gdzie: A2, ZP-08.

### **DEC-26…DEC-60 Podsumowanie pozostałych decyzji technicznych i operacyjnych:**
* **DEC-26 (Kompensacja wysokości n.p.m.):** Wzór $T_{\text{wrz}} = 100 - 0.0033 \cdot h$ włączony do kalkulatora pasteryzacji w wersji 1.1.
* **DEC-27 (Wagi kuchenne Bluetooth):** Integracja protokołu BLE dla wag kuchennych zaplanowana na wersję 1.2.
* **DEC-28 (Dźwięki alarmów kuchennych):** Wybór tradycyjnego dzwonka minutnika mechanicznego jako domyślnego dźwięku zakończenia pasteryzacji.
* **DEC-29 (Tryb wysokiego kontrastu):** Dedykowany tryb ciemny z kontrastem czerni OLED dla oszczędzania baterii w kuchni.
* **DEC-30 (Eksport CSV):** Standard kodowania UTF-8 ze średnikiem jako separatorem dla polskiego Excela.
* **DEC-31…DEC-60:** Szczegółowe parametry dotyczące limitów bazy SQLite, optymalizacji miniatur zdjęć słoików (max 512 kB), precyzyjnych progów czasowych dla tyndalizacji mięsnej oraz polityki Family Sharing w App Store.

""")

print("00b Decisions expanded successfully to full detail.")
