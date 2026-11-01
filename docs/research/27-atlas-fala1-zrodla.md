> **Status (01.11.2026):** raport Badacza merytorycznego (agent). Traktować jako opinię, dopóki cytaty nie zostaną sprawdzone u źródła.
> - Cytaty [PDF] są dosłowne: wyciągnięte narzędziem `pdftotext`.
> - Cytaty [WF] przeszły przez model pośredniczący. Przed publikacją każdy trzeba porównać ze stroną źródłową.
>
> **Sprawdzone ręcznie 01.11.2026** (pobrany HTML strony nchfp.uga.edu, zgodne):
> 1. „Do not attempt to make sauerkraut or fermented pickles by cutting back on the salt required.” (General Information on Fermenting)
> 2. pH startera kombuchy: „If the pH is 4.0 OR LESS, proceed… If the pH is GREATER THAN 4.0 do not make kombucha” (Kombucha Tea)
> 3. Fermentacja kombuchy: „at room temperature (68° - 77°F) for 7 – 10 days” (Kombucha Tea)

# Atlas kiszonek, fala 1: przegląd źródeł bezpieczeństwa

Rola: Badacz merytoryczny. Data: 2026-11-01. Wynik tylko do odczytu, niczego nie commitowano.

## 0. Jak czytać ten plik

- **Szczeble** (hierarchia z zlecenia): 1 = urzędowe/pierwotne (NCHFP/USDA, CDC, FDA/CFR, Codex, urzędy stanowe), 2 = recenzowane publikacje (PubMed/PMC, czasopisma), 3 = extension services uczelni, 4 = popularne ze źródłami, 5 = Wikipedia (nieużywana).
- **Wiarygodność cytatów.** Są dwa rodzaje:
  - **[PDF]**: tekst wyciągnąłem sam z pobranego PDF (`pdftotext`). Cytat jest dosłowny.
  - **[WF]**: cytat pochodzi ze strony HTML przeczytanej przez WebFetch, który podaje treść przez model pośredniczący. Cytaty proszono „word-for-word”, ale **przed publikacją na stronie trzeba je sprawdzić ręcznie na stronie źródłowej**. Bezpośrednie pobranie HTML (curl) było dla części stron niemożliwe.
- Wszystkie strony z listy źródeł zostały faktycznie pobrane w tej sesji. Wyniki wyszukiwarki posłużyły tylko do znalezienia adresów. Nie ma tu twierdzeń, które pochodzą wyłącznie z wyszukiwarki; takie miejsca oznaczono jako otwarte pytania.
- Jednostki USA podaję tak jak w źródle. Przeliczenia °F→°C są arytmetyczne, zaokrąglone do 1 °C. Przeliczenia „łyżek soli” na gramy **nie** są wykonane, bo żadne przeczytane źródło nie podaje gęstości nasypowej soli (zob. otwarte pytania).

---

## 1. Granica: kiszenie (laktofermentacja) a wekowanie/pasteryzacja oraz *Clostridium botulinum*

To jest fundament dla wszystkich kart. Każda karta powinna mieć wyraźny podział na **fazę fermentacji** (bezpieczeństwo daje sól, kwas mlekowy i warunki beztlenowe pod solanką) i **opcjonalną fazę utrwalania** (wekowanie w kąpieli wodnej według przetestowanych czasów albo przechowywanie w lodówce).

| Teza | Źródło (szczebel) | Cytat |
|---|---|---|
| Definicja żywności kwaśnej: pH ≤ 4,6 | 21 CFR 114.3(a), https://www.law.cornell.edu/cfr/text/21/114.3 (1) [WF] | "Acid foods means foods that have a natural pH of 4.6 or below." |
| Część 114 (żywność zakwaszona) dotyczy dodanego kwasu, nie fermentacji. Wyłącza żywność chłodzoną | j.w. (1) [WF] | "Acidified foods means low-acid foods to which acid(s) or acid food(s) are added;" … "and foods that are stored, distributed, and retailed under refrigeration" … "are excluded from the coverage of this part." |
| Kwasowość chroni przed jadem kiełbasianym | NCHFP, General information on fermenting, https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/general-information-on-fermenting/ (1) [WF] | "There must be a minimum, uniform level of acid throughout the mixed product to prevent the growth of botulinum bacteria." |
| Nie zmniejszać soli w kiszonkach | j.w. (1) [WF] | "Caution: Do not attempt to make sauerkraut or fermented pickles by cutting back on the salt required." |
| Żywność niskokwasowa wymaga sterylizacji ciśnieniowej | CDC, Botulism prevention, https://www.cdc.gov/botulism/prevention/index.html (1) [WF] | "Pressure canning is the only recommended method for canning low-acid foods." / "Low acid-foods include all fresh vegetables, figs, meats, poultry, fish, seafood, and some tomatoes." |
| Fermentowane ryby i zwierzęta wodne to główne źródło botulizmu na Alasce | j.w. (1) [WF] | "In Alaska, most cases of foodborne botulism have been caused by fermented fish and other aquatic animals." |
| Czosnek i zioła w oleju | j.w. (1) [WF] | "Refrigerate homemade oils made with garlic or herbs. Throw the oils away after 4 days." |
| Ukiszone produkty można wekować według tabel NCHFP | NCHFP Sauerkraut / Dill Pickles (1) [WF] | kapusta: hot pack, słoiki pint/quart, 0–1000 ft: 10/15 min; raw pack 20/25 min. Ogórki: raw pack 10 (pint) / 15 (quart) min. "Canning fully fermented pickles is a better way to store them." |
| Pasteryzacja niskotemperaturowa (tylko gdy przepis ją przewiduje) | NCHFP, Low-temperature pasteurization, https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/low-temperature-pasteurization-treatment/ (1) [WF] | "Heat the water enough to maintain 180º to 185º F water temperature for 30 minutes." (82–85 °C) / "Caution: Use only when recipe indicates." |
| Nabiał ma osiągnąć pH ≤ 4,6 w ciągu 48 h | USU Extension, Tips to Safely Ferment at Home, https://extension.usu.edu/preserve-the-harvest/research/tips-to-safely-ferment-at-home (3) [WF] | "Dairy products must reach a pH of 4.6 or less within 48 hours to be considered pathogen-free." |
| pH 4,60 jako kryterium gotowości kiszonki | UMN Extension, Fermentation, https://extension.umn.edu/food-safety-basics/fermentation (3) [WF] | "When a pH of 4.60 or lower is reached and bubbling has stopped, the ferment is ready." |

