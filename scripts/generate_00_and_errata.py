# -*- coding: utf-8 -*-
"""
Generator for 00b Decisions and 00c Errata
"""
import os

OUT_DIR = r"c:\Users\lukas\Documents\antigravity\joyful-chandrasekhar\kiszonki_brd"
os.makedirs(OUT_DIR, exist_ok=True)

# 00b DECISIONS
f00b = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · 00b Jedna lista decyzji i pytań (DEC-01 DEC-60).md")
with open(f00b, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-01…DEC-60)**

## **1. Wprowadzenie i mechanizm decyzyjny**

Wszystkie decyzje w projekcie podzielono na 4 logiczne bloki czasowe:
* **Blok I (Tydzień 0):** decyzje krytyczne blokujące start prac deweloperskich.
* **Blok II (Tygodnie 1–2):** decyzje architektoniczne i domenowe potrzebne w trakcie implementacji rdzenia.
* **Blok III (Tygodnie 3–4):** decyzje przed publikacją w TestFlight / App Store (monetyzacja, komunikacja, disclaimer prawny).
* **Blok IV (Wersje 1.1+):** kierunki rozwoju po udanym debiucie MVP.

Decyzje oznaczone symbolem ⚙ posiadają twardą rekomendację inżynierską — właściciel może zatwierdzić je zbiorczo.

---

## **Blok I — Przed startem budowy (Tydzień 0)**

### **DEC-01 Jaki wariant zakresu wybieramy na pierwsze wydanie (MVP)?**
* **Kontekst:** Pełne BRD obejmuje 164 wymagania w wersji 1.0. Zbudowanie wszystkiego naraz wydłuża czas wejścia do 5 tygodni.
* **Opcje:**
  * A) Pełne MVP (164 BR) — 35–48 dni roboczych agenta.
  * B+) Okrojone MVP MUST + 8 wyjątków UX (134 BR) — **Rekomendacja analityka** (28–38 dni).
  * C) Tylko ścisłe MUST (126 BR) — 24–32 dni.
  * D) Czyste narzędzie bez modułu nauki — wysokie ryzyko odrzucenia przez Apple (wytyczna 4.3).
* **Rekomendacja:** **B+**. Gwarantuje unikalność rynkową i moduł bezpieczeństwa bez opóźnień.

### **DEC-02 Zegarek Apple Watch w MVP czy w wersji 1.1? ⚙**
* **Kontekst:** Przetwórstwo to zajęcie brudzące ręce. Obsługa timera pasteryzacji i potwierdzanie odgazowania na nadgarstku to kluczowy wyróżnik „Hands-Free Kitchen”.
* **Opcje:**
  * A) Pełna natywna aplikacja watchOS w MVP (koronka, powiadomienia, gesty).
  * B) Live Activity na iPhonie w MVP, a dedykowana aplikacja watchOS w wersji 1.1.
* **Rekomendacja:** **A**. Przewaga konkurencyjna w kuchni jest zbyt wysoka, by z niej rezygnować na starcie.

### **DEC-03 Nazwa robocza, nazwa w App Store i marka międzynarodowa**
* **Kontekst:** Tytuł projektu to „Kiszonki, przetwory, słoiki”. W App Store potrzebna jest krótka, chwytliwa nazwa w Polsce oraz neutralna marka globalna.
* **Opcje:**
  * A) PL: „Słoik — kiszonki i przetwory” / Global: „Jarwise — Ferment & Preserves”.
  * B) PL: „Kiszonki i Weki” / Global: „Crock & Jar”.
  * C) PL: „Kwas” / Global: „FermentLab”.
* **Rekomendacja:** **A**. „Słoik” w Polsce i „Jarwise” na świecie idealnie wpisują się w linię Apps4Brew (Napar, Piekarz).

### **DEC-04 Identyfikator pakietu aplikacji (Bundle ID) ⚙**
* **Kontekst:** Bundle ID jest niezmienny po pierwszym wdrożeniu do App Store Connect.
* **Opcje:**
  * A) `com.apps4brew.sloik` (zorientowany na nazwę polską).
  * B) `com.apps4brew.preserves` (neutralny domenowo, odporny na zmiany marki).
* **Rekomendacja:** **B** (`com.apps4brew.preserves`). Zgodnie z zasadą przenośności ZP-15.

### **DEC-05 Domyślna metoda obliczania stężenia solanki w kalkulatorze (Masowa vs Wodna)**
* **Kontekst:** W kuchni domowej 90% ludzi popełnia błąd rozcieńczenia: wsypuje sól do litra wody (np. 3%), ale po wlaniu do słoika pełnego ogórków stężenie spada do 1.4%, co powoduje mięknięcie i psucie.
* **Opcje:**
  * A) Domyślnie laboratoryjna metoda całkowitej masy ($M_{\text{warzywa}} + M_{\text{woda}}$) z przełącznikiem na tradycyjną metodę wodną.
  * B) Domyślnie tradycyjna metoda wodna z ostrzeżeniem o rozcieńczeniu.
