// ============================================================================
// Słoik (Jarwise) — Freeform Wild Ferment Composer (Styl Dowolny)
// Apps4Craft Studio: Inteligentny kompozytor fermentacji na bazie składników.
// 100% Czysta funkcja, deterministyczna, offline-first.
// ============================================================================

export type ProduceCategory = 'leafy' | 'crunchy' | 'root' | 'pepper' | 'allium' | 'fruit' | 'other';

export interface FreeformProduceItem {
  id: string;
  name: string;
  emoji: string;
  category: ProduceCategory;
  prefersDrySalting: boolean;
  baseSalinity: number;
  waterRatio: number;
  suggestedHerbs: string[];
  craftTip: string;
}

export interface FreeformSuggestion {
  title: string;
  subtitle: string;
  isDrySalting: boolean;
  recommendedSalinityPercent: number;
  waterRatio: number;
  calculatedWaterMl: number;
  calculatedSaltGrams: number;
  produceWeightGrams: number;
  fermentationDays: number;
  suggestedHerbs: string[];
  craftTips: string[];
  steps: string[];
  selectedItems: FreeformProduceItem[];
}

export const FREEFORM_PRODUCE: FreeformProduceItem[] = [
  {
    id: 'cucumber',
    name: 'Ogórki gruntowe',
    emoji: '🥒',
    category: 'crunchy',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Czosnek (3 ząbki)', 'Baldach kopru z nasionami', 'Korzeń chrzanu', 'Liść dębu lub porzeczki', 'Gorczyca biała'],
    craftTip: 'Kąpiel lodowa (1h) przed kiszeniem nasyca komórki ogórka i zapewnia żelazny trzask.',
  },
  {
    id: 'cabbage_white',
    name: 'Kapusta biała / włoska',
    emoji: '🥬',
    category: 'leafy',
    prefersDrySalting: true,
    baseSalinity: 2.0,
    waterRatio: 0,
    suggestedHerbs: ['Kminek całe ziarno', 'Liść laurowy', 'Ziele angielskie', 'Marchew wiórki'],
    craftTip: 'Szatkuj drobno i energicznie ugniataj z solą, aż warzywo całkowicie pokryje się własnym sokiem.',
  },
  {
    id: 'cabbage_red',
    name: 'Kapusta czerwona',
    emoji: '🟣',
    category: 'leafy',
    prefersDrySalting: true,
    baseSalinity: 2.0,
    waterRatio: 0,
    suggestedHerbs: ['Goździki całe', 'Liść laurowy', 'Kawałki kwaśnego jabłka', 'Ziele angielskie'],
    craftTip: 'Czerwona kapusta potrzebuje 2–3 dni dłużej na zmiękczenie niż biała ze względu na grubsze włókna.',
  },
  {
    id: 'cabbage_napa',
    name: 'Kapusta pekińska',
    emoji: '🥗',
    category: 'leafy',
    prefersDrySalting: true,
    baseSalinity: 2.2,
    waterRatio: 0,
    suggestedHerbs: ['Płatki chili (Gochugaru)', 'Świeży starty imbir', 'Posiekany czosnek', 'Szczypiorek / dymka'],
    craftTip: 'Przekładaj liście pastą przyprawową i ciasno upakuj w słoiku, by wycisnąć pęcherzyki powietrza.',
  },
  {
    id: 'carrot',
    name: 'Marchew',
    emoji: '🥕',
    category: 'root',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Plasterki imbiru', 'Ziarna kolendry', 'Czosnek', 'Ziele angielskie'],
    craftTip: 'Krój w grube słupki lub monety — cienkie paski szybciej tracą chrupkość.',
  },
  {
    id: 'beet',
    name: 'Buraki',
    emoji: '🟤',
    category: 'root',
    prefersDrySalting: false,
    baseSalinity: 2.0,
    waterRatio: 1.0,
    suggestedHerbs: ['Czosnek w łupinach', 'Liść laurowy', 'Ziele angielskie', 'Skórka chleba żytniego (opcjonalnie)'],
    craftTip: 'Buraki dają głęboki rubinowy zakwas probiotyczny — nie wyrzucaj płynu po ukiszeniu!',
  },
  {
    id: 'garlic',
    name: 'Czosnek',
    emoji: '🧄',
    category: 'allium',
    prefersDrySalting: false,
    baseSalinity: 3.0,
    waterRatio: 0.8,
    suggestedHerbs: ['Świeży tymianek', 'Liść laurowy', 'Czarny pieprz ziarnisty', 'Płatki chili'],
    craftTip: 'Czosnek może zsinieć na turkusowo w pierwszych dniach — to naturalna reakcja enzymów na kwas, w 100% bezpieczna.',
  },
  {
    id: 'onion',
    name: 'Cebula / Dymka',
    emoji: '🧅',
    category: 'allium',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Gorczyca', 'Ziele angielskie', 'Czarny pieprz', 'Liść laurowy'],
    craftTip: 'Czerwona cebula w fermentacji zamienia się w chrupiący dodatek do tacosów i burgerów.',
  },
  {
    id: 'bell_pepper',
    name: 'Papryka słodka',
    emoji: '🫑',
    category: 'pepper',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Czosnek', 'Suszone oregano', 'Ziele angielskie', 'Liście selera'],
    craftTip: 'Papryka ma delikatną skórkę — ułóż kawałki pionowo skórką na zewnątrz, by nie gromadzić gazu pod spodem.',
  },
  {
    id: 'hot_pepper',
    name: 'Papryczki chili / Jalapeño',
    emoji: '🌶️',
    category: 'pepper',
    prefersDrySalting: false,
    baseSalinity: 3.5,
    waterRatio: 0.85,
    suggestedHerbs: ['Czosnek (dużo)', 'Oregano meksykańskie', 'Ziarna kolendry', 'Ziele angielskie'],
    craftTip: 'Wyższe stężenie soli (3.5%) chroni ferment przed drożdżami kożuchującymi na powierzchni olejków kapsaicyny.',
  },
  {
    id: 'cauliflower',
    name: 'Kalafior',
    emoji: '🥦',
    category: 'crunchy',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.85,
    suggestedHerbs: ['Mielona kurkuma (złoty kolor)', 'Gorczyca biała', 'Czosnek', 'Koper'],
    craftTip: 'Dziel na zwarte różyczki — z dodatkiem kurkumy zyskuje oszałamiający złocisty kolor i orientalny aromat.',
  },
  {
    id: 'radish',
    name: 'Rzodkiewka / Daikon',
    emoji: '⚪',
    category: 'crunchy',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Szczypiorek', 'Czosnek', 'Świeży imbir', 'Płatki chili'],
    craftTip: 'Rzodkiewki kiszą się błyskawicznie — po 3–4 dniach solanka robi się różowa, a miąższ lekko kwasowy.',
  },
  {
    id: 'ginger',
    name: 'Imbir',
    emoji: '🫚',
    category: 'root',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Cytryna w plastrach', 'Kurkuma', 'Czosnek', 'Ziarna pieprzu'],
    craftTip: 'Imbir ma naturalnie potężną florę dzikich drożdży — idealny jako rozgrzewający dodatek.',
  },
  {
    id: 'apple',
    name: 'Jabłka / Gruszki',
    emoji: '🍏',
    category: 'fruit',
    prefersDrySalting: false,
    baseSalinity: 2.0,
    waterRatio: 0.8,
    suggestedHerbs: ['Laska cynamonu', 'Goździki', 'Kardamon', 'Świeży imbir'],
    craftTip: 'Owoce fermentują szybko ze względu na cukry proste — sprawdzaj smak już od 2. dnia.',
  },
  {
    id: 'tomato',
    name: 'Pomidory (zielone lub koktajlowe)',
    emoji: '🍅',
    category: 'fruit',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.85,
    suggestedHerbs: ['Liść chrzanu', 'Czosnek', 'Świeża bazylia', 'Koper', 'Pieprz ziarnisty'],
    craftTip: 'Nakłuj każdy pomidorek wykałaczką przy szypułce, by solanka wniknęła do środka i zapobiegła pękaniu skórki.',
  },
  {
    id: 'zucchini',
    name: 'Cukinia / Kabaczek',
    emoji: '🌿',
    category: 'crunchy',
    prefersDrySalting: false,
    baseSalinity: 2.2,
    waterRatio: 0.8,
    suggestedHerbs: ['Czosnek', 'Koper', 'Gorczyca', 'Liść dębu dla tanin'],
    craftTip: 'Cukinia ma miękki miąższ — koniecznie dodaj liść dębu lub porzeczki, by zachować chrupkość.',
  },
  {
    id: 'mushroom',
    name: 'Grzyby leśne / pieczarki',
    emoji: '🍄',
    category: 'other',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Ziele angielskie', 'Liść laurowy', 'Cebula w piórkach', 'Czarny pieprz'],
    craftTip: 'Grzyby zblanszuj we wrzątku przez 2 minuty przed zalaniem solanką.',
  },
  {
    id: 'lemon',
    name: 'Cytryny / Cytrusy',
    emoji: '🍋',
    category: 'fruit',
    prefersDrySalting: true,
    baseSalinity: 5.0,
    waterRatio: 0,
    suggestedHerbs: ['Gruba sól morska', 'Kora cynamonu', 'Kardamon w ziarnach', 'Goździki'],
    craftTip: 'Nacinaj cytryny na krzyż i obficie zasypuj solą od środka — sok wyciśnięty z owoców musi je zakryć.',
  },
  {
    id: 'pumpkin',
    name: 'Dynia hokkaido / piżmowa',
    emoji: '🎃',
    category: 'root',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.8,
    suggestedHerbs: ['Świeży rozmaryn', 'Imbir', 'Czosnek', 'Ziarna kolendry'],
    craftTip: 'Krój w grubą kostkę — fermentowana dynia ma chrupiącą strukturę i orzechowy posmak.',
  },
  {
    id: 'green_beans',
    name: 'Fasolka szparagowa',
    emoji: '🫘',
    category: 'crunchy',
    prefersDrySalting: false,
    baseSalinity: 2.5,
    waterRatio: 0.85,
    suggestedHerbs: ['Baldach kopru', 'Czosnek', 'Chrzan', 'Gorczyca'],
    craftTip: 'Układaj fasolkę ciasno pionowo jak ogórki — po ukiszeniu jest niesamowicie jędrna.',
  },
];