**Wnioski dla atlasu:**
1. Żadne przeczytane źródło nie mówi wprost, że „poprawnie ukiszone warzywa nie niosą ryzyka botulizmu”. Źródła mówią tylko, że wystarczająca i równomierna kwasowość hamuje *C. botulinum*. Na stronie nie wolno pisać „kiszonki są wolne od botulizmu”. Bezpieczna forma: „bezpieczeństwo zależy od tego, czy cała zawartość zakwasi się równomiernie; dlatego nie zmniejszamy soli i trzymamy warzywa pod solanką”.
2. pH 4,6 to granica urzędowa. Próg 4,2 to praktyka regulacyjna dla kombuchy (NY, zob. kombucha), a nie norma dla kiszonek warzywnych.
3. Ryby, owoce morza i czosnek w oleju to strefa wysokiego ryzyka. Karta kimchi z dodatkiem fermentowanych owoców morza wymaga osobnego ostrzeżenia (zob. otwarte pytania).

---

## 2. Kandydatki

### 2.1 Kapusta kiszona (sauerkraut): wystarczalność **TAK**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | NCHFP, Sauerkraut, https://nchfp.uga.edu/how/ferment/recipes/sauerkraut/ [WF] | 1 | Sól: "3/4 cup canning or pickling salt" na 25 lbs kapusty; "add 3 tablespoons of salt" na 5 lb. Temperatura: "the USDA recommendation is to store at 70º to 75ºF while fermenting" (21–24 °C), 3–4 tyg.; 60–65 °F (16–18 °C) 5–6 tyg.; "At temperatures lower than 60ºF, kraut may not ferment." "Above 75ºF, kraut may become soft." Przechowywanie: "Fully fermented kraut may be kept tightly covered in the refrigerator for several months." |
| 2 | Univ. of Wisconsin-Extension, B2087 *Make Your Own Sauerkraut* (Mennes, rev. 1994), https://oc4h.ucanr.edu/sites/default/files/2020-12/341219.pdf [PDF] | 3 | "Add 2.25 to 2.5 percent salt by weight" / "Using too little salt not only softens the cabbage tissue, but also yields a product lacking in flavor. Too much salt delays the natural fermentation and, depending on the degree of oversalting, may cause an acrid flavor, darken the color or allow pink pigment-producing yeasts to grow." / "Note: It is absolutely essential that you cover the cabbage and liquid to exclude air" / sód: "about l.5 grams (1,500 mg.) sodium per cup" |
| 3 | Oregon State Univ. Ext., SP 50-745 *Sauerkraut: Problems and solutions* (rev. 01.2025), https://extension.oregonstate.edu/food/preservation/sauerkraut-problems-solutions-sp-50-745 [WF] | 3 | "Insufficient salt (less than 1.7% concentration)" (przyczyna miękkiej kapusty); "Slimy kraut (indicates spoilage; discard kraut)"; "Pink kraut (safe unless slimy)"; "Discard the batch if large amounts of mold are visible."; "Soft kraut (poor quality but safe if it has a clean, acid aroma and taste)" |
| 4 | UC Master Food Preservers Humboldt/Del Norte, handout, https://class.ucanr.edu/sites/default/files/2020-11/339529.pdf [PDF] | 3–4* | "salt is applied at 2 – 2.5% in relation to the weight of the sliced cabbage. Decreasing salt levels will create quality problems, going below 1.5% will rot the cabbage." / "Fermented sauerkraut exhibits pH at around 3.5" |

\* Część „Sauerkraut Fermentation” w tym handoucie nie ma podanego autora tekstu, więc traktuję ją jako uzupełniającą.

- **Dlaczego TAK:** jest przetestowany przepis szczebla 1 z temperaturą, czasem i wekowaniem oraz procent wagowy soli ze szczebla 3. Objawy zepsucia są jasno opisane w OSU i Wisconsin.
- **Sprzeczności:**
  - Czasy wekowania: NCHFP hot pack 10 min (pint) / 15 min (quart) a Wisconsin 1994 15/20 min. **Wygrywa NCHFP** (szczebel 1, nowszy).
  - Przechowywanie: NCHFP podaje lodówkę „several months”, a Wisconsin 1994 dopuszcza kamionkę w chłodnej piwnicy „indefinitely as long as the top surface is not exposed to air”. Część wspólna: chłód i powierzchnia pod solanką. Na karcie podać wariant NCHFP.
  - Dolny próg soli: OSU <1,7% (miękkość), UC <1,5% (gnicie), Wisconsin zalecenie 2,25–2,5%. Część wspólna: **zalecać 2,25–2,5% wagowo**. Wartości 1,5–1,7% to granica jakości według szczebla 3, a nie przetestowany próg bezpieczeństwa.
- **Kto ostrożnie:** osoby na diecie niskosodowej (Wisconsin, sód w porcji).
- **Granica kiszenie/wekowanie:** fermentacja w 21–24 °C, potem lodówka **albo** wekowanie w kąpieli wodnej według tabeli NCHFP. Wekowanie jest opcjonalne i zmienia produkt (nie ma już żywych kultur; to wniosek z definicji pasteryzacji, bez źródła, więc na stronie sformułować ostrożnie albo pominąć).

