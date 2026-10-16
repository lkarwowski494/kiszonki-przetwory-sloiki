import { Diagnosis, DoctorNode } from '../types';

export const DIAGNOSES: Record<string, Diagnosis> = {
  KAHM_YEAST: {
    id: 'KAHM_YEAST',
    title: 'Drożdże kożuchujące (Kahm Yeast) — BEZPIECZNE',
    isSafeToEat: true,
    severity: 'safe',
    shortExplanation: 'To cienka, matowa, biała błonka na powierzchni płynu. Nie jest to pleśń!',
    detailedCause:
      'Drożdże tlenowe (Pichia, Debaryomyces) rozwijają się w obecności tlenu na powierzchni kiszonki. Są całkowicie nietoksyczne i nie wytwarzają mykotoksyn. Mogą jedynie osłabić kwasowość i zmienić aromat, jeśli zostaną zbyt długo.',
    actionSteps: [
      'Zbierz delikatnie białą błonkę czystą wyparzoną łyżką.',
      'Umyj i wyparz docisk szklany lub kamienny.',
      'Upewnij się, że warzywa są w 100% zanurzone pod płynem.',
      'Szczelnie zamknij słoik i przenieś w chłodniejsze miejsce, aby odciąć dopływ tlenu.',
    ],
    howToPreventNextTime:
      'Stosuj naczynia z rurką fermentacyjną lub dbaj o to, by przestrzeń nagłowna (headspace) była wypełniona dwutlenkiem węgla.',
  },
  TOXIC_MOLD: {
    id: 'TOXIC_MOLD',
    title: 'Toksyczna pleśń strzępkowa — BEZWZGLĘDNIE WYRZUĆ',
    isSafeToEat: false,
    severity: 'danger_discard',
    shortExplanation: 'Puszyste kłaczki, zielone, czarne, niebieskie lub różowe wysepki ponad taflą.',
    detailedCause:
      'Pleśnie wytwarzają mikotoksyny (np. patulinę, aflatoksyny), które są niewidoczne gołym okiem i dyfundują w głąb całego płynu w słoiku. Zbieranie samej wierzchniej warstwy NIE usuwa toksyn!',
    actionSteps: [
      'Wyrzuć całą zawartość słoika do odpadów organicznych/śmietnika.',
      'Nie wąchaj intensywnie słoika z bliska (zarodniki pleśni mogą podrażnić drogi oddechowe).',
      'Wyszoruj i wyparz słoik wrzątkiem przed kolejnym użyciem.',
    ],
    howToPreventNextTime:
      'Nigdy nie dopuszczaj do wystawania warzyw ponad poziom solanki. Zawsze używaj docisku i odpowiedniej ilości soli (min. 2.0% całkowitej masy).',
  },
  BLUE_GARLIC: {
    id: 'BLUE_GARLIC',
    title: 'Niebieski lub szmaragdowy czosnek — W 100% JADALNY',
    isSafeToEat: true,
    severity: 'safe',
    shortExplanation: 'Czosnek zmienił barwę na turkusową, niebieską lub zieloną. To naturalna magia chemii!',
    detailedCause:
      'W kwaśnym środowisku enzymy allinazy w czosnku wchodzą w reakcję ze związkami siarki i śladowymi ilościami miedzi, tworząc naturalne pigmenty pirolowe (podobne do chlorofilu). Zjawisko jest całkowicie nieszkodliwe dla zdrowia.',
    actionSteps: [
      'Możesz spokojnie jeść zarówno ogórki, jak i sam zabarwiony czosnek.',
      'Nie zmienia to w żaden sposób smaku ani chrupkości przetworu.',
    ],
    howToPreventNextTime:
      'Zjawisko występuje częściej przy młodym czosnku lub czosnku mocno rozdrobnionym. Jeśli chcesz go uniknąć, wrzucaj ząbki w całości i używaj czosnku późnego, dobrze wysuszonego.',
  },
  SOFT_PICKLES: {
    id: 'SOFT_PICKLES',
    title: 'Miękkie lub puste ogórki — WADA TEKSTURY',
    isSafeToEat: true,
    severity: 'caution',
    shortExplanation: 'Ogórki straciły chrupkość i są gąbczaste. Można je zjeść, ale nie zachwycają.',
    detailedCause:
      'Główną przyczyną jest aktywność enzymów pektynolitycznych (pektynazy), które rozkładają ściany komórkowe warzywa. Dzieje się tak, gdy: woda była zbyt miękka, było za mało soli, nie odkrojono końcówki od strony kwiatu (tam gromadzi się enzym) lub temperatura fermentacji przekraczała 25°C.',
    actionSteps: [
      'Jeśli ogórki pachną przyjemnie i kwasowo, świetnie nadadzą się na zupę ogórkową lub sos tatarski po posiekaniu.',
      'Jeśli są śliskie i mają nieprzyjemny zapach rozkładu — wyrzuć partię.',
    ],
    howToPreventNextTime:
      'Zawsze odcinaj 2 mm końcówki ogórka od strony kwiatu. Stosuj 2-godzinną kąpiel w wodzie z lodem przed kiszeniem i dodawaj liście bogate w taniny (dąb, chrzan, porzeczka) oraz szczyptę chlorku wapnia.',
  },
  SWOLLEN_LID_FERMENT: {
    id: 'SWOLLEN_LID_FERMENT',
    title: 'Wybrzuszone wieczko podczas fermentacji — ZWYKŁY GAZ CO₂',
    isSafeToEat: true,
    severity: 'safe',
    shortExplanation: 'W pierwszych dniach bakterie kwasu mlekowego intensywnie produkują gaz.',
    detailedCause:
      'Bakterie Leuconostoc mesenteroides w fazie burzliwej wytwarzają olbrzymie ilości dwutlenku węgla. W szczelnie zakręconym słoiku Twist-Off gaz unosi elastyczne wieczko.',
    actionSteps: [
      'Delikatnie uchyl wieczko (odgazuj / „beknij” słoik), aby uwolnić nadmiar ciśnienia.',
      'Dokręć z powrotem, ale nie za mocno, lub postaw słoik na talerzyku.',
    ],
    howToPreventNextTime:
      'Podczas pierwszych 4 dni fermentacji nie dokręcaj słoików Twist-Off z maksymalną siłą, dając gazom ujście.',
  },
  SWOLLEN_LID_STORAGE: {
    id: 'SWOLLEN_LID_STORAGE',
    title: 'Wybrzuszone wieczko w spiżarni po pasteryzacji — ZEPSUCIE!',
    isSafeToEat: false,
    severity: 'danger_discard',
    shortExplanation: 'Słoik, który był zapasteryzowany, po tygodniach spuchł i wybrzuszył się.',
    detailedCause:
      'Nastąpiło rozszczelnienie lub przetrwanie bakterii beztlenowych (np. Bacillus lub Clostridium). Gaz w pasteryzowanym słoiku oznacza aktywne psucie biologiczne.',
    actionSteps: [
      'Nie próbuj zawartości! Wyrzuć cały słoik.',
      'Słoik mógł wytworzyć wysokie ciśnienie — otwieraj ostrożnie w rękawicach.',
    ],
    howToPreventNextTime:
      'Zawsze sprawdzaj ranty słoików (czy nie są wyszczerbione) i stosuj wyłącznie nowe, niepogięte pokrywki.',
  },
  MILKY_BRINE_SOUR: {
    id: 'MILKY_BRINE_SOUR',
    title: 'Mleczna, mętna zalewa w kiszonkach — OZNAKA ZDROWIA',
    isSafeToEat: true,
    severity: 'safe',
    shortExplanation: 'Mętna woda w ogórkach kiszonych to powód do dumy, a nie zmartwienia!',
    detailedCause:
      'Mleczne zmętnienie to po prostu miliardy pożytecznych bakterii kwasu mlekowego zawieszonych w solance. To one odpowiadają za zdrowotne i probiotyczne właściwości kiszonek.',
    actionSteps: [
      'Ciesz się wspaniałym smakiem! Mętna zalewa to najlepszy sok probiotyczny.',
    ],
    howToPreventNextTime:
      'Brak zmętnienia w kiszonce świadczyłby o tym, że fermentacja w ogóle nie ruszyła (np. przez chlorowaną wodę).',
  },
};

