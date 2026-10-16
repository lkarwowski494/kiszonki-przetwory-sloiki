import {
  calculateRadarCoordinates,
  DEFAULT_FERMENT_SENSORY_PROFILE,
  FERMENT_SENSORY_AXES,
} from '../sensory-radar';

describe('Sensory Radar Chart Engine (Apps4Brew Parity S3)', () => {
  it('posiada 5 zdefiniowanych osi rzemiosła przetwórczego', () => {
    expect(FERMENT_SENSORY_AXES.length).toBe(5);
    const keys = FERMENT_SENSORY_AXES.map((a) => a.key);
    expect(keys).toEqual(['acidity', 'salinity', 'crispness', 'effervescence', 'aroma']);
  });

  it('oblicza współrzędne radarowe dla domyślnego profilu sensorycznego', () => {
    const coords = calculateRadarCoordinates(DEFAULT_FERMENT_SENSORY_PROFILE, 200);

    expect(coords.center).toBe(100);
    expect(coords.maxRadius).toBe(70);
    expect(coords.levels.length).toBe(5);
    expect(coords.levels[0].points.length).toBe(5);
    expect(coords.dataPoints.length).toBe(5);

    // Pierwsza oś (kąt -90° / w górę): x powinno być równe środkowi (100)
    const topPoint = coords.dataPoints[0];
    expect(topPoint.key).toBe('acidity');
    expect(topPoint.x).toBe(100);
    expect(topPoint.y).toBeLessThan(100);
  });

  it('zabezpiecza wartości przed przekroczeniem zakresu 1-5 (clamping)', () => {
    const extremeProfile = {
      acidity: 10,
      salinity: -5,
      crispness: 5,
      effervescence: 0,
      aroma: 6,
    };

    const coords = calculateRadarCoordinates(extremeProfile, 200);
    const acidityPoint = coords.dataPoints.find((p) => p.key === 'acidity');
    const salinityPoint = coords.dataPoints.find((p) => p.key === 'salinity');

    expect(acidityPoint?.value).toBe(5);
    expect(salinityPoint?.value).toBe(1);
  });
});