### 2.2 Ogórki kiszone (laktofermentacja w solance): wystarczalność **TAK dla przepisu NCHFP; NIE dla polskiego wariantu ~2%**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | NCHFP, Dill Pickles, https://nchfp.uga.edu/how/ferment/recipes/dill-pickles/ [WF] | 1 | Na galon pojemności: "4 lbs of 4-inch pickling cucumbers", "1/2 cup salt", "1/4 cup vinegar (5 percent)", "8 cups water". "Store where temperature is between 70ºF and 75ºF for about 3 to 4 weeks while fermenting." "Temperatures of 55º to 65ºF are acceptable, but the fermentation will take 5 to 6 weeks." "Avoid temperatures above 80ºF, or pickles will become too soft during fermentation." "Check the container several times a week and promptly remove surface scum or mold." "Caution: If the pickles become soft, slimy, or develop a disagreeable odor, discard them." "Fully fermented pickles may be stored in the original container for about 4 to 6 months" (w lodówce) |
| 2 | NCHFP, Causes and possible solutions for problems with fermented pickles (1) [WF] | 1 | "Soft or slippery pickles. (If spoilage is evident, do not eat.)" / przyczyna "Salt brine too weak during fermentation." / "Blossom ends not removed from cucumbers." → "Slice at least 1/16th inch off blossom end of cucumbers and discard." / "White sediment in jar." → "Bacteria cause this during fermentation." / "If brass, copper or zinc utensils and brining equipment were used, do not use pickles." |
| 3 | Penn State Ext., *Fermenting Dill Pickles* (Hirneisen, akt. 25.06.2026), https://extension.psu.edu/fermenting-dill-pickles [WF] | 3 | "temperature between 70°-75°F is ideal" / "If the temperature is higher, spoilage is more likely." / "Do not omit or reduce the amount of ingredients such as vinegar or salt." / "Discard pickles if they become soft, slimy or develop a bad odor." / "Refrigerate up to 6 months." |
| 4 | McMurtrie, Johanningsmeier, Breidt, Price, *J. Food Sci.* 84(5), 2019, doi:10.1111/1750-3841.14600 (USDA-ARS), https://ars.usda.gov/ARSUserFiles/60702500/Fermented%20Veg%20Manuscripts/p428.pdf [PDF] | 2 | "Current commercial practice for the bulk preservation of cucumbers as pickles utilizes the microbiota present on the cucumbers for a natural fermentation. As such, brines that equilibrate to at least 5% sodium chloride (0.86 M NaCl) are used to select for lactic acid bacteria (LAB) and inhibit salt-sensitive spoilage" (dotyczy skali przemysłowej) |

- **Dlaczego tak i nie zarazem:** jedyny przetestowany przepis domowy szczebla 1 (NCHFP) to fermentacja **3–4 tygodnie z dodatkiem octu 5%** i solanką podaną objętościowo. Polskie ogórki kiszone (2–2,5%, bez octu) i małosolne (48–72 h) **nie mają w przeczytanych źródłach przetestowanego odpowiednika**. Przemysł stosuje ≥5% NaCl w równowadze.
- **Sprzeczności:** zob. sekcję 3 (BRD). Między źródłami: dolna temperatura NCHFP 55 °F (13 °C) dla ogórków, a dla kapusty 60 °F. To różne produkty, więc nie ma sprzeczności, tylko trzeba to rozróżnić na kartach.
- **Uwaga o occie:** dodatek octu w przepisie NCHFP jest częścią przetestowanej receptury. Nie jest to „ogórek konserwowy”, bo produkt nadal fermentuje 3–4 tygodnie. Karta musi to wyjaśniać, żeby nie pomylić go z marynatą octową.

### 2.3 Kimchi: wystarczalność **TAK (z ostrzeżeniami)**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | Codex Standard for Kimchi, CODEX STAN 223-2001, https://www.fao.org/input/download/standards/365/CXS_223e.pdf [PDF] | 1 | "Salt (sodium chloride) content   1.0 ~ 4.0% m/m"; "Total acidity (as lactic acid)   not more than 1.0% m/m"; definicja: "fermented before or after being packaged into appropriate containers to ensure the proper ripening and preservation of the product by lactic acid production at low temperatures." |
| 2 | UGA Extension, C1362 *Homemade Kimchi: A Science-Based Guide to Safe Fermentation* (Mahida i in., 05.08.2025), https://fieldreport.caes.uga.edu/publications/C1362/ [WF] | 3 | "The jars should then be loosely covered and left at room temperature for the first 48 hr." / "After approximately 2 weeks, the fermentation process leads to a sufficiently acidic environment—a pH below 4.6" / "Maintaining a storage temperature of 41 °F or below helps ensure both the safety and quality of the final product" (≤5 °C) / "If any of these signs are observed, discard the kimchi to prevent potential foodborne illness." / alergeny: sos rybny, pasta krewetkowa, sezam |
| 3 | Colorado State Univ. Ext., *Understanding and Making Kimchi* (2020), https://ccfruitandnuts.ucanr.edu/sites/default/files/2023-05/384790.pdf [PDF] | 3 | "the final salt concentration ranges from 2-5%." / "results in an optimum kimchi pH of 4.2." / "Kimchi ferments at room temperature in only 1-2 days or more slowly in the refrigerator. For safety, kimchi should be stored refrigerated and is best eaten within 1 week" / "Do not use metal containers nor earthenware with cracks or chips." / "Discard if you observe indications of surface mold." |
| 4 | Park i in., *Epidemiology and Health* 2025, norowirus i kimchi, https://pmc.ncbi.nlm.nih.gov/articles/PMC12869137/ [WF] | 2 | "fermentation does not guarantee complete viral inactivation." (862 przypadki w 24 szkołach; źródło: kimchi z zakładu) |