export const DOCTOR_DECISION_TREE: Record<string, DoctorNode> = {
  ROOT: {
    id: 'ROOT',
    question: 'Jaki problem zauważyłeś w swoim słoiku?',
    options: [
      { label: 'Nalot lub plamy na powierzchni zalewy', nextNodeId: 'SURFACE_FILM' },
      { label: 'Czosnek zmienił kolor na niebieski lub zielony', diagnosisId: 'BLUE_GARLIC' },
      { label: 'Ogórki są miękkie, puste w środku lub gąbczaste', diagnosisId: 'SOFT_PICKLES' },
      { label: 'Wieczko słoika jest wybrzuszone / napuchnięte', nextNodeId: 'SWOLLEN_LID' },
      { label: 'Zalewa zrobiła się mętna i mleczna', nextNodeId: 'CLOUDY_BRINE' },
    ],
  },
  SURFACE_FILM: {
    id: 'SURFACE_FILM',
    question: 'Jak wygląda ten nalot na powierzchni?',
    options: [
      {
        label: 'Cienka, matowa, biała/kremowa błonka, płaska, jak pyłek lub koronka',
        diagnosisId: 'KAHM_YEAST',
      },
      {
        label: 'Puszyste wysepki, kłaczki, zielone, czarne, błękitne lub różowe zabarwienie',
        diagnosisId: 'TOXIC_MOLD',
      },
    ],
  },
  SWOLLEN_LID: {
    id: 'SWOLLEN_LID',
    question: 'Na jakim etapie znajduje się ten słoik?',
    options: [
      {
        label: 'To świeża kiszonka stojąca od kilku dni na blacie w kuchni',
        diagnosisId: 'SWOLLEN_LID_FERMENT',
      },
      {
        label: 'To słoik po pasteryzacji wyciągnięty po tygodniach ze spiżarni/piwnicy',
        diagnosisId: 'SWOLLEN_LID_STORAGE',
      },
    ],
  },
  CLOUDY_BRINE: {
    id: 'CLOUDY_BRINE',
    question: 'Jaki to rodzaj przetworu?',
    options: [
      {
        label: 'Ogórki kiszone lub małosolne w samej solance (bez octu)',
        diagnosisId: 'MILKY_BRINE_SOUR',
      },
      {
        label: 'Korniszony w zalewie octowej (powinny być przejrzyste)',
        diagnosisId: 'SOFT_PICKLES',
      },
    ],
  },
};

/**
 * Pobiera diagnozę po identyfikatorze
 */
export function getDiagnosis(diagnosisId: string): Diagnosis | undefined {
  return DIAGNOSES[diagnosisId];
}