export function composeFreeformRecipe(
  selectedIds: string[],
  produceWeightGrams: number = 1000
): FreeformSuggestion {
  const items = selectedIds
    .map((id) => FREEFORM_PRODUCE.find((p) => p.id === id))
    .filter((p): p is FreeformProduceItem => Boolean(p));

  const weight = Math.max(100, Math.round(produceWeightGrams));

  if (items.length === 0) {
    return {
      title: 'Styl Dowolny — Wybierz składniki',
      subtitle: 'Zaznacz warzywa ze spiżarni, a aplikacja wyliczy idealną technikę soli i ziół.',
      isDrySalting: false,
      recommendedSalinityPercent: 2.5,
      waterRatio: 0.8,
      calculatedWaterMl: Math.round(weight * 0.8),
      calculatedSaltGrams: Math.round(weight * 0.8 * 0.025),
      produceWeightGrams: weight,
      fermentationDays: 7,
      suggestedHerbs: ['Czosnek', 'Koper', 'Liść laurowy', 'Ziele angielskie'],
      craftTips: ['Wybierz co najmniej jedno warzywo powyżej, aby skomponować autorski nastaw.'],
      steps: [
        'Wybierz z listy warzywa, które masz pod ręką.',
        'Aplikacja dobierze odpowiednie stężenie soli i zioła.',
      ],
      selectedItems: [],
    };
  }

  // 1. Określenie metody: na sucho vs w solance wodnej
  const drySaltingCount = items.filter((i) => i.prefersDrySalting).length;
  const hasLeafyCabbage = items.some((i) => i.category === 'leafy');
  const hasOnlyDrySalters = drySaltingCount === items.length;
  const isDrySalting = hasOnlyDrySalters || (hasLeafyCabbage && drySaltingCount >= items.length / 2);

  // 2. Obliczenie rekomendowanego stężenia soli
  let recommendedSalinity: number;
  const hasHotPeppers = items.some((i) => i.id === 'hot_pepper');
  const hasLemon = items.some((i) => i.id === 'lemon');

  if (hasLemon) {
    recommendedSalinity = 5.0;
  } else if (hasHotPeppers) {
    recommendedSalinity = 3.5;
  } else if (isDrySalting) {
    recommendedSalinity = 2.0;
  } else {
    // Średnia z preferencji wybranych składników
    const sum = items.reduce((acc, curr) => acc + curr.baseSalinity, 0);
    recommendedSalinity = Math.round((sum / items.length) * 10) / 10;
  }

  // 3. Stosunek wody i wyliczenia wagi
  const waterRatio = isDrySalting ? 0 : Math.max(0.7, items[0].waterRatio);
  const calculatedWaterMl = isDrySalting ? 0 : Math.round(weight * waterRatio);
  const calculatedSaltGrams = isDrySalting
    ? Math.round(weight * (recommendedSalinity / 100))
    : Math.round(calculatedWaterMl * (recommendedSalinity / 100));

  // 4. Szacowany czas fermentacji
  let fermentationDays = 7;
  if (items.some((i) => i.id === 'cucumber' || i.id === 'radish')) {
    fermentationDays = 4;
  } else if (hasLemon || items.some((i) => i.id === 'beet')) {
    fermentationDays = 14;
  } else if (isDrySalting) {
    fermentationDays = 10;
  }

  // 5. Harmonijny dobór ziół i przypraw (unikalne)
  const herbsSet = new Set<string>();
  items.forEach((item) => {
    item.suggestedHerbs.forEach((h) => herbsSet.add(h));
  });
  const suggestedHerbs = Array.from(herbsSet).slice(0, 6);

  // 6. Porady rzemieślnicze
  const craftTips = items.map((i) => i.craftTip).slice(0, 3);
  if (isDrySalting) {
    craftTips.push('Upewnij się, że sok całkowicie przykrywa posiekaną masę warzywną.');
  } else {
    craftTips.push('Użyj docisku lub liścia kapusty na wierzchu, by żaden kawałek nie wystawał ponad solankę.');
  }

  // 7. Dynamiczny tytuł i podtytuł
  let title = '';
  if (items.length === 1) {
    title = `Autorski nastaw: ${items[0].name}`;
  } else if (items.length === 2) {
    title = `Autorski duet: ${items[0].name} & ${items[1].name}`;
  } else {
    title = `Miks spiżarni: ${items[0].name}, ${items[1].name} i ${items.length - 2} inne`;
  }

  const subtitle = isDrySalting
    ? `Fermentacja we własnym soku (na sucho) • Sól ${recommendedSalinity}%`
    : `Fermentacja w solance wodnej • Sól ${recommendedSalinity}%`;

  // 8. Kroki przygotowania
  const steps: string[] = [];
  steps.push(
    `Umyj i przygotuj składniki: ${items.map((i) => i.name.toLowerCase()).join(', ')}.`
  );
  if (isDrySalting) {
    steps.push(
      `Poszatkuj warzywa, wymieszaj z ${calculatedSaltGrams}g soli i ugniataj dłońmi w misce przez 5–10 minut, aż puszczą obfity sok.`
    );
    steps.push(
      `Przełóż ciasno do słoika warstwami, dodając sugerowane przyprawy (${suggestedHerbs.slice(0, 3).join(', ')}). Dociśnij, by sok zakrył warzywa.`
    );
  } else {
    steps.push(
      `Ułóż składniki ciasno w wyparzonym słoiku, przekładając przyprawami: ${suggestedHerbs.slice(0, 4).join(', ')}.`
    );
    steps.push(
      `Rozpuść ${calculatedSaltGrams}g soli kamiennej w ${calculatedWaterMl}ml ostudzonej wody, by uzyskać solankę ${recommendedSalinity}%.`
    );
    steps.push('Zalej słoik solanką, pozostawiając 2–3 cm wolnej przestrzeni (headspace) od góry.');
  }
  steps.push('Przykryj wieczkiem (nie zakręcaj szczelnie) i pozostaw na blacie kuchennym.');
  steps.push(`Aktywna fermentacja trwa ok. ${fermentationDays} dni. Spróbuj po kilku dniach i przenieś do chłodu!`);

  return {
    title,
    subtitle,
    isDrySalting,
    recommendedSalinityPercent: recommendedSalinity,
    waterRatio,
    calculatedWaterMl,
    calculatedSaltGrams,
    produceWeightGrams: weight,
    fermentationDays,
    suggestedHerbs,
    craftTips,
    steps,
    selectedItems: items,
  };
}
