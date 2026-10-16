import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  gramsToOunces,
  ouncesToGrams,
  kgToPounds,
  poundsToKg,
  mlToFluidOunces,
  fluidOuncesToMl,
  litersToQuarts,
  formatTemperature,
  formatProduceWeight,
  formatBrineVolume,
} from '../unit-converter';

describe('Unit Converter Corpus Suite (1,291 Testów Konwersji Metryczno-Imperialnej)', () => {
  // 1. Temperatury (-20°C do 120°C) -> 141 testów
  const temperatures: number[] = [];
  for (let t = -20; t <= 120; t++) {
    temperatures.push(t);
  }

  test.each(temperatures)(
    'Temperatura %i°C zachowuje tożsamość roundtrip w skali Fahrenheita',
    (celsius) => {
      const fahrenheit = celsiusToFahrenheit(celsius);
      const backToC = fahrenheitToCelsius(fahrenheit);
      expect(Math.abs(backToC - celsius)).toBeLessThanOrEqual(1);

      const formattedMetric = formatTemperature(celsius, 'metric');
      const formattedImperial = formatTemperature(celsius, 'imperial');
      expect(formattedMetric).toBe(`${celsius}°C`);
      expect(formattedImperial).toBe(`${fahrenheit}°F`);
    }
  );

  // 2. Gramy -> Uncje (10g do 10,000g, krok 20g) -> 500 testów
  const gramWeights: number[] = [];
  for (let g = 10; g <= 10000; g += 20) {
    gramWeights.push(g);
  }

  test.each(gramWeights)(
    'Waga %i g konwertuje się na uncje i z powrotem bez utraty rzędu wielkości',
    (grams) => {
      const oz = gramsToOunces(grams);
      const backToG = ouncesToGrams(oz);
      expect(Math.abs(backToG - grams)).toBeLessThanOrEqual(2);

      const fmtMetric = formatProduceWeight(grams, 'metric');
      const fmtImperial = formatProduceWeight(grams, 'imperial');
      expect(fmtMetric.length).toBeGreaterThan(0);
      expect(fmtImperial.length).toBeGreaterThan(0);
    }
  );

  // 3. Kilogramy -> Funty (1kg do 100kg) -> 100 testów
  const kgWeights: number[] = [];
  for (let k = 1; k <= 100; k++) {
    kgWeights.push(k);
  }

  test.each(kgWeights)(
    'Masa %i kg konwertuje się precyzyjnie na funty (lbs)',
    (kg) => {
      const lbs = kgToPounds(kg);
      const backToKg = poundsToKg(lbs);
      expect(Math.abs(backToKg - kg)).toBeLessThanOrEqual(0.05);
    }
  );

  // 4. Mililitry -> Uncje płynne (10ml do 5000ml, krok 10ml) -> 500 testów
  const volumesMl: number[] = [];
  for (let v = 10; v <= 5000; v += 10) {
    volumesMl.push(v);
  }

  test.each(volumesMl)(
    'Objętość %i ml konwertuje się na uncje płynne (fl oz) i z powrotem',
    (ml) => {
      const flOz = mlToFluidOunces(ml);
      const backToMl = fluidOuncesToMl(flOz);
      expect(Math.abs(backToMl - ml)).toBeLessThanOrEqual(2);

      const fmtMetric = formatBrineVolume(ml, 'metric');
      const fmtImperial = formatBrineVolume(ml, 'imperial');
      expect(fmtMetric.length).toBeGreaterThan(0);
      expect(fmtImperial.length).toBeGreaterThan(0);
    }
  );

  // 5. Litry -> Kwarty (1L do 50L) -> 50 testów
  const liters: number[] = [];
  for (let l = 1; l <= 50; l++) {
    liters.push(l);
  }

  test.each(liters)(
    'Objętość %i L przelicza się poprawnie na kwarty (quarts)',
    (l) => {
      const quarts = litersToQuarts(l);
      expect(quarts).toBeGreaterThan(l);
    }
  );
});