- **Dlaczego TAK:** jest norma Codex (sól, kwasowość), poradnik uczelniany z 2025 r. z temperaturą i czasem oraz dowody ognisk zakażeń, które uzasadniają ostrzeżenia o higienie surowców.
- **Sprzeczności:**
  - Sól: Codex 1,0–4,0% m/m a CSU 2–5%. Część wspólna **2–4%**.
  - Czas przechowywania: CSU „best eaten within 1 week” a OSU (Ask Extension, 08.2023, https://extension.oregonstate.edu/ask-extension/featured/my-kimchi-safe-eat [WF]) "will keep in the refrigerator for months and keep fermenting". Obie to szczebel 3. Na karcie: przechowywać w lodówce; jakość spada z czasem; zakresu nie rozstrzygam.
  - pH: CSU podaje optimum 4,2, a UGA pH <4,6 po około 2 tygodniach. To nie jest sprzeczność, tylko różne wartości (optimum smakowe a próg).
- **Ryzyka szczególne:** surowe składniki i ręce pracowników (norowirus, *E. coli*). Fermentacja nie unieszkodliwia wirusów. Alergeny z owoców morza i sezamu. Fermentowane owoce morza: patrz otwarte pytania.

### 2.4 Kombucha: wystarczalność **TAK (karta z rygorystycznymi ostrzeżeniami)**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | NCHFP, Kombucha Tea, https://nchfp.uga.edu/how/ferment/recipes/kombucha-tea/ [WF] | 1 | "If the pH is 4.0 OR LESS, proceed …" / "If the pH is GREATER THAN 4.0 do not make kombucha with the starter liquid." / "allow the kombucha to ferment at room temperature (68° - 77°F) for 7 – 10 days." (20–25 °C) / "Submerge cleaned equipment in hot water (at least 171°F) for at least 30 seconds to sanitize." / "Storing kombucha in airtight containers can cause the accumulation of CO2 (carbonation)" … "potentially leading to an explosion if not regularly monitored." |
| 2 | CDC MMWR 44(48), 1995, *Unexplained Severe Illness Possibly Associated with Consumption of Kombucha Tea — Iowa*, https://www.cdc.gov/mmwr/preview/mmwrhtml/00039742.htm [WF] | 1 | "it should not be prepared or stored in containers made from materials such as ceramic or lead crystal." / "When prepared as directed, the pH of the tea decreases to 1.8 in 24 hours." / "Drinking this tea in quantities typically consumed (approximately 4 oz daily)" / "the potential health risks are unknown for those with preexisting health problems." / brak związku przyczynowego: "did not establish a causal link…" |
| 3 | NY State Dept. of Agriculture & Markets, Kombucha processing, https://agriculture.ny.gov/food-safety/kombucha-processing [WF] (regulacja dla zakładów) | 1 | "Test to ensure the pH of the of the product is below 4.2 but greater than or equal to 2.5." / "Kombucha with a pH of below 2.5 or that tastes especially acidic should not be offered to consumers." / "When the fermentation is allowed to continue beyond 10 days, acidity may rise to levels potentially harmful to consumers." / starter: "approximately 100 ml/L (10%) of fresh-fermented kombucha" / "Discard all kombucha that is showing signs of mold contamination." |
| 4 | UGA Extension C1312 *What's the Word on Homemade Kombucha?* (2024, rev. 10.04.2026), https://fieldreport.caes.uga.edu/publications/C1312/ [WF]; Phan i in., *Med J Aust* 1998;169:644–6, PMID 9887919, https://pubmed.ncbi.nlm.nih.gov/9887919/ [WF] | 3 / 2 | UGA: "it is crucial not to use fermentation or storage containers made of materials like glazed earthenware," / "Current evidence suggests that consuming up to 4 fluid ounces of kombucha per day is considered safe…" / przeciwwskazania: "a susceptibility to acidosis, a weakened immune system, or by pregnant and/or lactating individuals" / "If you see dry, fuzzy patches on your SCOBY and/or the liquid surface…" (pleśń, wyrzucić). Phan: "We report two cases of symptomatic lead poisoning requiring chelation therapy in a married couple" … "brewing the tea in a ceramic pot." |

- **Dlaczego TAK:** są trzy źródła szczebla 1 i opis przypadków (zatrucie ołowiem, kwasica). Da się podać twarde liczby: pH startera ≤4,0, fermentacja 7–10 dni w 20–25 °C, docelowo pH <4,2 i ≥2,5, porcja do ok. 120 ml dziennie, wyłącznie szkło (nie ceramika i nie kryształ ołowiowy).
- **Sprzeczności:**
  - Alkohol: CDC "can contain up to 1.5% alcohol" (próbki 0,7–1,3%), USU Extension "Homemade Kombucha contains about 3% alcohol" (szczebel 3), UGA ostrzega przed przekroczeniem 0,5%. **Wygrywa CDC** (szczebel 1) jako wartość zmierzona. Na karcie: „może zawierać alkohol, nawet ponad 1%; nie dla osób, które muszą unikać alkoholu”.
  - pH: NCHFP podaje próg startera 4,0, NY próg produktu <4,2. To różne punkty procesu, nie sprzeczność.
- **Ryzyka szczególne:** ołów z glazurowanej ceramiki (kwaśny napój wypłukuje ołów), nadmierna kwasowość przy przedłużonej fermentacji (CDC: przypadek z wydłużeniem z 7 do 14 dni), wybuch butelek przy F2, pleśń na SCOBY, przeciwwskazania (ciąża i karmienie, obniżona odporność, skłonność do kwasicy).

### 2.5 Water kefir (tibicos): wystarczalność **NIE (na kartę z instrukcją)**; **CZĘŚCIOWO (karta informacyjna)**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | Bozkir, Yilmaz, Sharma, Esatbeyoglu, Ozogul, *Heliyon* 10(13):e33501, 2024, https://pmc.ncbi.nlm.nih.gov/articles/PMC11259891/ [WF] | 2 | "usually 6–10 % sucrose and 6–20 % grains are used" / "The optimum temperature of fermentation varies between 20 and 25 °C for 24–72 h" / "The final pH is generally measured at about 3.5–4.5 and the alcohol content is below 1 %" / "Improperly prepared or stored water may be contaminated with undesired bacteria, molds, or other pathogens." / "the literature does not have serious health risks associated with water kefir," |

- **Dlaczego NIE:** nie znalazłem żadnej przetestowanej instrukcji domowej szczebla 1 ani 3 (NCHFP nie ma strony o water kefirze; strona fermentacji UMN go nie wymienia). Jedyne źródło to przegląd naukowy, a jego górna granica pH 4,5 jest blisko progu 4,6. Brakuje kryterium „kiedy wyrzucić” i progu czasu do zakwaszenia.
- W tym samym przeglądzie są różne wartości cukru (6–10% we wstępie i 5–10% w sekcji 3), więc nawet szczebel 2 nie jest spójny.
- **Rekomendacja:** przesunąć do fali 2. Ewentualnie dać kartę „czym jest” bez instrukcji, dopóki nie znajdzie się źródło urzędowe (np. pełny tekst przewodnika FSAI GN-37; próba pobrania dała błąd 404).

### 2.6 Kefir mleczny: wystarczalność **CZĘŚCIOWO**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | Codex Standard for Fermented Milks, CODEX STAN 243-2003 (rev. 2008, 2010), https://www.fao.org/input/download/standards/400/CXS_243e.pdf [PDF] | 1 | Kefir: "Starter culture prepared from kefir grains, Lactobacillus kefiri, species of the genera Leuconostoc, Lactococcus and Acetobacter growing in a strong specific relationship." Skład: kwasowość miareczkowa min. 0,6% kwasu mlekowego; drożdże min. 10^4 cfu/g; kultury startowe min. 10^7 cfu/g |
| 2 | CDC, Raw milk, https://www.cdc.gov/food-safety/foods/raw-milk.html [WF]; FDA, *The Dangers of Raw Milk*, https://www.fda.gov/food/buy-store-serve-safe-food/dangers-raw-milk-unpasteurized-milk-can-pose-serious-health-risk [WF] | 1 | CDC: "Drinking or eating products made from raw milk can expose people to germs such as" (*Campylobacter*, *Cryptosporidium*, *E. coli*, *Listeria*, *Brucella*, *Salmonella*); grupy ryzyka: dzieci <5 lat, dorośli >65 lat, kobiety w ciąży, osoby z obniżoną odpornością; "Choose pasteurized milk and dairy products". FDA: "Yogurt made from unpasteurized milk" na liście wysokiego ryzyka; "Pregnant women run a serious risk of becoming ill from the germ Listeria" |
| 3 | USU Extension (j.w.) [WF] | 3 | "Dairy products must reach a pH of 4.6 or less within 48 hours to be considered pathogen-free." |
| 4 | Farag, Jomaa, Abd El-Wahed, El-Seedi, *Nutrients* 12(2):346, 2020, https://pmc.ncbi.nlm.nih.gov/articles/PMC7071183/ [WF] | 2 | "The kefir grains are inoculated into sterilized milk and fermented at 25 °C until a pH of 4.4 is reached." / "The cooled milk is mixed with 5% kefir grains and incubated at 18–24 °C for 18 h." / surowe mleko: *M. bovis* "transmitted to humans through the consumption of infected raw and raw fermented dairy products." / "A 24 h or shorter fermentation did not ensure the inactivation of M. bovis BCG." / "little attention has been given to the safe use of kefir." |

- **Dlaczego CZĘŚCIOWO:** reguły bezpieczeństwa są mocne (tylko mleko pasteryzowane; fermentacja nie unieszkodliwia *M. bovis* w 24 h; pH ≤4,6 w 48 h). Brakuje jednak przetestowanej instrukcji domowej szczebla 1 ani 3 dla kefiru z ziaren: proporcji ziaren do mleka, objawów zepsucia, przechowywania. Parametry procesu pochodzą z przeglądu, który opisuje metody laboratoryjne.
- **Sprzeczności:** brak bezpośrednich. FDA nie wymienia kefiru z nazwy, wymienia jogurt z mleka niepasteryzowanego. Przeniesienie tego na kefir to analogia, którą na stronie trzeba nazwać uproszczeniem.

### 2.7 Zakwas buraczany / kiszone buraki: wystarczalność **NIE**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | Janiszewska-Turak i in., *Molecules* 29(20):4803, 2024, doi:10.3390/molecules29204803, https://pmc.ncbi.nlm.nih.gov/articles/PMC11510701/ [WF] | 2 | Warunki laboratoryjne: buraki w kostkę 1 cm, słoiki 0,5 L, szczepionka *L. plantarum* ATCC 4080, "occurred in a laboratory incubator at 26 °C." pH w 4. dniu 3,45–3,77; w 11. dniu 3,32–3,51. "This study identifies the most favorable salt concentration for bacterial growth during fermentation and storage as 2–3%." "In all the samples, no signs of spoilage were detected." |
| 2 | Zugravu, Constantin, *Foods* 15(1):28, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC12785569/ [WF] | 2 | brak parametrów procesu dla zakwasu buraczanego; tylko ogólne "inadequate hygiene, temperature control, or raw material quality may increase the risk of spoilage" |

- **Dlaczego NIE:** jedyne źródło z liczbami opisuje fermentację **szczepioną** w laboratorium, a nie domową spontaniczną. NCHFP, UMN i inne przeczytane extension services nie mają przepisu na zakwas buraczany. Pracy z University of Maine o patogenach w beet kvass (0,5/1,5/2,5% soli) nie udało się przeczytać: repozytorium zamknięto 30.06.2026. Tytuł i wyniki znam tylko ze streszczenia wyszukiwarki, więc się na nie nie powołuję.
- **Rekomendacja:** fala 2, po znalezieniu polskiego źródła szczebla 1–3 (np. norma PN, IBPRS, uczelnie: SGGW, UPP) albo pełnego tekstu pracy z University of Maine.

### 2.8 Karta ogólna „Solanka i stężenie soli w laktofermentacji”: wystarczalność **TAK (jakościowo); CZĘŚCIOWO (liczbowo)**

| # | Źródło | Szcz. | Kluczowy cytat |
|---|---|---|---|
| 1 | NCHFP, General information on fermenting [WF] | 1 | "Use canning or pickling salt." / "Since flake salt varies in density, it is not recommended for making pickled and fermented foods." / "In fermented foods, salt favors the growth of desirable bacteria while inhibiting the growth of others." / "Caution: Do not attempt to make sauerkraut or fermented pickles by cutting back on the salt required." / "White distilled and cider vinegars of 5 percent acidity (50 grain) are recommended." |
| 2 | Penn State Ext., *Salt in Canning* (Zepp, akt. 17.03.2025), https://extension.psu.edu/salt-in-canning [WF] | 3 | "Canning or Pickling Salt is recommended for home food preservation." / "Other salts may discolor the product or affect its safety." / "Salt substitutes are not safe for fermented foods." / "Lowering the salt content of fermented products before canning will lower the acid content (raise the pH)" |
| 3 | NCHFP, Suitable containers, covers and weights, https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/suitable-containers-covers-and-weights-for-fermenting-food/ [WF] | 1 | "Cabbage and cucumbers must be kept 1 to 2 inches under brine while fermenting." (2,5–5 cm) / "Be certain that foods contact only food-grade plastics. Do not use garbage bags or trash liners." / obciążnik: worek z 3 qt wody i 4-1/2 tbsp soli |
| 4 | Wisconsin B2087 [PDF] i USDA-ARS J. Food Sci. 2019 [PDF] (j.w.) | 3 / 2 | kapusta 2,25–2,5% wagowo; przemysł ogórkowy ≥5% NaCl w równowadze |
| + | UMN Extension (j.w.) [WF] | 3 | "Salt should be iodine-free, as iodine can interfere with fermentation." / "If there is too much salt in the brine, fermentation will not occur and the pH will not drop to become more acidic." / "Avoid metal containers as the metal will react with the lactic acid that the bacteria produce." |

- **Jakościowo TAK:** rodzaj soli, zakaz zmniejszania soli i zamienników, warzywa pod solanką, naczynia.
- **Liczbowo CZĘŚCIOWO:** jedyny procent wagowy ze źródła wyższego szczebla dla domu dotyczy kapusty (Wisconsin 2,25–2,5%). Przepisy NCHFP podają sól objętościowo, a przeliczenie na gramy wymaga gęstości soli, której żadne przeczytane źródło nie podaje. Dla ogórków brak przetestowanego procentu domowego.
- **Sprzeczność:** UMN podaje sól bez jodu („iodine can interfere”), a Wisconsin i NCHFP podają po prostu sól do konserw/peklowania („canning or pickling salt”, w Wisconsin „(not iodized)”). Są zgodne kierunkowo.

---

## 3. Gdzie przeczytane źródła potwierdzają, a gdzie przeczą BRD

| Miejsce w BRD | Treść BRD | Co mówią źródła | Ocena |
|---|---|---|---|
| C4, hierarchia szczebli | szczebel 1 = „prawa fizykochemii”, NCHFP dopiero na szczeblu 4, Katz i Noma na szczeblu 3 | Hierarchia właściciela: urzędowe/pierwotne (NCHFP, USDA, FDA) na szczeblu 1, monografie na 2 | **Sprzeczne z zasadą właściciela.** C4 stawia popularne książki kulinarne (Katz, Noma) nad NCHFP. Do poprawy w BRD. |
| 00c ERR-01, C2 RD-03, C4 D-06 | minimum 1,8% soli w całej masie; ogórki 2,2% całkowitej masy | NCHFP: przepis na ogórki ze stężoną solanką (objętościowo) **plus ocet**; USDA-ARS: przemysł ≥5% NaCl w równowadze; OSU: kapusta <1,7% = miękka | **Nie potwierdzone.** Wartość 1,8% przypisana „Fleming et al.” nie jest zweryfikowana. Nie znalazłem źródła na 2,2% dla ogórków. Polski wariant bez octu nie ma przetestowanego odpowiednika. |
| C1 REC-03 | kapusta 2,0% soli | Wisconsin 2,25–2,5% wagowo; UC 2–2,5% | **Poniżej zaleceń** szczebla 3 (Wisconsin). Podnieść do 2,25–2,5%. |
| C1 REC-01 (małosolne 48–72 h, potem lodówka) i REC-02 (7 dni ciepło, potem piwnica 10–14 °C) | – | NCHFP: 3–4 tyg. w 21–24 °C albo 5–6 tyg. w 13–18 °C; brak przepisu na małosolne | **Brak źródła.** Nie publikować jako bezpiecznej instrukcji bez źródła. |
| 00c ERR-04, C4 D-10 („zakaz zdejmowania pleśni łyżką; utylizacja całej partii”) | rygor wyższy niż źródła | NCHFP (ogórki): "promptly remove surface scum or mold"; Wisconsin: "film yeasts or molds may form … skim them off"; OSU: "Discard the batch if large amounts of mold are visible."; kimchi (UGA, CSU) i kombucha (UGA, NY): pleśń oznacza wyrzucenie | **Sprzeczność z szczeblem 1 dla kapusty i ogórków.** BRD jest ostrożniejsze, czyli kierunkowo bezpieczne, ale twierdzenie o mykotoksynach „dyfundujących w głąb” nie ma przeczytanego źródła. Rozstrzygnięcie zapisać w rejestrze: wariant konserwatywny dopuszczalny jako uproszczenie, nazwane uproszczeniem. |
| 00c ERR-04 (kahm „bezpieczne po zebraniu łyżką”) | – | NCHFP: kożuch drożdży "Remove scum as often as needed"; UC: "White scum … due to yeasts and should be removed daily. There is no reason to discard the sauerkraut." | **Potwierdzone** dla kapusty i ogórków. |
| 00c ERR-13, C4 D-13 (metale) | dopuszczona stal 18/10, szkło, kamionka; zakaz Al, Cu, żeliwa | NCHFP: mosiądz, miedź, cynk → "do not use pickles"; UMN: "Avoid metal containers"; CSU: "Do not use metal containers" (stalowa miska tylko do mieszania) | **Częściowo.** Źródła zakazują metalowych pojemników do fermentacji, a BRD dopuszcza stal nierdzewną jako naczynie. Stal: otwarte pytanie. |
| B5 (kamionka jako naczynie), C1 (onggi) | kamionka dopuszczona ogólnie | CDC i UGA: **nie używać ceramiki ani glazurowanej ceramiki do kombuchy**; Phan 1998: zatrucie ołowiem; NCHFP i UMN: kamionka/ceramika dopuszczona do kapusty i ogórków | **Brak w BRD ostrzeżenia dla kombuchy.** Dodać regułę „kombucha: tylko szkło”. Ołów w glazurze kamionek do kapusty to otwarte pytanie. |
| B2 BR-FERM-006 (kombucha F1 7–14 dni) | – | NCHFP: 7–10 dni; NY: "beyond 10 days, acidity may rise to levels potentially harmful"; CDC: przypadek z wydłużeniem do 14 dni | **Sprzeczne.** Skrócić do 7–10 dni i dodać pomiar pH (<4,2, ≥2,5). |
| C3 RD-17, 00c ERR-02 (strefy 4,2/4,6) | 4,6 jako granica (21 CFR 114) | 21 CFR 114.3: 4,6 dla żywności kwaśnej i zakwaszonej; część 114 wyłącza żywność chłodzoną i dotyczy dodanego kwasu, nie fermentacji | **Częściowo.** 4,6 potwierdzone jako definicja. Przenoszenie części 114 na domowe kiszonki to ekstrapolacja. Próg 4,2 ma w przeczytanych źródłach podstawę tylko dla kombuchy (NY). Źródło „NCHFP Guidelines on Acidified Foods” z D-02 nie zostało znalezione. |
| C3 RD-20 (pH ≤4,2 w 4. dniu ogórków) | – | brak źródła domowego; UGA dla kimchi: pH <4,6 po około 2 tyg. | **Niepotwierdzone.** |
| 00c ERR-12 (zakwas bez chleba) | – | brak źródła | **Niepotwierdzone** (nie jest sprzeczne, ale nie ma podstaw). |
| C4 D-18 (solenie kapusty pekińskiej 6–8 h) | – | UGA: "massaging it every 30 min for 2 hr"; CSU: krótkie zanurzenie w solance | **Rozbieżne** (różne metody). Podać metodę z UGA. |
| D3 RYZ-05, C4 D-20 (ciśnienie, szkło do F2) | – | NCHFP: CO2 w szczelnych butelkach, ryzyko wybuchu | **Potwierdzone** co do ryzyka. „Szkło ciśnieniowe” nie ma źródła. |
| C1 REC-04 (buraki 2% soli) | – | lab: 2–3% optymalne dla LAB (szczepione, 26 °C) | **Słabe potwierdzenie** (inne warunki). |
| ERR-09 / D-04 (czosnek w oleju, lodówka max 4 dni) | – | CDC: "Throw the oils away after 4 days." | **Potwierdzone** (4 dni). Zakwaszanie 3% kwasem cytrynowym przez 24 h (D-04) nie zostało sprawdzone. |

---

## 4. Propozycja grupy podstawowej (według dostępności źródeł i bezpieczeństwa)

Kryterium: przetestowany przepis albo jednoznaczne reguły ze szczebla 1, potwierdzone przez szczebel 2 lub 3. Popyt nie był brany pod uwagę.

**Gotowe do pisania (źródła wystarczające):**
1. **Kapusta kiszona**, według NCHFP z procentem z Wisconsin (2,25–2,5%).
2. **Ogórki kiszone według przepisu NCHFP** (solanka z octem 5%, 3–4 tygodnie). Z wyraźną informacją, że wariant polski 2% bez octu nie jest przetestowany.
3. **Kimchi** (UGA 2025, Codex, CSU) z ostrzeżeniami o alergenach i higienie surowców.
4. **Kombucha** (NCHFP, CDC, NY, UGA): tylko szkło, pH startera ≤4,0, 7–10 dni, porcja ~120 ml, przeciwwskazania.
5. **Solanka i sól**: rodzaj soli, zakaz zmniejszania i zamienników, warzywa 2,5–5 cm pod solanką.
6. **Kwasowość, pH 4,6 i jad kiełbasiany**: czym kiszenie różni się od wekowania; dlaczego niskokwasowe warzywa wymagają sterylizacji ciśnieniowej; czosnek w oleju (4 dni).
7. **Kożuch drożdżowy, pleśń i objawy zepsucia** (NCHFP, OSU, Wisconsin, UGA, CSU). Tabela „bezpieczne / wyrzuć” według produktu, z zapisaną decyzją o wariancie konserwatywnym.
8. **Naczynia, pokrywy i obciążniki** (NCHFP, UMN, CSU, CDC/UGA dla ceramiki przy kombuchy; mosiądz, miedź i cynk dyskwalifikują).
9. **Przechowywanie i wekowanie gotowych kiszonek** (tabele NCHFP dla kapusty i ogórków, pasteryzacja niskotemperaturowa 82–85 °C przez 30 min tylko tam, gdzie przewiduje ją przepis).
10. **Problemy z ogórkami kiszonymi**: tabela NCHFP (miękkie, puste w środku, ciemne, biały osad).

**Warunkowo (karta bezpieczeństwa bez pełnej instrukcji):**
11. **Kefir mleczny**: tylko mleko pasteryzowane, pH ≤4,6 w 48 h, grupy ryzyka. Instrukcję z ziaren dopisać po znalezieniu źródła szczebla 1 lub 3.

**Odłożyć do fali 2:**
12. Zakwas buraczany (brak źródła domowego).
13. Water kefir (brak źródła urzędowego lub uczelnianego).
14. Ogórki małosolne i polskie ogórki 2% bez octu (brak przetestowanego przepisu).

Razem 10 kart gotowych i 1 warunkowa, czyli 11 kart w grupie podstawowej.

---

## 5. Otwarte pytania

1. **Gęstość nasypowa soli do konserw** (g na łyżkę i g na szklankę), potrzebna do przeliczenia przepisów NCHFP na procent wagowy. Szukać w USDA Complete Guide (Guide 6, PDF), NCHFP FAQ albo u producenta soli. Bez tego nie podawać gramów.
2. **Równowagowe stężenie soli w przepisie NCHFP na ogórki** w % m/m. Wymaga punktu 1. Nie liczyć na oko.
3. **Czy istnieje przetestowany przepis (szczebel 1–3) na ogórki kiszone 2–3% bez octu**, czyli wariant polski? Szukać w polskich normach (PN, dawne BN), IBPRS, publikacjach SGGW i UPP, u Breidta (USDA-ARS) dla małych partii.
4. **Małosolne (48–72 h)**: czy jakiekolwiek źródło szczebla 1–3 je opisuje, i od kiedy produkt uznaje się za bezpieczny.
5. **Ołów w glazurze polskich kamionek do kiszenia**: czy są urzędowe ostrzeżenia lub limity (UE: dyrektywa 84/500/EWG o wyrobach ceramicznych; GIS, Sanepid). Na razie ostrzeżenie dotyczy kombuchy.
6. **Stal nierdzewna jako naczynie do fermentacji**: BRD ją dopuszcza, a UMN i CSU mówią ogólnie „no metal containers”. Potrzebne źródło rozróżniające gatunki stali.
7. **Pleśń na kiszonej kapuście i ogórkach**: zdejmować (NCHFP, Wisconsin) czy wyrzucić całość (BRD, OSU przy dużej ilości)? Decyzję wpisać do rejestru jako uproszczenie konserwatywne albo przyjąć wersję NCHFP.
8. **Kimchi z fermentowanymi owocami morza (saeujeot) a jad kiełbasiany**: żadne przeczytane źródło o kimchi tego nie omawia. CDC wskazuje fermentowane ryby jako źródło botulizmu na Alasce, ale to inne produkty.
9. **Aktualna wersja Codex dla kimchi**: pobrałem tekst z adnotacją 2001. Sprawdzić, czy rewizja z 2024/2025 (kapusta kimchi) zmieniła progi soli lub kwasowości.
10. **Water kefir**: pełny tekst przewodnika FSAI GN-37 (link dał 404) albo inny dokument urzędowy; kryteria pH i czasu.
11. **Kefir mleczny z ziaren**: przetestowana instrukcja domowa (proporcje ziaren, temperatura, czas, objawy zepsucia) ze źródła szczebla 1 lub 3.
12. **Zakwas buraczany**: domowy przepis ze źródła szczebla 1–3. Pełny tekst pracy z University of Maine o patogenach w beet kvass (repozytorium Specto). Kwestia azotanów i azotynów w burakach: nie sprawdzono.
13. **Próg pH 4,2 dla kiszonek warzywnych** (BRD D-02 i ERR-02): czy ma źródło inne niż regulacje dla kombuchy.
14. **Czy wekowanie gotowej kiszonki unieszkodliwia żywe kultury**: logiczne, ale nie znalazłem cytatu. Nie pisać bez źródła.
15. **Weryfikacja cytatów [WF]**: przed publikacją każdy cytat oznaczony [WF] porównać ręcznie ze stroną źródłową.

---

## 6. Wykaz przeczytanych źródeł

Szczebel 1: NCHFP (Sauerkraut; Dill Pickles; Kombucha Tea; General information; Containers; Problems with fermented pickles; Low-temperature pasteurization), CDC MMWR 1995 (kombucha), CDC Botulism prevention, CDC Raw milk, FDA Dangers of Raw Milk, 21 CFR 114.3 (Cornell LII), Codex STAN 223-2001 (kimchi), Codex STAN 243-2003 (fermented milks), NY Dept. of Agriculture & Markets (kombucha).
Szczebel 2: McMurtrie i in. 2019 J Food Sci (USDA-ARS); Phan i in. 1998 Med J Aust (PubMed); Park i in. 2025 Epidemiol Health (PMC); Bozkir i in. 2024 Heliyon (PMC); Farag i in. 2020 Nutrients (PMC); Janiszewska-Turak i in. 2024 Molecules (PMC); Zugravu i Constantin 2025 Foods (PMC).
Szczebel 3: UGA C1362 (kimchi), UGA C1312 (kombucha), Wisconsin B2087 (kapusta), OSU SP 50-745 (kapusta), OSU Ask Extension (kimchi), Penn State (ogórki; sól), UMN (fermentacja), USU (fermentacja), Colorado State (kimchi), UC MFP Humboldt (kapusta; częściowo szczebel 4).
Strony, których nie udało się przeczytać (nie są użyte jako źródło): Virginia Tech FST-297 (błąd 503), FSAI GN-37 (404), University of Maine thesis (repozytorium zamknięte), MDPI i DOAJ (403), Pennsylvania Dept. of Agriculture (przekierowanie; nie pobrano).
