// ============================================================================
// Słoik (Jarwise) — Procedury Ratunkowe Nastawu (Emergency Recovery Engine)
// Interaktywne procedury ratowania fermentacji w toku (Apps4Brew Parity S5)
// 100% Offline-First, Deterministyczna mikrobiologia.
// ============================================================================

export interface BrineTopUpInput {
  missingVolumeMl: number;
  targetSalinityPercent: number; // np. 2.0, 2.5, 3.0
}

export interface BrineTopUpOutput {
  waterMl: number;
  saltGrams: number;
  effectiveSalinityPercent: number;
  preparationSteps: string[];
  safetyWarning: string;
}

export interface RecoveryProcedure {
  id: string;
  title: string;
  problemSummary: string;
  urgency: 'low' | 'medium' | 'high_critical';
  steps: string[];
  proTips: string[];
  mistakesToAvoid: string[];
}

/**
 * Procedura 1: Kalkulator dolania solanki uzupełniającej o identycznym stężeniu %
 * Chroni przed rozcieńczeniem nastawu (co mogłoby wywołać rozwój patogenów)
 * lub przed przesoleniem.
 */
export function calculateBrineTopUp(input: BrineTopUpInput): BrineTopUpOutput {
  const volume = Math.max(10, Math.round(input.missingVolumeMl || 100));
  const salinity = Math.max(1.0, Math.min(10.0, input.targetSalinityPercent || 2.0));

  // Woda = objętość brakująca w ml
  // Sól = volume * (salinity / 100)
  const saltGrams = Math.round(volume * (salinity / 100) * 10) / 10;

  return {
    waterMl: volume,
    saltGrams,
    effectiveSalinityPercent: salinity,
    preparationSteps: [
      `Odmierz ${volume} ml przegotowanej lub przefiltrowanej wody.`,
      `Rozpuść dokładnie ${saltGrams} g soli kamiennej niejodowanej (np. kłodawskiej).`,
      'KRYTYCZNE: Ostudź solankę do temperatury pokojowej (poniżej 25°C). Gorąca solanka natychmiast zabije żywe kultury bakterii kwasu mlekowego!',
      'Powoli dolej solankę do słoika, tak aby wszystkie warzywa znalazły się minimum 1.5–2 cm pod taflą płynu.',
    ],
    safetyWarning:
      'Nigdy nie dolewaj czystej wody bez soli! Rozcieńczenie solanki poniżej 1.5% grozi mięknięciem warzyw i rozwojem pleśni.',
  };
}

/**
 * Baza procedur ratunkowych nastawu w kuchni
 */