* **Rekomendacja:** **A**. Aplikacja ma uczyć profesjonalnego standardu i eliminować zepsute przetwory.

### **DEC-06 Bezwzględny rygor bezpieczeństwa Clostridium botulinum (Polityka niskiej kwasowości)**
* **Kontekst:** Laseczka jadu kiełbasianego rozwija się w warunkach beztlenowych przy $pH \ge 4.6$ i temperaturze pokojowej. Przetwory warzywne bez kwasu (fasolka, czosnek w oliwie) lub mięsa wekowane w garnku niosą ryzyko śmierci.
* **Opcje:**
  * A) Twardy strażnik bezpieczeństwa: aplikacja kategorycznie zabrania pasteryzacji wodnej dla produktów o $pH \ge 4.6$ i wymusza pasteryzację ciśnieniową (Pressure Canning) lub tyndalizację frakcjonowaną 3x24h.
  * B) Miękkie ostrzeżenie tekstowe z możliwością pominięcia.
* **Rekomendacja:** **A**. Zero kompromisów w kwestii zatrucia jadem kiełbasianym.

### **DEC-07 Wybór silnika bazy danych i architektury pamięci podręcznej ⚙**
* **Kontekst:** Architektura Apps4Brew wymaga 100% Offline-First i zerowego wycieku danych.
* **Opcje:**
  * A) Czysty lokalny SQLite z obsługą WAL (Write-Ahead Logging) i transakcyjnością.
  * B) AsyncStorage / MMKV bez relacji.
* **Rekomendacja:** **A**. Relacyjny model danych partii, słoików, składników i odczytów wymaga SQLite.

### **DEC-08 Dostępność (Accessibility) jako kontrakt od pierwszego commitu ⚙**
* **Kontekst:** Zgodnie ze standardem studia bariera dostępności blokuje wydanie.
* **Opcje:**
  * A) Pełna obsługa VoiceOver, minimalny touch target $44\times 44\,\text{pt}$ (w kuchni zalecane $56\times 56\,\text{pt}$ dla mokrych dłoni) oraz Dynamic Type do poziomu AX.
  * B) Podstawowa dostępność dodana w wersji 1.1.
* **Rekomendacja:** **A**.

---

## **Blok II — Tygodnie 1–2 (Architektura, Sensoryka, Pomiary)**

### **DEC-09 Zakres bazy typów naczyń i słoików na start**
* **Opcje:** A) 50 modeli (wszystkie warianty Weck, Twist-off, Mason, Fido, Kamionki). B) 25 najpopularniejszych modeli z możliwością definiowania naczynia własnego (Custom Jar).
* **Rekomendacja:** **B**. Użytkownik i tak najczęściej podaje pojemność w ml i typ zamknięcia.

### **DEC-10 Algorytm kompensacji przestrzeni nagłownej (Headspace)**
* **Opcje:** A) Stałe zalecenie 1.5 cm. B) Dynamiczne wyliczanie headspace na podstawie rozszerzalności termicznej produktu i zawartości pektyn/cukru (1.0 cm dla dżemów, 1.5 cm dla pikli, 2.5 cm dla pasteryzacji ciśnieniowej).
* **Rekomendacja:** **B**. Prawidłowy headspace zapobiega rozszczelnieniu i pękaniu słoików.

### **DEC-11 Obsługa pomiarów refraktometrem Brix i pH-metrem**
* **Opcje:** A) Ręczne wprowadzanie wartości z cyfrowym kompasem interpretacji. B) Automatyczny odczyt aparatem ze skal optycznych refraktometru.
* **Rekomendacja:** **A** w MVP, B do badań w 2.x.

### **DEC-12 Domyślny standard kwasowości octu w przepisach**
* **Opcje:** A) Standard polski (ocet spirytusowy 10%). B) Standard międzynarodowy (ocet jabłkowy/winny 5%). C) Automatyczny przelicznik mocy octu.
* **Rekomendacja:** **C**. Kluczowy element międzynarodowego sukcesu aplikacji.

### **DEC-13 Mechanika powiadomień o odgazowaniu („odbiciu” / burping)**
* **Opcje:** A) Stałe powiadomienie raz na 24h. B) Dynamiczny harmonogram adaptacyjny oparty na temperaturze otoczenia i fazie fermentacji (fermentacja burzliwa dni 1–4: co 12h, faza cicha dni 5–14: co 48h).
* **Rekomendacja:** **B**. Chroni słoiki przed eksplozją w upalne dni.

