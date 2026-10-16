import os

def expand_c1_recipes():
    filepath = "kiszonki_brd/Kiszonki BRD 0.1 · C1 · rozdz. 7 nauka - Szkoła Przetwórstwa i Fermentacji, atlas kultur bakteryjnych, drożdży i pleśni szlachetnych.md"
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read().strip()

    recipes_spec = r"""

---

## **3. Pełna Specyfikacja 24 Mistrzowskich Receptur Świata (Master Recipes)**

Aplikacja zawiera bazę 24 zweryfikowanych receptur fabrycznych. Każda receptura w bazie danych posiada precyzyjne parametry, kalkulacje wagowe, sensoryczną oś czasu oraz wskazówki eliminujące najczęstsze błędy początkujących przetwórców.

---

### **3.1 Klasyka Polski i Europy Środkowej**

#### **REC-01: Ogórki małosolne chrupiące (Ekspresowe 48h)**
* **Kultura/Tradycja:** Polska tradycja letnia.
* **Profil sensoryczny:** Wyrazisty aromat czosnku i kopru, delikatna kwasowość, maksymalna jędrność i soczysty trzask przy ugryzieniu.
* **Wzorcowe proporcje (na słoik 1L / ok. 600g ogórków):**
  * Ogórki gruntowe: 500–600 g (małe, świeżo zbierane, twarde).
  * Woda: ok. 450–500 ml (najlepiej filtrowana lub studzienna, twarda).
  * Sól kamienna niejodowana: 20–22 g (stężenie ok. 2.0% w całkowitej masie wsadu + wody).
  * Dodatki: 2–3 ząbki czosnku przekrojone wzdłuż, 1 dorodny baldach kopru z nasionami, 3 cm korzenia chrzanu, 2 świeże liście dębu lub czarnej porzeczki.
* **Sekret chrupkości:** Zimna kąpiel ogórków w wodzie z lodem przez 2 godziny przed włożeniem do słoika (uwodnienie turgoru komórkowego) oraz liście dębu dostarczające tanin hamujących enzymy rozmiękczające (pektynolityczne).
* **Oś czasu w aplikacji:**
  * *Godzina 0:* Zalanie gorącą lub letnią solanką.
  * *Godzina 24:* Początek mętnienia zalewy (*Leuconostoc* w akcji), delikatny aromat małosolny.
  * *Godzina 48:* **Złoty punkt małosolnych!** Powiadomienie sensoryczne: „Spróbuj pierwszego ogórka!”.
  * *Godzina 72:* Przejście w kierunku kiszonych. Jeśli lubisz małosolne — przenieś słoik do lodówki ($4^\circ\text{C}$).
* **Typowy błąd:** Zbyt mała ilość soli (ogórki robią się śliskie i puste w środku) lub brak chrzanu/liści taninowych.

#### **REC-02: Ogórki kiszone tradycyjne na zimę**
* **Kultura/Tradycja:** Polska i słowiańska spiżarnia zimowa.
* **Profil sensoryczny:** Głęboki, czysty kwas mlekowy, słony posmak, brak nut octowych, idealnie chrupiący miąższ bez pustych komór.
* **Wzorcowe proporcje (na słoik 1L / ok. 650g ogórków):**
  * Ogórki gruntowe średniej wielkości: 600–650 g.
  * Solanka: 2.2%–2.5% soli liczone od łącznej masy ogórków i wody (ok. 25 g soli na litr układu).
  * Dodatki: koper z nasionami, 4 ząbki czosnku, 5 cm chrzanu w słupkach, kawałek liścia chrzanu, liść dębu, 3 ziarna ziela angielskiego, 5 ziaren czarnego pieprzu.
* **Oś czasu w aplikacji:**
  * *Dni 1–4:* Fermentacja burzliwa w temperaturze $18–22^\circ\text{C}$. Gazowanie, słoik na podstawce.
  * *Dzień 5:* Faza cicha — spadek intensywności wydzielania $CO_2$.
  * *Dzień 7:* Powiadomienie: „Znieś słoiki do chłodnej piwnicy ($10–14^\circ\text{C}$) lub spiżarki”.
  * *Dzień 30+:* Pełna dojrzałość, gotowe do jedzenia i na zupę ogórkową.

#### **REC-03: Kiszona kapusta z kminkiem i marchewką**
* **Kultura/Tradycja:** Polska wiejska tradycja szatkowania.
* **Profil sensoryczny:** Jasnosłomkowy kolor, chrupka struktura, orzeźwiająca kwasowość z korzenną nutą kminku.
* **Wzorcowe proporcje (na 2 kg kapusty):**
  * Kapusta biała późna (zwięzłe głowy): 2 000 g.
  * Sól niejodowana: 40 g (dokładnie 2.0% masy).
  * Marchew starta na grubych oczkach: 100 g (opcjonalnie, dla koloru i słodyczy).
  * Kminek cały: 1 płaska łyżeczka (ok. 3 g).
* **Sekret rzemiosła:** Metoda solenia na sucho (*dry salting*). Po posoleniu kapusta odpoczywa 20 minut, po czym jest mocno ugniatana pięścią lub tłuczkiem, aż puści tyle soku, by po upakowaniu w kamionce lub słoiku płyn całkowicie przykrył wiórki.
* **Oś czasu i odgazowywanie:**
  * Codzienne przypomnienie przez pierwsze 4 dni o przebiciu kapusty drewnianym trzonkiem łyżki do dna naczynia (uwolnienie uwięzionego dwutlenku węgla i siarkowodoru, co zapobiega gorzknieniu).

#### **REC-04: Zakwas buraczany na barszcz i probiotyczny napój**
* **Kultura/Tradycja:** Kuchnia staropolska.
* **Profil sensoryczny:** Głęboki rubinowy kolor, gęsty, lekko musujący płyn o ziemisto-kwaśnym, czosnkowym smaku.
* **Wzorcowe proporcje (na słoik 2L):**
  * Buraki ćwikłowe obrane i pokrojone w grube plastry: 1 000 g.
  * Przegotowana, ostudzona woda: ok. 1 000 ml.
  * Sól: 20 g (ok. 2.0% roztwór).
  * Dodatki: 5 ząbków czosnku, 3 liście laurowe, 5 ziaren ziela angielskiego.
* **Sekret aplikacji:** Buraki muszą być całkowicie zanurzone pod taflą płynu (zalecenie użycia docisku szklanego lub ceramicznego). Wystające kawałki buraka to najczęstsza przyczyna rozwoju pleśni.

#### **REC-05: Klasyczne grzyby leśne w zalewie octowej**
* **Kultura/Tradycja:** Polska tradycja grzybobrania.
* **Profil sensoryczny:** Jędrne kapelusze grzybów w aksamitnej, przejrzystej, łagodnie słodko-kwaśnej zalewie.
* **Wzorcowe proporcje:**
  * Grzyby (borowiki, podgrzybki, maślaki lub rydze): 1 kg (obgotowane 10 min w lekko osolonej wodzie z dodatkiem 1 łyżki octu, by nie ściemniały).
  * Zalewa: 3 szklanki wody (750 ml), 1 szklanka octu spirytusowego 10% (lub 1.5 szklanki octu jabłkowego 6%), 3 łyżki cukru (45 g), 1 łyżeczka soli, ziele angielskie, liść laurowy, cebula w piórkach i ziarna gorczycy.
* **Pasteryzacja:** 15 minut w kąpieli wodnej $90–100^\circ\text{C}$.

#### **REC-06: Aksamitne powidła śliwkowe bez mieszania**
* **Kultura/Tradycja:** Tradycja sadownicza Małopolski i Doliny Dolnej Wisły.
* **Profil sensoryczny:** Niemal czarne, gęste, naturalnie słodkie, o głębokim karmelowo-śliwkowym aromacie.
* **Składniki:** 100% dojrzałe śliwki węgierki (zbierane po pierwszych przymrozkach lub z pomarszczoną skórką przy szypułce). Zero dodatku cukru!
* **Metoda:** Wolne prażenie w naczyniu żeliwnym lub pieczenie w piekarniku w $140^\circ\text{C}$ przez 12–16 godzin z uchylonymi drzwiczkami. Aplikacja prowadzi przez fazy odparowywania wody aż do testu zimnego talerzyka (kropla powideł nie rozlewa się i zastyga w zwartą galaretkę).

---

### **3.2 Azja Wschodnia (Korea & Japonia)**

#### **REC-07: Baechu-kimchi (Klasyczne kimchi z kapusty pekińskiej)**
* **Kultura/Tradycja:** Koreańska sztuka Kimjang (wpisana na listę UNESCO).
* **Profil sensoryczny:** Złożona eksplozja umami, ostrości papryki gochugaru, świeżości imbiru i czosnku, z musującą kwasowością.
* **Składniki i etapy:**
  1. *Solenie wstępne:* Kapusta pekińska przekrojona na pół, liście obficie solone solą morską u nasady (stężenie ok. 8–10% w strefie nasady), moczenie 6–8 godzin, trzykrotne płukanie i dokładne odsączanie.
  2. *Kleik ryżowy:* 2 łyżki mąki z ryżu kleistego zagotowane w 1 szklance wody z 1 łyżką cukru trzcinowego.
  3. *Pasta Kimchi (Yangnyeom):* Koreańska papryka gochugaru (60–80 g), czosnek (1 cała główka zblendowana), imbir (30 g), sos rybny (50 ml), rzodkiew biała mu/daikon starta w słupki, dymka i cebula.
* **Oś czasu:**
  * 2 dni na blacie kuchennym w $20^\circ\text{C}$ (faza burzliwa, codzienne dociskanie i odgazowywanie).
  * Przeniesienie do lodówki ($2–4^\circ\text{C}$) — powolne dojrzewanie przez 2–4 tygodnie. Kimchi staje się coraz lepsze z każdym miesiącem.

#### **REC-08: Kkakdugi (Chrupiące kimchi z białej rzodkwi)**
* **Kultura/Tradycja:** Korea.
* **Profil sensoryczny:** Niezwykle soczysty, orzeźwiający trzask kostek rzodkwi w gęstym, szkarłatnym sosie.
* **Kluczowy krok:** Posolenie kostek rzodkwi daikon ($2\times 2\,\text{cm}$) z dodatkiem 1 łyżki cukru na 40 minut. Odlanie nadmiaru wody przed wymieszaniem z pastą gochugaru zapobiega rozwodnieniu sosu.

#### **REC-09: Oi Sobagi (Nadziewane ogórki po koreańsku)**
* **Kultura/Tradycja:** Koreańskie lato.
* **Profil sensoryczny:** Pikle ekspresowe — chrupiące ogórki nacięte w krzyż (zostawiając 1 cm od dołu) i wypełnione pikantnym nadzieniem ze szczypiorku, marchwi, czosnku i sezamu. Gotowe do jedzenia już po 24 godzinach.

#### **REC-10: Japońskie Tsukemono Asazuke (Pikle ekspresowe 12h)**
* **Kultura/Tradycja:** Japonia.
* **Profil sensoryczny:** Minimalistyczny, świeży, słony z głębokim akcentem umami z alg kombu.
* **Składniki:** Cienko krojona kapusta pekińska, ogórek, rzepa, kawałek suszonego wodorostu kombu, 1.5% soli morskiej, odrobina octu ryżowego i plasterki imbiru.
* **Metoda:** Prasowanie pod naciskiem (ciężki słoik z wodą lub japońskie naczynie ze sprężyną *tsukemonoki*) w lodówce przez noc.

#### **REC-11: Shiozuke (Słone pikle japońskie z cytrusem)**
* **Kultura/Tradycja:** Tradycyjny japoński stół śniadaniowy.
* **Profil sensoryczny:** Wyrazista słoność podkreślona świeżym zapachem skórki cytrynowej lub yuzu.

---

### **3.3 Bliski Wschód, Maghreb i Indie**

#### **REC-12: Marokańskie kiszone cytryny (L'hamd Marakad)**
* **Kultura/Tradycja:** Kuchnia marokańska i berberyjska.
* **Profil sensoryczny:** Jedwabista, pozbawiona goryczy, miękka skórka cytrynowa o intensywnym, skoncentrowanym aromacie cytrusowo-kwiatowym.
* **Wzorcowe proporcje (słoik 1L):**
  * Cytryny ekologiczne (niewoskowane): 6–8 sztuk.
  * Gruba sól morska: ok. 1 łyżka soli do środka każdej naciętej w krzyż cytryny.
  * Sok z dodatkowych 2–3 cytryn (by uzupełnić płyn).
* **Sekret rzemiosła:** Brak dodatku kropli wody! Cytryny kiszą się wyłącznie we własnym soku i soli. Dojrzewają minimum 4 tygodnie w ciemnym miejscu. W kuchni wykorzystuje się głównie aksamitną skórkę (np. do pieczonego kurczaka, oliwek czy kaszy kuskus).

#### **REC-13: Indyjski Mango Achar (Ogniste pikle w oleju gorczycowym)**
* **Kultura/Tradycja:** Indie (Pendżab i Gudźarat).
* **Profil sensoryczny:** Potężna ostrość, wyrazista goryczka prażonej kozieradki, głęboki aromat asafetydy (*hing*) i rozgrzewający olej gorczycowy.
* **Składniki:** Twarde zielone mango, nasiona gorczycy brązowej, nasiona kopru włoskiego, kurkuma, chili kaszmirskie, surowy olej gorczycowy podgrzany do dymienia i ostudzony.

#### **REC-14: Kiszone rzodkiewki i kalafior w kurkumie (Torshi)**
* **Kultura/Tradycja:** Lewant (Liban, Syria, Palestyna).
* **Profil sensoryczny:** Neonowo-żółty kalafior i jaskrawo-różowe rzepy. Niezwykle chrupkie, kwaskowate, doskonałe do falafela i hummusu.

---

### **3.4 Ameryki i Kraje Śródziemnomorskie**

#### **REC-15: Kosher Dill Pickles (Pikle z nowojorskich delikatesów)**
* **Kultura/Tradycja:** Żydowska kuchnia aszkenazyjska (Nowy Jork, Lower East Side).
* **Profil sensoryczny:** Czysta solanka bez octu, olbrzymia ilość zgniecionego czosnku, nasiona kolendry, nasiona kopru, ziele angielskie i ostre papryczki chili.

#### **REC-16: Meksykański Escabeche (Jalapeño en escabeche)**
* **Kultura/Tradycja:** Meksyk.
* **Profil sensoryczny:** Ostre, chrupkie plastry jalapeño, słodka marchewka i cebula w aromatycznej marynacie octowej z suszonym oregano meksykańskim i liśćmi laurowymi. Krótka pasteryzacja 10 minut.

#### **REC-17: Lacto Hot Sauce (Fermentowany ostry sos paprykowy)**
* **Kultura/Tradycja:** Rzemieślnicza kultura ostrych sosów (Louisiana / craft hot sauce).
* **Profil sensoryczny:** Złożona, głęboka ostrość z nutami owocowymi powstałymi w procesie fermentacji mlekowej, o gładkiej konsystencji.
* **Metoda:** Ostre papryczki (habanero, jalapeño, cayenne) posiekane z czosnkiem, zalane solanką 3.0% na 14–21 dni pod rurką fermentacyjną. Po zakończeniu fermentacji zblendowane z dodatkiem odrobiny octu jabłkowego i przetarte przez gęste sito.

#### **REC-18: Włoska Giardiniera**
* **Kultura/Tradycja:** Północne Włochy i Chicago.
* **Profil sensoryczny:** Kolorowy ogród w słoiku (kalafior, marchew, seler naciowy, papryka, fenkuł) w zalewie octowo-oliwnej. Warzywa solone na sucho przez noc, płukane i marynowane.

---

### **3.5 Owoce, Dżemy i Domowa Spiżarnia**

#### **REC-19: Dżem truskawkowy o niskiej zawartości cukru**
* **Kultura/Tradycja:** Nowoczesne przetwórstwo owocowe o czystym smaku.
* **Profil sensoryczny:** Świeży smak dojrzałych truskawek, piękny rubinowy kolor, brak ulepkowatej słodyczy.
* **Wzorcowe proporcje:** 1 kg truskawek, 300 g cukru (30% zamiast tradycyjnego 1:1), sok z 1/2 cytryny, 10 g naturalnej pektyny jabłkowej lub cytrusowej. Krótkie gotowanie 5 minut po dodaniu pektyny.

#### **REC-20: Czatnej z mango, imbiru i chili**
* **Kultura/Tradycja:** Kuchnia kolonialna i anglo-indyjska.
* **Profil sensoryczny:** Słodko-kwaśno-pikantny gęsty sos owocowy z kawałkami owoców, rodzynkami, czosnkiem i octem jabłkowym. Doskonały do serów dojrzewających i pieczeni.

#### **REC-21: Domowa passata pomidorowa z bazylią**
* **Kultura/Tradycja:** Włoska tradycja letniego przecierania pomidorów (*Fare la salsa*).
* **Profil sensoryczny:** Gęsty, słodki przecier z pomidorów polnych odmiany San Marzano lub Lima, bez pestek i skórek, ze świeżym liściem bazylii. Pasteryzowany w butelkach lub słoikach przez 25 minut.

#### **REC-22: Konfitura malinowa z nutą wanilii**
* **Kultura/Tradycja:** Europejskie cukiernictwo rzemieślnicze.
* **Profil sensoryczny:** Całe, nienaruszone maliny zanurzone w lśniącym syropie z prawdziwą laską wanilii. Maceracja owoców z cukrem przez noc, krótkie zszumowanie i zlanie do słoiczków.

---

### **3.6 Domowe Napoje i Żywe Octy**

#### **REC-23: Musujący kwas chlebowy na pieczywie żytnim**
* **Kultura/Tradycja:** Słowiański probiotyczny napój orzeźwiający.
* **Profil sensoryczny:** Chlebowy aromat z nutą karmelu, orzeźwiająca kwasowość, naturalne musowanie na języku.
* **Metoda:** Podpieczony na ciemno chleb żytni razowy zalany wrzątkiem, ostudzony, zaszczepiony szczyptą drożdży lub łyżką zakwasu chlebowego, z dodatkiem rodzynek i mięty. Butelkowany po 24 godzinach i leżakowany w chłodzie.

#### **REC-24: Domowy żywy ocet jabłkowy z matką octową**
* **Kultura/Tradycja:** Tradycja sadownicza.
* **Profil sensoryczny:** Złocisty, naturalnie mętny, łagodny ocet owocowy o bogatym bukiecie smakowym.
* **Metoda:** Jabłka pokrojone w kawałki, zalane osłodzoną wodą (1 łyżka cukru na 1 szklankę wody), przykryte przewiewną ściereczką. Faza 1 (fermentacja burzliwa, codzienne mieszanie przez 14 dni). Faza 2 (odcedzenie owoców, powolna fermentacja octowa przez 4–6 tygodni pod okiem bakterii *Acetobacter*).

"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content + recipes_spec)
    print("Zaktualizowano i rozszerzono C1 o pełną specyfikację 24 Receptur Świata.")

if __name__ == '__main__':
    expand_c1_recipes()