export const EMERGENCY_PROCEDURES: RecoveryProcedure[] = [
  {
    id: 'floating_produce',
    title: 'Warzywa wypływają ponad taflę solanki',
    problemSummary:
      'Część ogórków lub kapusty wystaje ponad płyn i ma kontakt z tlenem, co stwarza ryzyko rozwoju pleśni.',
    urgency: 'high_critical',
    steps: [
      'Wyparz dłonie lub użyj wyparzonych szczypiec kuchennych.',
      'Metoda 1 (Woreczek z solanką): Napełnij czysty woreczek strunowy (ziploc) solanką o tym samym stężeniu (np. 2%) i umieść na wierzchu warzyw. Jeśli woreczek przypadkowo pęknie, nie rozcieńczy nastawu!',
      'Metoda 2 (Liść chrzanu lub kapusty): Zawiń wierzch dużym, zblanszowanym liściem chrzanu, dębu lub zewnętrznym liściem kapusty i dociśnij wyparzonym spodeczkiem szklanym.',
      'Metoda 3 (Docisk szklany/ceramiczny): Zastosuj dedykowany ciężarek fermentacyjny z bezołowiowego szkła.',
      'Upewnij się, że między taflą solanki a wieczkiem pozostaje 2–3 cm wolnej przestrzeni na wydzielający się gaz CO2.',
    ],
    proTips: [
      'Liście chrzanu zawierają fitoncydy hamujące rozwój drobnoustrojów gnilnych.',
      'Zawsze używaj solanki w woreczku dociążającym — nigdy zwykłej kranówki.',
    ],
    mistakesToAvoid: [
      'Używanie metalowych nakrętek lub monet jako obciążnika (kwas mlekowy natychmiast reaguje z metalem).',
      'Pozostawienie wypływających fragmentów kopru czy czosnku (usuń je wyparzoną łyżką).',
    ],
  },
  {
    id: 'kahm_yeast_removal',
    title: 'Usuwanie kożucha drożdżowego (Kahm yeast)',
    problemSummary:
      'Na powierzchni solanki utworzyła się cienka, matowa, biało-szara błona o zapachu chlebowo-drożdżowym.',
    urgency: 'medium',
    steps: [
      'Uspokój się: drożdże kożuchujące (Pichia, Candida) są nieszkodliwe dla zdrowia, ale zużywają kwas mlekowy i mogą zmienić aromat kiszonki.',
      'Wyparz wrzątkiem szeroką łyżkę ze stali nierdzewnej lub silikonową łopatkę.',
      'Ostrożnie i powoli zdejmij całą warstwę kożucha z powierzchni, nie mącąc zbytnio płynu.',
      'Przetrzyj wewnętrzne ścianki słoika powyżej tafli ręcznikiem papierowym zwilżonym 70% alkoholem spożywczym lub octem jabłkowym.',
      'Dolej świeżej solanki (2.0%) do poziomu 2 cm pod wieczkiem.',
      'Szczelnie zamknij słoik. Jeśli to możliwe, użyj rurki fermentacyjnej lub zaworu jednokierunkowego, aby odciąć dopływ tlenu.',
    ],
    proTips: [
      'Drożdże kożuchujące potrzebują tlenu do życia. Po odcięciu dostępu powietrza bakterie kwasu mlekowego zdominują środowisko.',
      'Obniżenie temperatury otoczenia do 18–19°C spowalnia rozwój drożdży kożuchujących.',
    ],
    mistakesToAvoid: [
      'Mylenie kożucha z puchatą, kolorową pleśnią (zieloną, czarną, niebieską) — jeśli to pleśń, cały słoik trzeba wyrzucić!',
      'Mieszanie kożucha z resztą kiszonki zamiast jego zebrania.',
    ],
  },
  {
    id: 'soft_mushy_vegetables',
    title: 'Warzywa tracą chrupkość i stają się miękkie',
    problemSummary:
      'Tkanka ogórków lub kapusty robi się gąbczasta z powodu enzymów pektynolitycznych.',
    urgency: 'medium',
    steps: [
      'Zbadaj przyczynę: zbyt niska zawartość soli (<1.8%), zbyt wysoka temperatura (>24°C) lub obecność enzymów z kwiatostanu ogórka.',
      'Natychmiast przenieś słoik w chłodne miejsce (piwnica 12–15°C lub lodówka 4–6°C), aby zatrzymać degradację pektyn.',
      'Dodaj do słoika źródło garbników: 2–3 świeże, umyte liście dębu szypułkowego lub liście czarnej porzeczki.',
      'Opcjonalnie: dodaj 0.5g spożywczego chlorku wapnia (CaCl2) rozpuszczonego w 20 ml zimnej solanki, co wzmocni mostki pektynowe.',
    ],
    proTips: [
      'Zawsze obcinaj końcówki ogórków od strony kwiatostanu przed kiszeniem — to tam gromadzą się enzymy miękczące.',
      'Używaj twardej wody bogatej w wapń i magnez lub dodawaj CaCl2.',
    ],
    mistakesToAvoid: [
      'Używanie soli z jodkiem potasu lub antyzbrylaczem żelazocyjankowym (E536).',
      'Trzymanie słoików na słońcu lub przy kaloryferze.',
    ],
  },
];

export function getRecoveryProcedureById(id: string): RecoveryProcedure | undefined {
  return EMERGENCY_PROCEDURES.find((p) => p.id === id);
}
