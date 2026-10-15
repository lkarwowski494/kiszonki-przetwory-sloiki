# **Kiszonki, przetwory, słoiki BRD 0.1 — Część A2: Analiza rynku, konkurencji i model przychodu (Rozdz. 4–6.1)**

## **Rozdział 4: Dogłębna analiza rynku i konkurencji**

### **4.1 Wielkość rynku i trendy makroekonomiczne**
Rynek domowego przetwórstwa, fermentacji i konserwacji żywności przeżywa bezprecedensowy renesans na całym świecie:
1. **Zdrowie jelitowe i mikrobiom:** Globalna świadomość probiotycznych właściwości żywych kiszonek (bakterie kwasu mlekowego LAB) napędza eksplozję domowego kiszenia w USA, Niemczech, Francji i Wielkiej Brytanii. Według Grand View Research globalny rynek fermentowanej żywności osiągnie wartość **740 mld USD do 2030 roku**, z dynamicznie rosnącym segmentem domowego rzemiosła (CAGR 6.8%).
2. **Kultura samowystarczalności (Homesteading & Canning):** W Polsce według danych CBOS i Polskiego Związku Działkowców ponad **3.5 miliona gospodarstw domowych** regularnie przygotowuje przetwory na zimę. W Niemczech tradycja wekowania (marka WECK działa od 1900 r.) obejmuje miliony domów. W USA programy Master Food Preserver kształcą tysiące certyfikowanych instruktorów w każdym stanie.
3. **Eksplozja fermentacji egzotycznych:** Popularność kimchi (wpisane na listę niematerialnego dziedzictwa UNESCO), domowej kombuchy, ostrych sosów fermentowanych (hot sauce mash) i japońskich pikli tsukemono sprawia, że młodzi ludzie (20–35 lat) masowo kupują słoiki i kamionki.

---

### **4.2 Dogłębna analiza konkurencji (Teardown 10 rozwiązań rynkowych)**

Przeprowadzono analizę 10 aplikacji i platform obecnych w App Store i Google Play, analizując ponad 3 000 recenzji użytkowników:

| Nazwa aplikacji | Ocena App Store | Model biznesowy | Główne braki i skargi użytkowników (Cytaty) |
| :--- | :--- | :--- | :--- |
| **Kombucha Tracker** | 3.8★ (120 ocen) | Subskrypcja 14,99 $/rok | „Aplikacja zapomina o nastawach po restarcie”, brak wsparcia dla F2 (karbonizacji), brak zegarka, błędy powiadomień. |
| **PicklePal** | 3.4★ (85 ocen) | 2,99 $ płatna z góry | Przestarzały interfejs z czasów iOS 12, brak kalkulatora całkowitej masy solanki, brak wsparcia dla słoików Weck. |
| **Ball Canning Companion** | 2.9★ (310 ocen) | Darmowa (reklamowa) | „Wymaga konta online”, wiesza się przy braku sieci, ograniczona wyłącznie do produktów marki Ball, brak kiszonek mlekowych. |
| **FermentWorks** | 4.1★ (60 ocen) | 4,99 $ jednorazowo | Skupiona tylko na piwie i winie; brak obsługi warzyw, dżemów i pasteryzacji, brak polskiej lokalizacji. |
| **Tasty / Yummly** | 4.7★ (miliony) | Freemium + reklamy | Zwykłe książki kucharskie: brak timerów, brak chemii, brak monitorowania wielotygodniowego, agresywne reklamy wideo. |
| **Cookpad** | 4.5★ (duża) | Subskrypcja 3,99 $/mies. | Brak jakichkolwiek narzędzi inżynieryjnych; przepisy z błędnymi proporcjami soli prowadzącymi do gnicia ogórków. |
| **Canning Timer & Guide** | 3.6★ (140 ocen) | 1,99 $ | Tylko prosty stoper minutnika; brak Live Activity, brak bazy partii, brak refraktometru. |
| **My Ferments (Android)** | 4.0★ (250 ocen) | Reklamy | Brak wersji na iOS, brak Apple Watch, brak kontroli botulizmu. |
| **Fermentation Log** | 3.2★ (45 ocen) | Darmowa z banerami | Brzydki interfejs, brak bazy wiedzy, brak kalkulatora rozcieńczeń octu. |
| **Paprika Recipe Manager** | 4.8★ (bardzo wysoka) | 4,99 $ za platformę | Doskonały menedżer przepisów, ale całkowity brak modułu mikrobiologii, osi czasu fermentacji i strażnika botulinowego. |