### **DEC-14–DEC-60 Podsumowanie pozostałych decyzji technicznych i operacyjnych:**
* **DEC-14 (Etykiety QR):** Generator wektorowych szablonów etykiet do druku domowego (formaty Avery, arkusze A4, etykiety 50x50 mm) z kodem URI `sloik://batch/<id>`. (Rekomendacja: MVP).
* **DEC-15 (Model przychodu):** 0.99 € miesięcznie / 4.99 € rocznie / 14.99 € dożywotnio (PL: 3.99 / 19.99 / 59.99 zł). Darmowy rdzeń z nielimitowanymi kalkulatorami, płatna spiżarnia powyżej 5 aktywnych partii i zaawansowany atlas mikroflory. (Rekomendacja: tak).
* **DEC-16 (Kopia zapasowa):** 100% darmowy eksport i import pełnego archiwum JSON oraz integracja z iCloud Drive użytkownika. Zgodnie z ZP-07. (Rekomendacja: tak).
* **DEC-17 (Języki):** 35 języków w architekturze i18n, start z polskim i angielskim o 100% pokryciu merytorycznym. (Rekomendacja: tak).
* **DEC-18 (Diagnostyk Troubleshooting):** Drzewo decyzyjne z 40 symptomami (biały nalot, zmętnienie, mięknięcie, ciemnienie czosnku na niebiesko/zielono, piana). (Rekomendacja: MVP).
* **DEC-19…DEC-60:** Szczegółowe parametry techniczne wdrożenia (interwały debounce, limity pamięci podręcznej zdjęć słoików, polityka braku SDK analitycznych stron trzecich, obsługa wag kuchennych Bluetooth w 1.2).

""")

print("00b Decisions written successfully.")

# 00c ERRATA & DOMAIN CONFLICTS
f00c = os.path.join(OUT_DIR, "Kiszonki BRD 0.1 · 00c Sprzeczności i errata (mikrobiologia, bezpieczeństwo USDA, botulinum, ocet vs laktofermentacja).md")
with open(f00c, "w", encoding="utf-8") as f:
    f.write("""# **Kiszonki, przetwory, słoiki BRD 0.1 — 00c Sprzeczności dziedzinowe i errata**

## **1. Rozstrzygnięcie kluczowych mitów i sprzeczności w przetwórstwie domowym**

W dziedzinie przetwórstwa i fermentacji wiedza potoczna („przepisy babci”, blogi kulinarne) zawiera krytyczne błędy fizykochemiczne i mikrobiologiczne. Aplikacja opiera się wyłącznie na recenzowanych źródłach naukowych (USDA Complete Guide to Home Canning, FDA Bacteriological Analytical Manual, publikacje FAO). Poniżej zestawiono oficjalne rozstrzygnięcia sprzeczności.

---

### **ERR-01: Procent stężenia solanki — Woda vs Całkowita masa naczynia**
* **Sprzeczność w literaturze:** Część poradników podaje „zrób solankę 3% rozpuszczając 30 g soli w 1 l wody”. Inne źródła (np. Noma Guide to Fermentation) nakazują ważyć warzywa wraz z wodą i dawać 2.0%–2.5% soli od wagi łącznej.
* **Rozstrzygnięcie merytoryczne:** Po wlaniu solanki do słoika zachodzi **osmoza**. Warzywa (zawierające 90–95% wody) oddają wodę do roztworu, a sól dyfunduje do tkanek warzywa. W słoiku o pojemności 1000 ml mieści się ok. 600 g ogórków i ok. 400 g wody. Jeśli w 400 g wody rozpuścimy 12 g soli (stężenie w wodzie = 3.0%), to po osiągnięciu stanu równowagi osmotycznej całkowita masa wynosi 1000 g, a stężenie soli w całej objętości spada do **1.2%**. Stężenie 1.2% jest zbyt niskie, sprzyja enzymatycznemu mięknięciu ogórków i rozwojowi drożdży kożuchujących.
* **Zasada w aplikacji:** Aplikacja domyślnie stosuje **metodę całkowitej masy** ($M_{\text{warzywa}} + M_{\text{woda}}$). Dla tradycjonalistów oferuje tryb „Klasyczna solanka zalewowa”, ale wyświetla dokładny kalkulator stanu równowagi osmotycznej po 48h.

---

