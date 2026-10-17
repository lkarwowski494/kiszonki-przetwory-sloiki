import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  dbStore,
} from '../src/data/db/database';
import {
  ExperimentSeries,
  ExperimentVariant,
  ExperimentAxis,
} from '../src/core/experiments/types';
import {
  createSplitBatchExperiment,
  calculateSensoryScore,
  rankVariants,
} from '../src/core/experiments/experiment-engine';
import { theme } from '../src/ui/theme';
import { KitchenCard } from '../src/ui/components/KitchenCard';
import { KitchenButton } from '../src/ui/components/KitchenButton';
import { Badge } from '../src/ui/components/Badge';
import { ModalHeader } from '../src/ui/components/ModalHeader';
import { useAppAccess } from '../src/core/access/app-access';
import { PaywallModal } from '../src/ui/components/PaywallModal';

export default function ExperimentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { canCreate } = useAppAccess();
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const [seriesList, setSeriesList] = useState<ExperimentSeries[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<ExperimentSeries | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'detail'>('list');

  // Formularz nowego split-batcha
  const [title, setTitle] = useState('');
  const [baseProduce, setBaseProduce] = useState('Ogórki gruntowe');
  const [totalProduceGrams, setTotalProduceGrams] = useState('2000');
  const [jarCount, setJarCount] = useState(4);
  const [axis, setAxis] = useState<ExperimentAxis>('tannins_crispness');
  const [hypothesis, setHypothesis] = useState(
    'Wpływ dodatku garbników (liść dębu vs porzeczka vs CaCl2) na chrupkość'
  );
  const [customDeltas, setCustomDeltas] = useState<string[]>([
    'Wariant kontrolny (solanka 2.0%)',
    '2 liście dębu szypułkowego',
    '3 liście czarnej porzeczki',
    '0.5g chlorku wapnia (CaCl2)',
  ]);

  // Modal oceny sensorycznej
  const [cuppingVariant, setCuppingVariant] = useState<ExperimentVariant | null>(null);
  const [scoreTexture, setScoreTexture] = useState('30');
  const [scoreFlavor, setScoreFlavor] = useState('30');
  const [scoreAroma, setScoreAroma] = useState('18');
  const [scoreAppearance, setScoreAppearance] = useState('9');
  const [tastingNotes, setTastingNotes] = useState('');

  const reloadData = () => {
    const all = dbStore.getAllExperimentSeries();
    setSeriesList(all);
    if (selectedSeries) {
      const refreshed = dbStore.getExperimentSeriesById(selectedSeries.id);
      if (refreshed) setSelectedSeries(refreshed);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleSelectJarCount = (count: number) => {
    setJarCount(count);
    const newDeltas = [...customDeltas];
    while (newDeltas.length < count) {
      newDeltas.push(`Wariant #${newDeltas.length + 1}`);
    }
    setCustomDeltas(newDeltas.slice(0, count));
  };

  const handleCreateExperiment = () => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    if (!title.trim()) {
      Alert.alert('Brak tytułu', 'Wpisz nazwę serii eksperymentalnej.');
      return;
    }

    const totalWeight = parseInt(totalProduceGrams, 10) || 1000;
    const variantDeltas = customDeltas.map((delta, i) => ({
      name: `Słoik ${String.fromCharCode(65 + i)}`,
      parameterDelta: delta || `Wariant #${i + 1}`,
      specialAdditions: [delta],
    }));

    const newSeries = createSplitBatchExperiment({
      title: title.trim(),
      baseProduceName: baseProduce.trim(),
      totalProduceGrams: totalWeight,
      jarCount,
      hypothesis: hypothesis.trim(),
      axis,
      baseSalinityPercent: 2.0,
      variantDeltas,
    });

    dbStore.createExperimentSeries(newSeries);
    reloadData();
    setSelectedSeries(newSeries);
    setViewMode('detail');

    Alert.alert(
      'Rozpoczęto eksperyment! 🔬',
      `Podzielono ${totalWeight} g surowca na ${jarCount} słoików (po ${Math.round(totalWeight / jarCount)} g na słoik). Każdy słoik otrzymał unikalny paszport!`
    );
  };

  const handleOpenCuppingModal = (variant: ExperimentVariant) => {
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    setCuppingVariant(variant);
    if (variant.sensoryScore) {
      setScoreTexture(variant.sensoryScore.textureCrispness.toString());
      setScoreFlavor(variant.sensoryScore.flavorAcidBalance.toString());
      setScoreAroma(variant.sensoryScore.aroma.toString());
      setScoreAppearance(variant.sensoryScore.appearance.toString());
      setTastingNotes(variant.sensoryScore.tastingNotes || '');
    } else {
      setScoreTexture('30');
      setScoreFlavor('30');
      setScoreAroma('18');
      setScoreAppearance('9');
      setTastingNotes('');
    }
  };

  const handleSaveCuppingScore = () => {
    if (!selectedSeries || !cuppingVariant) return;
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }

    const texture = parseFloat(scoreTexture) || 0;
    const flavor = parseFloat(scoreFlavor) || 0;
    const aroma = parseFloat(scoreAroma) || 0;
    const appearance = parseFloat(scoreAppearance) || 0;

    const score = calculateSensoryScore({
      textureCrispness: texture,
      flavorAcidBalance: flavor,
      aroma,
      appearance,
      tastingNotes,
    });

    dbStore.updateVariantSensoryScore(selectedSeries.id, cuppingVariant.id, score);
    reloadData();
    setCuppingVariant(null);

    Alert.alert(
      'Zapisano ocenę sensoryczną! ⚖️',
      `Słoik ${cuppingVariant.variantLetter} uzyskał ${score.totalScore}/100 punktów w arkuszu degustacyjnym.`
    );
  };

  const handlePromoteToMasterRecipe = (variant: ExperimentVariant) => {
    if (!selectedSeries) return;
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }

    Alert.alert(
      'Koronacja Zwycięzcy 👑',
      `Czy chcesz zapisać wariant "${variant.name}" jako oficjalny Przepis Mistrzowski w Twojej bazie? Proporcje zostaną automatycznie przeskalowane na 1 kg wsadu.`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Tak, zapisz w bazie!',
          onPress: () => {
            const masterRecipe = dbStore.promoteVariantToMasterRecipe(
              selectedSeries.id,
              variant.id,
              `Mistrzowski: ${selectedSeries.baseProduceName} (${variant.parameterDelta})`
            );
            if (masterRecipe) {
              Alert.alert(
                'Zapisano Przepis Mistrzowski! 🏆',
                `Receptura "${masterRecipe.title}" została dodana do bazy receptur. Możesz ją teraz odtworzyć w dowolnej skali!`
              );
              reloadData();
            }
          },
        },
      ]
    );
  };

  const handleToggleBlindCupping = () => {
    if (!selectedSeries) return;
    if (!canCreate) {
      setIsPaywallOpen(true);
      return;
    }
    const nextVal = !selectedSeries.blindCuppingEnabled;
    dbStore.toggleBlindCupping(selectedSeries.id, nextVal);
    reloadData();
  };

  // Obliczenia na żywo dla modala oceny
  const liveTotal =
    (parseFloat(scoreTexture) || 0) +
    (parseFloat(scoreFlavor) || 0) +
    (parseFloat(scoreAroma) || 0) +
    (parseFloat(scoreAppearance) || 0);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ModalHeader
        title="Laboratorium & Konkurs"
        onClose={() => router.back()}
        closeLabel="Zamknij"
      />

      {/* Górny przełącznik widoków */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={() => setViewMode('list')}
          style={[styles.navTab, viewMode === 'list' && styles.navTabActive]}
        >
          <Text style={[styles.navTabText, viewMode === 'list' && styles.navTabTextActive]}>
            📋 Eksperymenty ({seriesList.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (!canCreate) {
              setIsPaywallOpen(true);
              return;
            }
            setTitle(`Eksperyment ${new Date().toLocaleDateString('pl-PL')}`);
            setViewMode('create');
          }}
          style={[styles.navTab, viewMode === 'create' && styles.navTabActive]}
        >
          <Text style={[styles.navTabText, viewMode === 'create' && styles.navTabTextActive]}>
            ➕ Nowy Split-Batch
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* WIDOK 1: LISTA EKSPERYMENTÓW */}
        {viewMode === 'list' && (
          <View>
            <Text style={styles.sectionHeader}>Twoje serie eksperymentalne</Text>
            <Text style={styles.sectionSub}>
              Porównuj 2 lub więcej słoików z różnymi proporcjami soli, dodatkami i taninami, by odkryć swój idealny przepis.
            </Text>

            {seriesList.length === 0 ? (
              <KitchenCard style={styles.emptyCard}>
                <Text style={styles.emptyText}>Brak aktywnych eksperymentów.</Text>
                <KitchenButton
                  title="Stwórz pierwszy Split-Batch"
                  onPress={() => {
                    if (!canCreate) {
                      setIsPaywallOpen(true);
                      return;
                    }
                    setViewMode('create');
                  }}
                  variant="primary"
                />
              </KitchenCard>
            ) : (
              seriesList.map((series) => (
                <TouchableOpacity
                  key={series.id}
                  onPress={() => {
                    setSelectedSeries(series);
                    setViewMode('detail');
                  }}
                  activeOpacity={0.8}
                >
                  <KitchenCard style={styles.seriesCard}>
                    <View style={styles.rowBetween}>
                      <Badge
                        label={`${series.jarCount} SŁOIKI`}
                        variant="gray"
                      />
                      <Text style={styles.dateText}>
                        {new Date(series.createdAt).toLocaleDateString('pl-PL')}
                      </Text>
                    </View>
                    <Text style={styles.seriesTitle}>{series.title}</Text>
                    <Text style={styles.seriesHypothesis}>💡 {series.hypothesis}</Text>
                    <View style={styles.variantsPillRow}>
                      {series.variants.map((v) => (
                        <View key={v.id} style={styles.variantMiniBadge}>
                          <Text style={styles.variantMiniLetter}>{v.variantLetter}</Text>
                          {v.sensoryScore && (
                            <Text style={styles.variantMiniScore}>
                              {v.sensoryScore.totalScore}p
                            </Text>
                          )}
                          {v.isWinner && <Text style={{ fontSize: 12 }}>👑</Text>}
                        </View>
                      ))}
                    </View>
                  </KitchenCard>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* WIDOK 2: KREATOR NOWEGO SPLIT-BATCHA */}
        {viewMode === 'create' && (
          <View>
            <Text style={styles.sectionHeader}>Nowy Split-Batch (2-8 Słoików)</Text>
            <Text style={styles.sectionSub}>
              Rozdziel jedną partię warzyw na kilka słoików z kontrolowanymi różnicami parametrów.
            </Text>

            <KitchenCard style={styles.formCard}>
              <Text style={styles.inputLabel}>Tytuł eksperymentu</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="np. Test Chrupkości Ogórka 2026"
              />

              <Text style={styles.inputLabel}>Surowiec bazowy</Text>
              <TextInput
                style={styles.textInput}
                value={baseProduce}
                onChangeText={setBaseProduce}
                placeholder="np. Ogórki gruntowe Śremski"
              />

              <View style={styles.rowTwoCols}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Łączna masa (g)</Text>
                  <TextInput
                    style={styles.textInput}
                    value={totalProduceGrams}
                    onChangeText={setTotalProduceGrams}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Liczba słoików</Text>
                  <View style={styles.jarCountSelector}>
                    {[2, 3, 4, 5, 6].map((cnt) => (
                      <TouchableOpacity
                        key={cnt}
                        onPress={() => handleSelectJarCount(cnt)}
                        style={[
                          styles.jarCountBtn,
                          jarCount === cnt && styles.jarCountBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.jarCountBtnText,
                            jarCount === cnt && styles.jarCountBtnTextActive,
                          ]}
                        >
                          {cnt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.infoBanner}>
                <Text style={styles.infoBannerText}>
                  ⚖️ Wsad na 1 słoik:{' '}
                  <Text style={{ fontWeight: '700' }}>
                    {Math.round((parseInt(totalProduceGrams, 10) || 1000) / jarCount)} g
                  </Text>{' '}
                  (stała baza)
                </Text>
              </View>

              <Text style={styles.inputLabel}>Hipoteza badawcza</Text>
              <TextInput
                style={[styles.textInput, { height: 60 }]}
                value={hypothesis}
                onChangeText={setHypothesis}
                multiline
                placeholder="Co chcesz sprawdzić? (np. który dodatek da najlepszą chrupkość)"
              />

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>
                Zmienne dla każdego słoika (czym się różnią?):
              </Text>
              {customDeltas.map((delta, i) => (
                <View key={i} style={styles.deltaInputRow}>
                  <View style={styles.deltaLetterBadge}>
                    <Text style={styles.deltaLetterText}>{String.fromCharCode(65 + i)}</Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, { flex: 1, marginBottom: 0 }]}
                    value={delta}
                    onChangeText={(txt) => {
                      const updated = [...customDeltas];
                      updated[i] = txt;
                      setCustomDeltas(updated);
                    }}
                    placeholder={`Opis słoika ${String.fromCharCode(65 + i)}`}
                  />
                </View>
              ))}

              <View style={{ marginTop: 20 }}>
                <KitchenButton
                  title="Rozpocznij Eksperyment & Nadaj Paszporty 🚀"
                  onPress={handleCreateExperiment}
                  variant="primary"
                />
              </View>
            </KitchenCard>
          </View>
        )}

        {/* WIDOK 3: SZCZEGÓŁY SERII & PANEL DEGUSTACYJNY */}
        {viewMode === 'detail' && selectedSeries && (
          <View>
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={styles.backLink}
            >
              <Text style={styles.backLinkText}>← Wróć do listy eksperymentów</Text>
            </TouchableOpacity>

            <View style={styles.detailHeaderCard}>
              <View style={styles.rowBetween}>
                <Badge
                  label={`${selectedSeries.jarCount} SŁOIKI W SERII`}
                  variant="amber"
                />
                <TouchableOpacity
                  onPress={handleToggleBlindCupping}
                  style={[
                    styles.blindToggleBtn,
                    selectedSeries.blindCuppingEnabled && styles.blindToggleBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.blindToggleText,
                      selectedSeries.blindCuppingEnabled && styles.blindToggleTextActive,
                    ]}
                  >
                    {selectedSeries.blindCuppingEnabled
                      ? '🕶️ Ślepa Próba: WŁĄCZONA'
                      : '👁️ Ślepa Próba: Wyłączona'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.detailTitle}>{selectedSeries.title}</Text>
              <Text style={styles.detailHypothesis}>💡 {selectedSeries.hypothesis}</Text>
              <Text style={styles.detailProduce}>
                Surowiec bazowy: {selectedSeries.baseProduceName} ({selectedSeries.totalProduceGrams}g łącznie)
              </Text>
            </View>

            {/* TABLICA WYNIKÓW (PODIUM LEADERBOARD) */}
            {selectedSeries.variants.some((v) => v.sensoryScore) && (
              <KitchenCard style={styles.leaderboardCard}>
                <Text style={styles.leaderboardTitle}>🏆 Tablica Wyników (Panel 100 pkt)</Text>
                {rankVariants(selectedSeries.variants).map((item) => (
                  <View key={item.variant.id} style={styles.leaderboardRow}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankBadgeText}>
                        {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                      <Text style={styles.leaderboardVariantName}>
                        {selectedSeries.blindCuppingEnabled
                          ? `Próbka ${item.variant.variantLetter}`
                          : item.variant.name}
                      </Text>
                      {!selectedSeries.blindCuppingEnabled && (
                        <Text style={styles.leaderboardDeltaText}>
                          {item.variant.parameterDelta}
                        </Text>
                      )}
                    </View>
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreNumber}>{item.totalScore}</Text>
                      <Text style={styles.scoreMax}>/100</Text>
                    </View>
                    {item.isWinner && (
                      <TouchableOpacity
                        onPress={() => handlePromoteToMasterRecipe(item.variant)}
                        style={styles.promotePill}
                      >
                        <Text style={styles.promotePillText}>👑 Zapisz jako Mistrzowski</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </KitchenCard>
            )}

            {/* KARTY POSZCZEGÓLNYCH SŁOIKÓW */}
            <Text style={[styles.sectionHeader, { marginTop: 16 }]}>
              Zestawienie słoików w serii
            </Text>

            {selectedSeries.variants.map((v) => {
              const hasScore = !!v.sensoryScore;
              return (
                <KitchenCard key={v.id} style={styles.jarDetailCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.jarLetterBadge}>
                      <Text style={styles.jarLetterText}>SŁOIK {v.variantLetter}</Text>
                    </View>
                    {v.isWinner && <Badge label="ZWYCIĘZCA 👑" variant="green" />}
                  </View>

                  <Text style={styles.jarName}>
                    {selectedSeries.blindCuppingEnabled
                      ? `Ślepa Próbka #${v.variantLetter}`
                      : v.name}
                  </Text>

                  {selectedSeries.blindCuppingEnabled ? (
                    <View style={styles.blindNotice}>
                      <Text style={styles.blindNoticeText}>
                        🕶️ Parametry ukryte na czas ślepej degustacji. Oceń smak bez uprzedzeń!
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.jarParamsBlock}>
                      <Text style={styles.jarParamLine}>
                        <Text style={{ fontWeight: '700' }}>Zmienna:</Text> {v.parameterDelta}
                      </Text>
                      <Text style={styles.jarParamLine}>
                        <Text style={{ fontWeight: '700' }}>Wsad:</Text> {v.produceGrams}g warzyw + {v.waterGrams}ml wody
                      </Text>
                      <Text style={styles.jarParamLine}>
                        <Text style={{ fontWeight: '700' }}>Sól:</Text> {v.saltGrams}g (Zasolenie: {v.salinityPercent}%)
                      </Text>
                    </View>
                  )}

                  {/* Kącik sensoryczny danego słoika */}
                  {hasScore ? (
                    <View style={styles.scoreDetailsBox}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.scoreSummaryText}>
                          Ocena sensoryczna:{' '}
                          <Text style={{ fontWeight: '800', color: theme.colors.pickleGreen }}>
                            {v.sensoryScore?.totalScore}/100 pkt
                          </Text>
                        </Text>
                        <TouchableOpacity onPress={() => handleOpenCuppingModal(v)}>
                          <Text style={styles.editScoreLink}>Edytuj ✏️</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.scoreSubDetails}>
                        Tekstura: {v.sensoryScore?.textureCrispness}/35 • Balans: {v.sensoryScore?.flavorAcidBalance}/35 • Aromat: {v.sensoryScore?.aroma}/20 • Wygląd: {v.sensoryScore?.appearance}/10
                      </Text>
                      {v.sensoryScore?.tastingNotes && (
                        <Text style={styles.tastingNotesQuote}>
                          "{v.sensoryScore.tastingNotes}"
                        </Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.actionRow}>
                      <KitchenButton
                        title="Oceń w panelu 100 pkt ⚖️"
                        onPress={() => handleOpenCuppingModal(v)}
                        variant="primary"
                      />
                    </View>
                  )}
                </KitchenCard>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* MODAL OCENY SENSORYCZNEJ (100 PKT) */}
      <Modal
        visible={cuppingVariant !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCuppingVariant(null)}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <ModalHeader
            title={`Arkusz Sensoryczny: Słoik ${cuppingVariant?.variantLetter}`}
            onClose={() => setCuppingVariant(null)}
            closeLabel="Anuluj"
          />
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.cuppingScoreBanner}>
              <Text style={styles.cuppingScoreBannerLabel}>ŁĄCZNY WYNIK SENSORYCZNY:</Text>
              <Text style={styles.cuppingScoreBannerNumber}>
                {Math.round(liveTotal * 10) / 10}{' '}
                <Text style={{ fontSize: 20, color: theme.colors.textMuted }}>/ 100 pkt</Text>
              </Text>
            </View>

            <KitchenCard style={styles.card}>
              <Text style={styles.cuppingFieldTitle}>
                1. Tekstura i Chrupkość (0 – 35 pkt)
              </Text>
              <Text style={styles.cuppingFieldDesc}>
                Jędrność skórki, twardość miąższu, opór przy gryzieniu, brak miękkości.
              </Text>
              <TextInput
                style={styles.scoreInput}
                value={scoreTexture}
                onChangeText={setScoreTexture}
                keyboardType="numeric"
              />

              <Text style={[styles.cuppingFieldTitle, { marginTop: 16 }]}>
                2. Balans Kwasowości i Smaku (0 – 35 pkt)
              </Text>
              <Text style={styles.cuppingFieldDesc}>
                Czysty kwas mlekowy, brak ostrości octowej, idealne dosolenie, głębia umami.
              </Text>
              <TextInput
                style={styles.scoreInput}
                value={scoreFlavor}
                onChangeText={setScoreFlavor}
                keyboardType="numeric"
              />

              <Text style={[styles.cuppingFieldTitle, { marginTop: 16 }]}>
                3. Aromat i Bukiet Fermentacji (0 – 20 pkt)
              </Text>
              <Text style={styles.cuppingFieldDesc}>
                Świeży, ziołowy, czysty zapach fermentacji mlekowej, brak nut gnilnych czy maślanych.
              </Text>
              <TextInput
                style={styles.scoreInput}
                value={scoreAroma}
                onChangeText={setScoreAroma}
                keyboardType="numeric"
              />

              <Text style={[styles.cuppingFieldTitle, { marginTop: 16 }]}>
                4. Barwa i Klarowność Solanki (0 – 10 pkt)
              </Text>
              <Text style={styles.cuppingFieldDesc}>
                Naturalny kolor warzywa, brak brunatnienia, szlachetna mętność zalewy.
              </Text>
              <TextInput
                style={styles.scoreInput}
                value={scoreAppearance}
                onChangeText={setScoreAppearance}
                keyboardType="numeric"
              />

              <Text style={[styles.cuppingFieldTitle, { marginTop: 16 }]}>
                Notatki z kącika degustacyjnego
              </Text>
              <TextInput
                style={[styles.textInput, { height: 70 }]}
                value={tastingNotes}
                onChangeText={setTastingNotes}
                multiline
                placeholder="Wrażenia z degustacji, porównanie z innymi słoikami..."
              />

              <View style={{ marginTop: 20 }}>
                <KitchenButton
                  title="Zatwierdź Ocenę Sensoryczną ✅"
                  onPress={handleSaveCuppingScore}
                  variant="primary"
                />
              </View>
            </KitchenCard>
          </ScrollView>
        </View>
      </Modal>

      <PaywallModal
        visible={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        reasonTitle="Okres próbny wygasł 🔬"
        reasonSubtitle="Twoje dotychczasowe serie eksperymentalne i oceny degustacyjne są zawsze dostępne (Read-Only). Odblokuj tworzenie nowych split-batchy subskrybując taniej niż kawa espresso ($0.99 / $4.99)!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  container: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  navRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  navTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  navTabActive: {
    borderBottomColor: theme.colors.pickleGreen,
  },
  navTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  navTabTextActive: {
    color: theme.colors.pickleGreen,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  seriesCard: {
    marginBottom: 14,
    backgroundColor: theme.colors.bgCard,
    padding: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  seriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  seriesHypothesis: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  variantsPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantMiniBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.bgSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  variantMiniLetter: {
    fontWeight: '700',
    color: theme.colors.pickleGreen,
    fontSize: 12,
  },
  variantMiniScore: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#FAF8F5',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  rowTwoCols: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  jarCountSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  jarCountBtn: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
  },
  jarCountBtnActive: {
    backgroundColor: theme.colors.pickleGreen,
    borderColor: theme.colors.pickleGreen,
  },
  jarCountBtnText: {
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  jarCountBtnTextActive: {
    color: '#FFF',
  },
  infoBanner: {
    backgroundColor: theme.colors.pickleGreenMuted,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  infoBannerText: {
    fontSize: 13,
    color: theme.colors.pickleGreen,
  },
  deltaInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  deltaLetterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.pickleGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deltaLetterText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
  },
  backLink: {
    marginBottom: 12,
  },
  backLinkText: {
    fontSize: 14,
    color: theme.colors.pickleGreen,
    fontWeight: '700',
  },
  detailHeaderCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 16,
    borderRadius: theme.borderRadius.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  blindToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#FAF8F5',
  },
  blindToggleBtnActive: {
    backgroundColor: '#2D3748',
    borderColor: '#2D3748',
  },
  blindToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  blindToggleTextActive: {
    color: '#FFF',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  detailHypothesis: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  detailProduce: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  leaderboardCard: {
    backgroundColor: '#FFFDF9',
    borderColor: theme.colors.amberBrine,
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EBE1',
  },
  rankBadge: {
    width: 32,
    alignItems: 'center',
  },
  rankBadgeText: {
    fontSize: 20,
  },
  leaderboardVariantName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  leaderboardDeltaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.pickleGreen,
  },
  scoreMax: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  promotePill: {
    backgroundColor: theme.colors.amberBrine,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  promotePillText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 11,
  },
  jarDetailCard: {
    backgroundColor: theme.colors.bgCard,
    padding: 16,
    marginBottom: 12,
  },
  jarLetterBadge: {
    backgroundColor: theme.colors.pickleGreenMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jarLetterText: {
    color: theme.colors.pickleGreen,
    fontWeight: '800',
    fontSize: 12,
  },
  jarName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 6,
    marginBottom: 6,
  },
  blindNotice: {
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
  },
  blindNoticeText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  jarParamsBlock: {
    backgroundColor: '#FAF8F5',
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
    gap: 4,
  },
  jarParamLine: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  scoreDetailsBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  scoreSummaryText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  editScoreLink: {
    color: theme.colors.pickleGreen,
    fontSize: 12,
    fontWeight: '700',
  },
  scoreSubDetails: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  tastingNotesQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  actionRow: {
    marginTop: 10,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: theme.colors.bgCard,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.colors.bgCard,
    padding: 16,
  },
  cuppingScoreBanner: {
    backgroundColor: theme.colors.pickleGreen,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cuppingScoreBannerLabel: {
    color: '#EBF5E9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cuppingScoreBannerNumber: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
  },
  cuppingFieldTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  cuppingFieldDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  scoreInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 18,
    fontWeight: '700',
    backgroundColor: '#FAF8F5',
    color: theme.colors.pickleGreen,
    marginBottom: 6,
  },
});