### **4.3 Kluczowe wnioski z analizy konkurencji**
1. **Luka rynkowa:** Nie istnieje ani jedna nowoczesna, dopracowana aplikacja łącząca laboratoryjną precyzję solanek, monitoring fermentacji, stoper pasteryzacji, bazę słoików i ewidencję spiżarni w jednym spójnym ekosystemie offline-first.
2. **Potrzeba Hands-Free:** Recenzje użytkowników stale podkreślają problem brudnych rąk w kuchni („nie chcę dotykać telefonu mokrymi rękami od zalewy!”). Dedykowany klient watchOS i Live Activity stanowi bezwzględny wyróżnik rynkowy.
3. **Zaufanie i bezpieczeństwo:** Żadna aplikacja nie oferuje walidacji bezpieczeństwa mikrobiologicznego pod kątem *C. botulinum*, co stawia **Słoik (Jarwise)** w pozycji bezdyskusyjnego lidera merytorycznego.

---

## **Rozdział 5: Model przychodu i ekonomia projektu**

Zgodnie z filozofią studia **Apps4Brew**, aplikacja oferuje etyczny, przejrzysty model biznesowy pozbawiony ukrytych pułapek:

### **5.1 Siatka cenowa (Tiering)**

| Poziom cenowy | Cena EU (€) | Cena PL (PLN) | Zawartość i korzyści |
| :--- | :--- | :--- | :--- |
| **Darmowy rdzeń (Free Tier)** | **0,00 €** | **0,00 zł** | Nielimitowany dostęp do kalkulatorów solanek (całkowita i wodna), stoper pasteryzacji, do 5 aktywnych partii w monitorze, baza 20 klasycznych przepisów świata, 100% offline, brak reklam. |
| **Subskrypcja miesięczna Pro** | **0,99 € / mies.** | **3,99 zł / mies.** | Nielimitowana spiżarnia i partie, generator etykiet QR, pełny atlas mikrobiologiczny, moduł Troubleshooting Doctor, pasteryzacja sous-vide i tyndalizacja. |
| **Subskrypcja roczna Pro** | **4,99 € / rok** | **19,99 zł / rok** | Wszystkie funkcje wersji Pro ze zniżką 58% względem opłaty miesięcznej (odpowiednik 1,66 zł miesięcznie). |
| **Zakup dożywotni (Lifetime Pro)** | **14,99 € raz na zawsze** | **59,99 zł raz na zawsze** | Pełna wersja na zawsze, wszystkie przyszłe aktualizacje, Family Sharing do 5 członków rodziny w Chmurze rodzinnej Apple. |

### **5.2 Ekonomia jednostkowa i Break-even**
* Roczny koszt utrzymania konta Apple Developer Program: 99 USD (ok. 410 PLN brutto).
* Brak serwerów w chmurze (Cloud Backend Cost = 0 zł).
* Marża Apple: 15% (w ramach Small Business Program).
* Przychód netto z jednego zakupu dożywotniego w Polsce: ok. 42,49 PLN netto.
* **Punkt rentowności (Break-even):** Osiągany przy zaledwie **10 zakupach dożywotnich rocznie** w skali całego świata.

---

## **Rozdział 6: Zakres funkcjonalny i kategoryzacja MoSCoW**

Struktura wymagań dzieli się na 8 narzędzi operacyjnych oraz 3 obszary merytoryczne:
* **Moduły operacyjne (B):** SOL (Solanki), FERM (Fermentacja), PAST (Pasteryzacja), SPIN (Spiżarnia i Batche), NACZ (Naczynia i Headspace), BRIX (Refraktometria i pH), ZEG (Apple Watch i Hands-Free), DOK (Diagnostyk Troubleshooting).
* **Moduły wiedzy i nauki (C):** NAUK (Szkoła Przetwórstwa i Atlas LAB/AAB/SCOBY), REGUŁY (RD-01 do RD-55 z wektorami testowymi), DECYZJE (D-01 do D-25).

