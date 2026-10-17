#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_recipes_155.py
Rozszerza bazę MASTER_RECIPES w src/core/recipes/recipes-data.ts o 109 nowych
mistrzowskich receptur ze świata (REC-47 do REC-155, łącznie 155 receptur).
Wszystkie receptury zawierają autentyczne parametry kulinarne i mikrobiologiczne.
"""

import json
import re

NEW_RECIPES = [
    # -------------------------------------------------------------------------
    # 1. Polska & Europa Środkowa (REC-47 do REC-66)
    # -------------------------------------------------------------------------
    {
        "id": "REC-47",
        "title": "Kiszona dynia z imbirem i goździkami",
        "subtitle": "Aromatyczne złote kostki o korzennym aromacie",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 800,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 7,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Słoik Weck 1.5L z gumką",
        "ingredients": [
            {"name": "Dynia twarda (hokkaido lub piżmowa)", "amount": 800, "unit": "g", "isMandatory": True},
            {"name": "Woda źródlana", "amount": 700, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna kłodawska", "amount": 33, "unit": "g", "isMandatory": True},
            {"name": "Świeży imbir w plastrach", "amount": 15, "unit": "g", "isMandatory": True},
            {"name": "Goździki całe", "amount": 4, "unit": "szt", "isMandatory": True},
            {"name": "Laska cynamonu", "amount": 1, "unit": "szt", "isMandatory": False},
        ],
        "steps": [
            "Obrierz dynię ze skóry (hokkaido można zostawić) i pokrój w zwartą kostkę 2x2 cm.",
            "W wyparzonym słoju ułóż przyprawy korzenne, a następnie ciasno upakuj dynię.",
            "Zalej solanką 2.2% przygotowaną z ostudzonej wody i soli kamiennej.",
            "Dociśnij ciężarkiem szklanym tak, by dynia nie wypływała na powierzchnię.",
            "Odstaw na 5–7 dni w temperaturze pokojowej do osiągnięcia kwaskowatego balansu.",
        ],
        "crispnessSecrets": [
            "Wybieraj dynie o zwięzłym miąższu — odmiany wodniste miękną podczas kiszenia.",
            "Dodatek tanin z liścia dębu zapobiega rozkładowi pektyn w dyni.",
        ],
        "sensoryMilestones": [
            {"day": 2, "title": "Bąbelkowanie", "sensoryDescription": "Solanka delikatnie mętnieje, uwalnia się korzenny zapach cynamonu."},
            {"day": 5, "title": "Punkt chrupkości", "sensoryDescription": "Dynia zyskuje orzeźwiający kwas przy zachowaniu jędrności.", "isTastingCheckpoint": True},
            {"day": 7, "title": "Dojrzałość", "sensoryDescription": "Głęboki smak korzenno-kwasowy, przenieś w chłodne miejsce.", "actionRequired": "Przenieś do spiżarni"},
        ],
        "commonMistakes": [
            "Zbyt cienkie pokrojenie dyni, co prowadzi do jej rozmiękania.",
            "Brak dociążenia kawałków wypływających nad taflę solanki.",
        ],
    },
    {
        "id": "REC-48",
        "title": "Kiszone rydze po bieszczadzku",
        "subtitle": "Karpacka arystokracja grzybowa na surowo w soli",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 500,
        "defaultSalinityPercent": 2.5,
        "fermentationDays": 14,
        "shelfLifeMonths": 9,
        "recommendedJarType": "Kamionka lub słoik z zamknięciem mechanicznym 1.0L",
        "ingredients": [
            {"name": "Młode rydze leśne (same kapelusze)", "amount": 500, "unit": "g", "isMandatory": True},
            {"name": "Sól kamienna gruba", "amount": 13, "unit": "g", "isMandatory": True},
            {"name": "Cebula biała w piórkach", "amount": 80, "unit": "g", "isMandatory": True},
            {"name": "Ziele angielskie", "amount": 4, "unit": "szt", "isMandatory": True},
            {"name": "Liść laurowy", "amount": 2, "unit": "szt", "isMandatory": True},
            {"name": "Masło klarowane (na wierzch)", "amount": 40, "unit": "g", "isMandatory": False},
        ],
        "steps": [
            "Kapelusze rydzów delikatnie oczyść pędzelkiem i zblanszuj we wrzątku przez 60 sekund, natychmiast hartując lodem.",
            "W kamionce układaj rydze blaszkami do góry, każdą warstwę posypując solą i piórkami cebuli.",
            "Dociśnij drewnianym denkiem z wyparzonym kamieniem, aby grzyby puściły sok.",
            "Po 14 dniach kiszenia w chłodzie (15–18°C) rydze są gotowe do spożycia.",
            "Opcjonalnie zalej wierzch roztopionym masłem klarowanym jako naturalną barierą beztlenową.",
        ],
        "crispnessSecrets": [
            "Blanszowanie przez minutę inaktywuje enzymy utleniające i chroni rydze przed ściemnieniem.",
            "Układanie blaszkami ku górze ułatwia wnikanie kryształków soli w głąb kapelusza.",
        ],
        "sensoryMilestones": [
            {"day": 3, "title": "Płyn własny", "sensoryDescription": "Rydze całkowicie pokryły się ciemnym, pachnącym lasem sokiem."},
            {"day": 10, "title": "Kwas maślany i leśny", "sensoryDescription": "Kwasowość równoważy żywiczny posmak rydza.", "isTastingCheckpoint": True},
            {"day": 14, "title": "Pełnia smaku", "sensoryDescription": "Szlachetna leśna kwasowość, idealna do wiejskiego chleba.", "actionRequired": "Zabezpiecz masłem lub schłodź"},
        ],
        "commonMistakes": [
            "Płukanie rydzów dużą ilością wody przed soleniem, co wypłukuje mleczko grzybowe.",
            "Trzymanie w zbyt wysokiej temperaturze (>22°C), co niszczy strukturę grzyba.",
        ],
    },
    {
        "id": "REC-49",
        "title": "Żur staropolski na mące żytniej razowej",
        "subtitle": "Gęsty, dziki zakwas chlebowy o potężnym aromacie majeranku",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 250,
        "defaultSalinityPercent": 0.5,
        "fermentationDays": 5,
        "shelfLifeMonths": 2,
        "recommendedJarType": "Słój szklany 1.5L z gazą lub wieczkiem",
        "ingredients": [
            {"name": "Mąka żytnia razowa typ 2000", "amount": 250, "unit": "g", "isMandatory": True},
            {"name": "Woda przegotowana letnia", "amount": 1000, "unit": "ml", "isMandatory": True},
            {"name": "Czosnek rozgnieciony w łupinie", "amount": 4, "unit": "szt", "isMandatory": True},
            {"name": "Majeranek otarty", "amount": 2, "unit": "łyżka", "isMandatory": True},
            {"name": "Ziele angielskie i liść laurowy", "amount": 3, "unit": "szt", "isMandatory": True},
            {"name": "Skórka z prawdziwego chleba żytniego na zakwasie", "amount": 40, "unit": "g", "isMandatory": False},
        ],
        "steps": [
            "Wsyp mąkę żytnią do wyparzonego słoja i zalej letnią wodą (ok. 35°C).",
            "Dodaj zgnieciony czosnek, ziele angielskie, liść laurowy, majeranek i opcjonalnie skórkę chleba.",
            "Wymieszaj dokładnie drewnianą łyżką, przykryj gazą zabezpieczoną gumką.",
            "Mieszaj energicznie raz dziennie, by napowietrzać kultury i zapobiec kożuszkowi.",
            "Gdy żur uzyska intensywny, winno-kwasowy aromat (zwykle po 4–5 dniach), przecedź i wstaw do lodówki.",
        ],
        "crispnessSecrets": [
            "Mąka razowa typ 2000 zawiera naturalne dzikie drożdże i bakterie kwasu mlekowego z łuski ziarna.",
            "Codzienne zamieszanie zapobiega tworzeniu pleśni na powierzchni mącznej zawiesiny.",
        ],
        "sensoryMilestones": [
            {"day": 2, "title": "Start fermentacji", "sensoryDescription": "Mąka opada, na górze tworzy się mętny płyn o delikatnym zapachu ciasta chlebowego."},
            {"day": 4, "title": "Bomba kwasowa", "sensoryDescription": "Głęboki, ostry kwas chlebowy harmonizujący z czosnkiem.", "isTastingCheckpoint": True},
            {"day": 5, "title": "Gotowy żur", "sensoryDescription": "Żur ma pH około 3.6–3.8, jest aksamitny i orzeźwiający.", "actionRequired": "Zlej do butelki i wstaw do chłodu"},
        ],
        "commonMistakes": [
            "Szczelne zakręcenie słoika uniemożliwiające uchodzenie CO2.",
            "Użycie mąki pszennej tortowej, która tworzy kleik zamiast kwaśnego żuru.",
        ],
    },
    {
        "id": "REC-50",
        "title": "Kiszony czosnek niedźwiedzi w soli kamiennej",
        "subtitle": "Wiosenny leśny skarb o szmaragdowej barwie",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 400,
        "defaultSalinityPercent": 2.0,
        "fermentationDays": 6,
        "shelfLifeMonths": 12,
        "recommendedJarType": "Małe słoiki 300ml z twist-off",
        "ingredients": [
            {"name": "Świeże liście czosnku niedźwiedziego", "amount": 400, "unit": "g", "isMandatory": True},
            {"name": "Sól kamienna niejodowana", "amount": 8, "unit": "g", "isMandatory": True},
            {"name": "Ziarna gorczycy białej", "amount": 1, "unit": "łyżeczka", "isMandatory": False},
        ],
        "steps": [
            "Liście dokładnie opłucz w zimnej wodzie i osusz na ściereczce.",
            "Poszatkuj liście na paski o szerokości 1 cm lub zwiń w ciasne ruloniki.",
            "W misce zasyp solą i delikatnie ugnieć dłońmi, aż liście ściemnieją i puszczą sok.",
            "Upychaj bardzo ciasno w słoikach, upewniając się, że sok przykrywa liście.",
            "Zakręć i fermentuj przez 5–7 dni w ciemnym miejscu w temperaturze pokojowej.",
        ],
        "crispnessSecrets": [
            "Zbiór przed zakwitnięciem gwarantuje miękkość i brak włóknistej goryczki.",
            "Brak dodatkowej wody — fermentacja wyłącznie w soku komórkowym liści.",
        ],
        "sensoryMilestones": [
            {"day": 2, "title": "Wydzielanie soku", "sensoryDescription": "Mocny aromat allicyny wypełnia słoik, kolor liści przechodzi w oliwkowy."},
            {"day": 4, "title": "Kwas czosnkowy", "sensoryDescription": "Ostrość łagodnieje na rzecz przyjemnej kwasowości.", "isTastingCheckpoint": True},
            {"day": 6, "title": "Optimum", "sensoryDescription": "Znakomity dodatek do twarogów, pieczywa i zup.", "actionRequired": "Przenieś do piwnicy"},
        ],
        "commonMistakes": [
            "Zbyt słabe upakowanie, pozostawiające pęcherzyki powietrza pomiędzy liśćmi.",
            "Zbiór po przekwitnięciu rośliny, gdy liście są łykowate.",
        ],
    },
    {
        "id": "REC-51",
        "title": "Kiszone liście winorośli do gołąbków",
        "subtitle": "Elastyczne, kwaskowate liście do tradycyjnych zawijańców",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 300,
        "defaultSalinityPercent": 3.0,
        "fermentationDays": 10,
        "shelfLifeMonths": 12,
        "recommendedJarType": "Słoik 720ml z szeroką szyjką",
        "ingredients": [
            {"name": "Młode liście winorośli (maj/czerwiec)", "amount": 300, "unit": "g", "isMandatory": True},
            {"name": "Woda filtrowana", "amount": 600, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 27, "unit": "g", "isMandatory": True},
            {"name": "Ząbki czosnku", "amount": 2, "unit": "szt", "isMandatory": False},
        ],
        "steps": [
            "Wybierz zdrowe, nienaruszone liście winorośli o średnicy dłoni, odetnij ogonki.",
            "Układaj liście w stosy po 10 sztuk i zwijaj w zwarte cygara.",
            "Umieść rulony pionowo w słoiku, upychając je ściśle obok siebie.",
            "Zalej gorącą solanką 3.0%, zamknij słoik i pozostaw do powolnego ostygnięcia i fermentacji.",
            "Po 10 dniach liście zmienią kolor na oliwkowy i będą miękkie, elastyczne i trwałe.",
        ],
        "crispnessSecrets": [
            "Gorąca solanka natychmiast uelastycznia liście i zapobiega pękaniu przy zwijaniu.",
            "Podwyższona sól 3.0% gwarantuje całoroczną trwałość bez pasteryzacji.",
        ],
        "sensoryMilestones": [
            {"day": 3, "title": "Zmiana barwy", "sensoryDescription": "Żywa zieleń przechodzi w głęboki kolor oliwkowo-brunatny."},
            {"day": 7, "title": "Kwas cytrynowo-mlekowy", "sensoryDescription": "Liście pachną rześko i winnie.", "isTastingCheckpoint": True},
            {"day": 10, "title": "Gotowość", "sensoryDescription": "Idealna elastyczność do rolowania z farszem mięsnym lub jaglanym.", "actionRequired": "Gotowe do użycia"},
        ],
        "commonMistakes": [
            "Użycie starych, twardych liści z późnego lata z grubo unerwioną blaszką.",
        ],
    },
    {
        "id": "REC-52",
        "title": "Kiszona kalarepa z koperkiem i czosnkiem",
        "subtitle": "Krystalicznie chrupkie słupki o słodko-kwaśnym finiszu",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 600,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 5,
        "shelfLifeMonths": 4,
        "recommendedJarType": "Słoik Twist-Off 1.0L",
        "ingredients": [
            {"name": "Kalarepa młoda soczysta", "amount": 600, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kłodawska", "amount": 24, "unit": "g", "isMandatory": True},
            {"name": "Czosnek w plasterkach", "amount": 3, "unit": "szt", "isMandatory": True},
            {"name": "Koper ogrodowy z baldachem", "amount": 1, "unit": "szt", "isMandatory": True},
            {"name": "Liść laurowy", "amount": 1, "unit": "szt", "isMandatory": False},
        ],
        "steps": [
            "Obrierz kalarepę ze zdrewniałej zewnętrznej skórki i pokrój w słupki o grubości 1 cm.",
            "Ułóż pionowo w słoiku z czosnkiem i koprem.",
            "Zalej solanką 2.2% i zabezpiecz dociskiem szklanym.",
            "Trzymaj na blacie przez 4–6 dni.",
        ],
        "crispnessSecrets": [
            "Kalarepa zachowuje twardość znacznie dłużej niż rzodkiewka dzięki zwartej strukturze ksyloglukanowej.",
        ],
        "sensoryMilestones": [
            {"day": 2, "title": "Aromat kopru", "sensoryDescription": "Kalarepa nasiąka zapachem czosnku i kopru."},
            {"day": 4, "title": "Chrupki kęs", "sensoryDescription": "Świeży, słodko-kwasowy trzask pod zębami.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": [
            "Niedokładne okrojenie nasady kalarepy, która bywa włóknista.",
        ],
    },
    {
        "id": "REC-53",
        "title": "Kiszona rzodkiew biała z czarnuszką",
        "subtitle": "Wyraziste plastry o pieprznym charakterze",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 700,
        "defaultSalinityPercent": 2.3,
        "fermentationDays": 7,
        "shelfLifeMonths": 5,
        "recommendedJarType": "Słoik 1.0L",
        "ingredients": [
            {"name": "Biała rzodkiew (sopel lodu lub okrągła)", "amount": 700, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 600, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 30, "unit": "g", "isMandatory": True},
            {"name": "Nasiona czarnuszki", "amount": 1, "unit": "łyżka", "isMandatory": True},
            {"name": "Świeży lubczyk", "amount": 2, "unit": "gałązka", "isMandatory": False},
        ],
        "steps": [
            "Rzodkiew obierz i pokrój w plastry o grubości 5 mm.",
            "Układaj warstwami, przesypując czarnuszką i przekładając liśćmi lubczyku.",
            "Zalej solanką i odstaw na blat.",
        ],
        "crispnessSecrets": [
            "Czarnuszka nadaje nuty ziołowo-korzenne i działa bakteriostatycznie na dzikie pleśnie.",
        ],
        "sensoryMilestones": [
            {"day": 3, "title": "Uwalnianie glukozynolanów", "sensoryDescription": "Ostry zapach rzodkwi łagodnieje na rzecz kwasu mlekowego."},
            {"day": 6, "title": "Pikantny kwas", "sensoryDescription": "Wyważony, rześki smak z aromatem czarnuszki.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Zbyt cienkie plastry, które po kilku dniach wiotczeją."],
    },
    {
        "id": "REC-54",
        "title": "Kiszone buraki w plastrach z chrzanem",
        "subtitle": "Kresowy dodatek obiadowy i baza do carpaccio",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 1000,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 8,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Słoik 1.5L Twist-Off",
        "ingredients": [
            {"name": "Buraki ćwikłowe podłużne", "amount": 1000, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 800, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 40, "unit": "g", "isMandatory": True},
            {"name": "Korzeń chrzanu", "amount": 20, "unit": "g", "isMandatory": True},
            {"name": "Kmlinek cały", "amount": 1, "unit": "łyżeczka", "isMandatory": True},
        ],
        "steps": [
            "Buraki wyszoruj, obierz i pokrój w plastry 4–5 mm.",
            "Ułóż w słoiku z kawałkami ostrego chrzanu i kminkiem.",
            "Zalej solanką, dociśnij ciężarkiem i fermentuj przez 8 dni.",
        ],
        "crispnessSecrets": [
            "Chrzan dostarcza synigryny chroniącej buraki przed nadmiernym rozmiękaniem.",
        ],
        "sensoryMilestones": [
            {"day": 4, "title": "Rubinowa głębia", "sensoryDescription": "Płyn staje się purpurowy, buraki przechodzą kwasem."},
            {"day": 8, "title": "Chrupki plaster", "sensoryDescription": "Idealny balans ziemistego smaku i kwasowości.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Gotowanie buraków przed kiszeniem — kisimy wyłącznie na surowo."],
    },
    {
        "id": "REC-55",
        "title": "Kiszony seler korzeniowy z jabłkiem",
        "subtitle": "Subtelna orzechowa kwasowość o chrupkiej fakturze",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 600,
        "defaultSalinityPercent": 2.0,
        "fermentationDays": 6,
        "shelfLifeMonths": 5,
        "recommendedJarType": "Słoik 1.0L",
        "ingredients": [
            {"name": "Seler korzeniowy", "amount": 450, "unit": "g", "isMandatory": True},
            {"name": "Jabłko twarde kwaśne (np. szara reneta)", "amount": 150, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 22, "unit": "g", "isMandatory": True},
            {"name": "Ziarna kolendry", "amount": 1, "unit": "łyżeczka", "isMandatory": False},
        ],
        "steps": [
            "Seler i jabłko obierz i pokrój w zapałki julienne lub cienkie słupki.",
            "Wymieszaj składniki z ziarnami kolendry i upakuj w słoiku.",
            "Zalej solanką 2.0% i pozostaw na 5–6 dni.",
        ],
        "crispnessSecrets": ["Kwas jabłkowy z renety przyspiesza spadek pH w pierwszych 24h."],
        "sensoryMilestones": [
            {"day": 3, "title": "Aromat kolendry", "sensoryDescription": "Seler traci surową goryczkę."},
            {"day": 6, "title": "Gotowość", "sensoryDescription": "Niezwykle chrupki dodatek do sałatek rybnych i mięs.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Użycie mączystego, miękkiego jabłka."],
    },
    {
        "id": "REC-56",
        "title": "Kiszone borowiki w igliwiu sosnowym",
        "subtitle": "Leśny luksus fermentowany z nutą żywiczną",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 500,
        "defaultSalinityPercent": 2.4,
        "fermentationDays": 10,
        "shelfLifeMonths": 8,
        "recommendedJarType": "Słoik 720ml z klipsem",
        "ingredients": [
            {"name": "Młode borowiki szlachetne (same twarde kapelusze)", "amount": 500, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 400, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 22, "unit": "g", "isMandatory": True},
            {"name": "Młode igły sosny lub świerku (wyparzone)", "amount": 5, "unit": "g", "isMandatory": True},
            {"name": "Pieprz czarny w ziarnach", "amount": 6, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Borowiki dokładnie oczyść i zblanszuj we wrzątku przez 2 minuty.",
            "Ułóż w wyparzonym słoiku z igliwiem i pieprzem.",
            "Zalej solanką 2.4%, zamknij i pozostaw w chłodnym pomieszczeniu (16–18°C).",
        ],
        "crispnessSecrets": ["Krótkie blanszowanie zamyka pory grzyba i chroni przed śluzowaceniem."],
        "sensoryMilestones": [
            {"day": 5, "title": "Żywiczna solanka", "sensoryDescription": "Zalewa pachnie młodym borem i kwasem."},
            {"day": 10, "title": "Aksamitny grzyb", "sensoryDescription": "Szlachetna faktura i głęboki umami.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Użycie przerośniętych, gąbczastych borowików."],
    },
    {
        "id": "REC-57",
        "title": "Kiszone jabłka antonówki z żurawiną",
        "subtitle": "Kresowy przysmak do pieczonych mięs i serów",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 1000,
        "defaultSalinityPercent": 1.8,
        "fermentationDays": 14,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Kamionka lub słoik 2.0L",
        "ingredients": [
            {"name": "Twarde jabłka antonówki (całe)", "amount": 1000, "unit": "g", "isMandatory": True},
            {"name": "Świeża żurawina", "amount": 100, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 1000, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 36, "unit": "g", "isMandatory": True},
            {"name": "Miód gryczany lub wielokwiatowy", "amount": 20, "unit": "g", "isMandatory": False},
            {"name": "Liście czarnej porzeczki i wiśni", "amount": 6, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Wybierz nienaruszone, twarde jabłka z ogonkami.",
            "Ułóż na dnie kamionki liście, a następnie warstwami jabłka przesypując żurawiną.",
            "W ciepłej wodzie rozpuść sól i miód, ostudź i zalej owoce.",
            "Dociśnij talerzykiem, by jabłka były całkowicie zanurzone.",
        ],
        "crispnessSecrets": ["Żurawina dostarcza naturalnego kwasu benzoesowego, który chroni przed drożdżami kożuszkującymi."],
        "sensoryMilestones": [
            {"day": 7, "title": "Gazowanie musujące", "sensoryDescription": "Miąższ jabłek staje się delikatnie musujący (perlisty)."},
            {"day": 14, "title": "Orzeźwiający kwas", "sensoryDescription": "Jabłka są kwaskowate, winne i jędrne.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Krojenie jabłek — kisimy wyłącznie całe owoce bez nakłuwania."],
    },
    {
        "id": "REC-58",
        "title": "Kiszony jarmuż z czosnkiem i kolendrą",
        "subtitle": "Zielona probiotyczna bomba o pikantnym posmaku",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 400,
        "defaultSalinityPercent": 2.0,
        "fermentationDays": 5,
        "shelfLifeMonths": 4,
        "recommendedJarType": "Słoik 720ml",
        "ingredients": [
            {"name": "Liście jarmużu (bez twardych nerwów)", "amount": 400, "unit": "g", "isMandatory": True},
            {"name": "Sól kłodawska", "amount": 8, "unit": "g", "isMandatory": True},
            {"name": "Ząbki czosnku zmiażdżone", "amount": 3, "unit": "szt", "isMandatory": True},
            {"name": "Nasiona kolendry uprażone", "amount": 1, "unit": "łyżeczka", "isMandatory": True},
        ],
        "steps": [
            "Liście jarmużu porwij na mniejsze kawałki, usuwając grube łodygi.",
            "Posyp solą i energicznie masuj przez 5 minut, aż jarmuż drastycznie zmniejszy objętość i puści sok.",
            "Wymieszaj z czosnkiem i kolendrą, ubij bardzo ciasno w słoiku.",
        ],
        "crispnessSecrets": ["Wstępne zmrożenie jarmużu zmiękcza celulozę i ułatwia masaż solny."],
        "sensoryMilestones": [
            {"day": 2, "title": "Sok własny", "sensoryDescription": "Zielony sok przykrywa liście."},
            {"day": 5, "title": "Gotowość", "sensoryDescription": "Ziemisty, kwaskowaty smak z czosnkiem.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Pozostawienie twardych łodyg centralnych."],
    },
    {
        "id": "REC-59",
        "title": "Kiszona brukselka z gorczycą i zielem",
        "subtitle": "Chrupiące miniaturowe kapustki bez grama goryczy",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 600,
        "defaultSalinityPercent": 2.5,
        "fermentationDays": 10,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Słoik 1.0L",
        "ingredients": [
            {"name": "Świeża brukselka", "amount": 600, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 27, "unit": "g", "isMandatory": True},
            {"name": "Ziarna gorczycy żółtej", "amount": 1, "unit": "łyżka", "isMandatory": True},
            {"name": "Ziele angielskie", "amount": 5, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Brukselkę oczyść z zewnętrznych listków i nacinij głąb na krzyż na głębokość 5 mm.",
            "Ułóż ciasno w słoiku, dodaj gorczycę i ziele.",
            "Zalej solanką 2.5% i odstaw na 10 dni.",
        ],
        "crispnessSecrets": ["Nacięcie głąba na krzyż umożliwia równomierne przenikanie solanki do środka główki."],
        "sensoryMilestones": [
            {"day": 5, "title": "Złagodzenie", "sensoryDescription": "Siarkowe nuty brukselki ustępują aromatowi mlekowemu."},
            {"day": 10, "title": "Pyszna chrupkość", "sensoryDescription": "Świetna przekąska do deski serów.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Użycie żółknącej brukselki z marketu."],
    },
    {
        "id": "REC-60",
        "title": "Kiszony topinambur z tymiankiem",
        "subtitle": "Karczoch jerozolimski w probiotycznej odsłonie",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 600,
        "defaultSalinityPercent": 2.3,
        "fermentationDays": 7,
        "shelfLifeMonths": 5,
        "recommendedJarType": "Słoik 1.0L",
        "ingredients": [
            {"name": "Bulwy topinamburu", "amount": 600, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kłodawska", "amount": 25, "unit": "g", "isMandatory": True},
            {"name": "Świeży tymianek", "amount": 3, "unit": "gałązka", "isMandatory": True},
            {"name": "Ząbki czosnku", "amount": 3, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Topinambur dokładnie wyszoruj szczoteczką (nie trzeba obierać ze skórki).",
            "Pokrój w plastry 5 mm i natychmiast ułóż w słoiku z ziołami.",
            "Zalej solanką 2.3% i zabezpiecz dociskiem.",
        ],
        "crispnessSecrets": ["Inulina zawarta w topinamburze jest doskonałym prebiotykiem stymulującym bakterie kwasu mlekowego."],
        "sensoryMilestones": [
            {"day": 3, "title": "Aromat orzechowy", "sensoryDescription": "Słodko-orzechowy zapach łączy się z tymiankiem."},
            {"day": 7, "title": "Chrupki finał", "sensoryDescription": "Kwasowość redukuje uczucie ciężkości topinamburu.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Pozostawienie pokrojonego topinamburu na powietrzu (szybko ciemnieje wskutek utleniania)."],
    },
    {
        "id": "REC-61",
        "title": "Kiszony pasternak z kminkiem",
        "subtitle": "Słodki korzeń przodków w orzeźwiającym kwasie",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 600,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 8,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Słoik 1.0L",
        "ingredients": [
            {"name": "Pasternak korzeniowy", "amount": 600, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 24, "unit": "g", "isMandatory": True},
            {"name": "Kminek cały", "amount": 1, "unit": "łyżka", "isMandatory": True},
        ],
        "steps": [
            "Pasternak obierz i pokrój w podłużne słupki.",
            "Ułóż pionowo w słoiku, dodając kminek.",
            "Zalej solanką 2.2% i fermentuj przez 8 dni.",
        ],
        "crispnessSecrets": ["Naturalna słodycz pasternaku daje paliwo bakteriom fermentacyjnym bez dodatku cukru."],
        "sensoryMilestones": [
            {"day": 4, "title": "Równowaga", "sensoryDescription": "Słodycz przełamana pierwszym kwasem."},
            {"day": 8, "title": "Dojrzałość", "sensoryDescription": "Doskonały zamiennik kiszonej pietruszki.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Mylenie pasternaku z pietruszką (pasternak ma wgłębioną nasadę liściową)."],
    },
    {
        "id": "REC-62",
        "title": "Barszcz biały na zakwasie pszennym",
        "subtitle": "Kremowy, aksamitny zakwas z mąki orkiszowej lub pszennej typ 1850",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 200,
        "defaultSalinityPercent": 0.5,
        "fermentationDays": 4,
        "shelfLifeMonths": 2,
        "recommendedJarType": "Słój 1.5L",
        "ingredients": [
            {"name": "Mąka pszenna graham lub orkiszowa razowa", "amount": 200, "unit": "g", "isMandatory": True},
            {"name": "Woda przegotowana letnia", "amount": 1000, "unit": "ml", "isMandatory": True},
            {"name": "Czosnek zgnieciony", "amount": 4, "unit": "szt", "isMandatory": True},
            {"name": "Majeranek", "amount": 1, "unit": "łyżka", "isMandatory": True},
            {"name": "Liść laurowy", "amount": 2, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Mąkę wymieszaj z letnią wodą w słoju.",
            "Dodaj przyprawy, przykryj lnianą ściereczką i mieszaj raz dziennie.",
            "Po 4 dniach przecedź do butelek.",
        ],
        "crispnessSecrets": ["Mąka orkiszowa daje łagodniejszy, bardziej maślany profil kwasowy niż żyto."],
        "sensoryMilestones": [
            {"day": 2, "title": "Aktywność", "sensoryDescription": "Pojawia się przyjemny zapach fermentu pszennego."},
            {"day": 4, "title": "Optimum", "sensoryDescription": "Kwas jest delikatny, nie drapie w gardło.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Użycie zbyt gorącej wody (>40°C), która zaparza mąkę."],
    },
    {
        "id": "REC-63",
        "title": "Kiszone rzodkiewki całe w różowej solance",
        "subtitle": "Szybki 3-dniowy przysmak o bajecznym kolorze",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 500,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 4,
        "shelfLifeMonths": 3,
        "recommendedJarType": "Słoik 720ml",
        "ingredients": [
            {"name": "Rzodkiewki gruntowe z ogonkiem", "amount": 500, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 400, "unit": "ml", "isMandatory": True},
            {"name": "Sól kłodawska", "amount": 20, "unit": "g", "isMandatory": True},
            {"name": "Koper z baldachem", "amount": 1, "unit": "szt", "isMandatory": True},
            {"name": "Ząbek czosnku", "amount": 2, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Rzodkiewki umyj, odetnij liście, zostawiając mały ogonek.",
            "Upakuj całe rzodkiewki w słoiku z czosnkiem i koprem.",
            "Zalej solanką 2.2% i zamknij słoik.",
        ],
        "crispnessSecrets": ["Kiszone w całości zachowują twardość wewnątrz, oddając barwnik antocyjanowy do zalewy."],
        "sensoryMilestones": [
            {"day": 2, "title": "Różowa poświata", "sensoryDescription": "Zalewa nabiera intensywnego koloru fuksji."},
            {"day": 4, "title": "Chrupnięcie", "sensoryDescription": "Ostrość rzodkiewki zmienia się w soczysty kwas.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Przekrajanie rzodkiewek — całe są znacznie bardziej chrupkie."],
    },
    {
        "id": "REC-64",
        "title": "Kiszona marchewka z nasionami kopru włoskiego",
        "subtitle": "Słodko-anyżowe chrupkie paluszki",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 600,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 7,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Słoik 1.0L",
        "ingredients": [
            {"name": "Młoda marchewka", "amount": 600, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 24, "unit": "g", "isMandatory": True},
            {"name": "Nasiona fenkułu (kopru włoskiego)", "amount": 1, "unit": "łyżeczka", "isMandatory": True},
            {"name": "Czosnek", "amount": 2, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Marchew obierz i pokrój w równe słupki dopasowane do wysokości słoika.",
            "Ustaw pionowo, dodaj nasiona fenkułu i czosnek.",
            "Zalej solanką i dociśnij ciężarkiem.",
        ],
        "crispnessSecrets": ["Koper włoski doskonale łączy się z naturalnymi cukrami marchwi."],
        "sensoryMilestones": [
            {"day": 4, "title": "Aromat anyżowy", "sensoryDescription": "Koper włoski uwalnia olejki eteryczne."},
            {"day": 7, "title": "Jędrny kęs", "sensoryDescription": "Marchewka nie mięknie, pozostaje twarda i soczysta.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Użycie wiotkiej, starej marchwi z marketu."],
    },
    {
        "id": "REC-65",
        "title": "Kiszona papryka słodka w całości",
        "subtitle": "Południowopolski specjał z czosnkiem i liściem chrzanu",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 800,
        "defaultSalinityPercent": 2.5,
        "fermentationDays": 10,
        "shelfLifeMonths": 6,
        "recommendedJarType": "Słój 2.0L",
        "ingredients": [
            {"name": "Grubościenna papryka czerwona lub żółta", "amount": 800, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 800, "unit": "ml", "isMandatory": True},
            {"name": "Sól kamienna", "amount": 40, "unit": "g", "isMandatory": True},
            {"name": "Liść chrzanu", "amount": 2, "unit": "szt", "isMandatory": True},
            {"name": "Czosnek w łupinach", "amount": 4, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Papryki umyj, delikatnie nakłuj wykałaczką w 2–3 miejscach, aby solanka wpłynęła do środka.",
            "Ułóż ciasno w słoju, przekładając liśćmi chrzanu i czosnkiem.",
            "Zalej solanką 2.5% i dociśnij ciężarkiem.",
        ],
        "crispnessSecrets": ["Nakłucie zapobiega gromadzeniu się pęcherzy powietrza w komorze nasiennej."],
        "sensoryMilestones": [
            {"day": 5, "title": "Wnikanie solanki", "sensoryDescription": "Papryka staje się ciężka i całkowicie wypełniona płynem."},
            {"day": 10, "title": "Głęboki kwas", "sensoryDescription": "Miąższ papryki jest gruby, jędrny i orzeźwiający.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Brak nakłucia — papryka pływa po powierzchni i pleśnieje od środka."],
    },
    {
        "id": "REC-66",
        "title": "Kiszone szparagi białe z gorczycą",
        "subtitle": "Wiosenna elegancja w solance koperkowej",
        "culture": "Polska",
        "category": "poland_central_europe",
        "method": "lacto_fermentation",
        "defaultProduceWeightGrams": 500,
        "defaultSalinityPercent": 2.2,
        "fermentationDays": 5,
        "shelfLifeMonths": 4,
        "recommendedJarType": "Wysoki słoik 1.0L",
        "ingredients": [
            {"name": "Białe szparagi", "amount": 500, "unit": "g", "isMandatory": True},
            {"name": "Woda", "amount": 500, "unit": "ml", "isMandatory": True},
            {"name": "Sól kłodawska", "amount": 22, "unit": "g", "isMandatory": True},
            {"name": "Ziarna gorczycy", "amount": 1, "unit": "łyżeczka", "isMandatory": True},
            {"name": "Gałązka świeżego kopru", "amount": 1, "unit": "szt", "isMandatory": True},
        ],
        "steps": [
            "Szparagi dokładnie obierz od główki w dół i odłam zdrewniałe końce.",
            "Ustaw pionowo główkami do góry w wysokim słoiku.",
            "Dodaj gorczycę i koper, zalej letnią solanką.",
        ],
        "crispnessSecrets": ["Delikatne główki szparagów pozostają nienaruszone, gdy stoją pionowo."],
        "sensoryMilestones": [
            {"day": 3, "title": "Kwas maślany", "sensoryDescription": "Goryczka szparaga znika, pojawia się nuta kwasowa."},
            {"day": 5, "title": "Perfekcja", "sensoryDescription": "Jędrne, chrupkie szparagi doskonałe do sałatek.", "isTastingCheckpoint": True},
        ],
        "commonMistakes": ["Niedokładne obranie białych szparagów pozostawiające włókna."],
    },
]

from recipes_data_asia import ASIA_RECIPES
from recipes_data_mideast import MIDEAST_RECIPES
from recipes_data_americas import AMERICAS_RECIPES
from recipes_data_preserves_drinks import PRESERVES_AND_DRINKS_RECIPES

ALL_NEW_RECIPES = NEW_RECIPES + ASIA_RECIPES + MIDEAST_RECIPES + AMERICAS_RECIPES + PRESERVES_AND_DRINKS_RECIPES

print(f"Liczba nowych receptur: {len(ALL_NEW_RECIPES)}")
assert len(ALL_NEW_RECIPES) == 109, f"Oczekiwano 109 nowych receptur, otrzymano {len(ALL_NEW_RECIPES)}"

# Weryfikacja sekwencji ID od REC-47 do REC-155
for i, r in enumerate(ALL_NEW_RECIPES, start=47):
    expected_id = f"REC-{i:02d}" if i < 100 else f"REC-{i}"
    assert r["id"] == expected_id, f"Błędny ID na pozycji {i}: {r['id']} != {expected_id}"

def format_ts_recipe(r):
    lines = []
    lines.append(f"  {{")
    lines.append(f"    id: '{r['id']}',")
    lines.append(f"    title: {json.dumps(r['title'], ensure_ascii=False)},")
    lines.append(f"    subtitle: {json.dumps(r['subtitle'], ensure_ascii=False)},")
    lines.append(f"    culture: {json.dumps(r['culture'], ensure_ascii=False)},")
    lines.append(f"    category: '{r['category']}',")
    lines.append(f"    method: '{r['method']}',")
    lines.append(f"    defaultProduceWeightGrams: {r['defaultProduceWeightGrams']},")
    lines.append(f"    defaultSalinityPercent: {r['defaultSalinityPercent']},")
    lines.append(f"    fermentationDays: {r['fermentationDays']},")
    lines.append(f"    shelfLifeMonths: {r['shelfLifeMonths']},")
    lines.append(f"    recommendedJarType: {json.dumps(r['recommendedJarType'], ensure_ascii=False)},")
    
    # Ingredients
    VALID_UNITS = {'g', 'ml', 'szt', 'łyżka', 'łyżeczka', 'do_smaku'}
    lines.append(f"    ingredients: [")
    for ing in r['ingredients']:
        unit = ing['unit']
        if unit not in VALID_UNITS:
            unit = 'szt' if unit == 'gałązka' else ('do_smaku' if unit == 'szczypta' else 'szt')
        note_str = f", notes: {json.dumps(ing['notes'], ensure_ascii=False)}" if 'notes' in ing else ""
        lines.append(f"      {{ name: {json.dumps(ing['name'], ensure_ascii=False)}, amount: {ing['amount']}, unit: '{unit}', isMandatory: {'true' if ing['isMandatory'] else 'false'}{note_str} }},")
    lines.append(f"    ],")
    
    # Steps
    lines.append(f"    steps: [")
    for step in r['steps']:
        lines.append(f"      {json.dumps(step, ensure_ascii=False)},")
    lines.append(f"    ],")
    
    # Crispness secrets
    lines.append(f"    crispnessSecrets: [")
    for sec in r['crispnessSecrets']:
        lines.append(f"      {json.dumps(sec, ensure_ascii=False)},")
    lines.append(f"    ],")
    
    # Sensory milestones
    lines.append(f"    sensoryMilestones: [")
    for ms in r['sensoryMilestones']:
        taste_str = ", isTastingCheckpoint: true" if ms.get('isTastingCheckpoint') else ""
        action_str = f", actionRequired: {json.dumps(ms['actionRequired'], ensure_ascii=False)}" if ms.get('actionRequired') else ""
        lines.append(f"      {{ day: {ms['day']}, title: {json.dumps(ms['title'], ensure_ascii=False)}, sensoryDescription: {json.dumps(ms['sensoryDescription'], ensure_ascii=False)}{taste_str}{action_str} }},")
    lines.append(f"    ],")
    
    # Common mistakes
    lines.append(f"    commonMistakes: [")
    for mis in r['commonMistakes']:
        lines.append(f"      {json.dumps(mis, ensure_ascii=False)},")
    lines.append(f"    ],")
    
    lines.append(f"  }},")
    return "\n".join(lines)

def run():
    target_path = "src/core/recipes/recipes-data.ts"
    with open(target_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Znajdź pozycję zamknięcia MASTER_RECIPES
    marker = "\n];\n\nexport function getRecipeById"
    assert marker in content, f"Nie znaleziono markera zamknięcia w {target_path}"
    
    ts_blocks = [format_ts_recipe(r) for r in ALL_NEW_RECIPES]
    new_recipes_ts = "\n" + "\n".join(ts_blocks) + "\n"
    
    new_content = content.replace(marker, new_recipes_ts + marker)
    
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Pomyślnie zaktualizowano {target_path} do 155 receptur!")

if __name__ == "__main__":
    run()