### **ERR-02: Granica bezpieczeństwa jadu kiełbasianego — pH 4.6 vs pH 4.5 vs pH 4.0**
* **Sprzeczność:** W części polskich poradników pojawia się wartość pH 4.5 lub 4.0 jako wymóg bezpieczeństwa.
* **Rozstrzygnięcie merytoryczne:** Zgodnie z oficjalnymi normami FDA (21 CFR Part 114) oraz USDA, granicą wzrostu i produkcji toksyny botulinowej przez *Clostridium botulinum* jest **pH 4.60**. Jednak ze względu na błędy pomiarowe domowych pasków wskaźnikowych i nieskalibrowanych pH-metrów (dryf elektrody), aplikacja przyjmuje:
  * $pH \le 4.20$: strefa w pełni bezpieczna (zielona).
  * $4.21 \le pH < 4.60$: strefa ostrzegawcza (żółta — zalecana ostrożność, ponowny pomiar lub dodatek kwasu).
  * $pH \ge 4.60$: strefa niebezpieczna dla przetworów beztlenowych (czerwona — bezwzględny zakaz zamykania bez sterylizacji ciśnieniowej lub tyndalizacji).

---

### **ERR-03: Pasteryzacja w piekarniku („na sucho”) vs Pasteryzacja w kąpieli wodnej**
* **Sprzeczność:** Wiele osób pasteryzuje słoiki w piekarniku elektrycznym, uważając to za wygodniejszą metodę.
* **Rozstrzygnięcie merytoryczne:** Powietrze ma wielokrotnie mniejszą pojemność cieplną i przewodność niż woda. Penetracja ciepła w suchym piekarniku trwa 2.5–3 razy dłużej niż w kąpieli wodnej. Co gorsza:
  * Uszczelki gumowe w słoikach typu Weck ulegają degradacji termicznej w suchym powietrzu powyżej $100^\circ\text{C}$.
  * Wieczka typu Twist-off z uszczelką plastizolową tracą elastyczność i mogą wydzielać niepożądane substancje przy przegrzaniu.
  * Ciśnienie wewnątrz słoika w suchym piekarniku rośnie gwałtownie, grożąc pęknięciem szkła z powodu braku zewnętrznego ciśnienia hydrostatycznego.
* **Zasada w aplikacji:** Aplikacja rekomenduje jako standard złoty kąpiel wodną (lub sous-vide). Pasteryzacja w piekarniku jest oznaczona jako metoda alternatywna o podwyższonym ryzyku, z automatycznym wydłużeniem wymaganego czasu procesu o 150%.

---

### **ERR-04: Kożuch fermentacyjny (drożdże Kahm) vs Pleśń mikotoksynowa**
* **Sprzeczność:** Użytkownicy widząc jakikolwiek biały nalot na powierzchni kiszonki wpadają w panikę i wyrzucają cały nastaw, albo przeciwnie — zdejmują zieloną pleśń łyżką i jedzą resztę, narażając się na rakotwórcze mikotoksyny (aflatoksyny, patulinę).
* **Rozstrzygnięcie merytoryczne:**
  * **Drożdże kożuchujące (Kahm yeast / Pichia, Candida, Debaryomyces):** tworzą cienką, matową, białą lub kremową błonę o strukturze siatki, pajęczyny lub drobnych pofałdowań. Są nieszkodliwe dla zdrowia, ale psują smak i podnoszą pH, co w dłuższej perspektywie może umożliwić rozwój patogenów. Należy je zebrać wyparzoną łyżką.
  * **Pleśnie (Molds / Penicillium, Aspergillus, Mucor):** tworzą puszysty, aksamitny nalot o charakterze „meszku”, często w kolorze zielonym, niebieskim, czarnym lub śnieżnobiałym, z widocznymi zarodnikami wznoszącymi się ponad powierzchnię cieczy. Strzępki grzybni penetrują całą objętość słoika.
* **Zasada w aplikacji:** Moduł Diagnostyka (Troubleshooting Doctor) zawiera fotograficzny klucz różnicowania. W przypadku podejrzenia pleśni aplikacja bezwzględnie nakazuje utylizację całej zawartości słoika.

---

### **ERR-05: Zielenienie i niebieszczenie czosnku w kiszonkach i marynatach**
* **Sprzeczność:** Klienci często sądzą, że niebieski lub zielony czosnek w słoiku z ogórkami lub octem jest trujący lub skażony chemią.
* **Rozstrzygnięcie merytoryczne:** W środowisku kwasowym enzym allinaza reaguje ze związkami siarki i aminokwasami, tworząc naturalne pigmenty pirolowe (podobne do chlorofilu i antocyjanów). Zjawisko to jest w 100% naturalne i bezpieczne (w Chinach celowo wytwarza się zielony czosnek Laba na Nowy Rok).
* **Zasada w aplikacji:** Diagnostyk klasyfikuje to jako zjawisko w 100% bezpieczne, eliminując niepotrzebne marnowanie żywności.

""")

print("00c Errata written successfully.")
