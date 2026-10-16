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
  formatSaltWeight,
  formatBrineVolume,
} from '../unit-converter';

describe('Unit Converter (Metric / Imperial — Parity S3)', () => {
  describe('Temperature conversion', () => {
    it('konwertuje 20°C na 68°F oraz 100°C na 212°F', () => {
      expect(celsiusToFahrenheit(20)).toBe(68);
      expect(celsiusToFahrenheit(100)).toBe(212);
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('konwertuje 68°F na 20°C oraz 212°F na 100°C', () => {
      expect(fahrenheitToCelsius(68)).toBe(20);
      expect(fahrenheitToCelsius(212)).toBe(100);
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('formatuje temperaturę metrycznie i imperialnie', () => {
      expect(formatTemperature(20, 'metric')).toBe('20°C');
      expect(formatTemperature(20, 'imperial')).toBe('68°F');
    });
  });

  describe('Weight conversion', () => {
    it('konwertuje gramy na uncje i odwrotnie', () => {
      const oz = gramsToOunces(100);
      expect(oz).toBe(3.53);
      expect(ouncesToGrams(oz)).toBe(100);
    });

    it('konwertuje kilogramy na funty i odwrotnie', () => {
      const lbs = kgToPounds(2.5);
      expect(lbs).toBe(5.51);
      expect(poundsToKg(lbs)).toBe(2.5);
    });

    it('formatuje wagę surowca', () => {
      expect(formatProduceWeight(500, 'metric')).toBe('500g');
      expect(formatProduceWeight(2500, 'metric')).toBe('2.5 kg');
      expect(formatProduceWeight(300, 'imperial')).toContain('oz');
      expect(formatProduceWeight(2000, 'imperial')).toContain('lbs');
    });

    it('formatuje wagę soli', () => {
      expect(formatSaltWeight(40, 'metric')).toBe('40g');
      expect(formatSaltWeight(40, 'imperial')).toBe('1.41 oz');
    });
  });

  describe('Volume conversion', () => {
    it('konwertuje ml na uncje płynne i litry na kwarty', () => {
      const flOz = mlToFluidOunces(500);
      expect(flOz).toBe(16.91);
      expect(fluidOuncesToMl(flOz)).toBe(500);
      expect(litersToQuarts(2)).toBe(2.11);
    });

    it('formatuje objętość solanki', () => {
      expect(formatBrineVolume(600, 'metric')).toBe('600 ml');
      expect(formatBrineVolume(1500, 'metric')).toBe('1.5 L');
      expect(formatBrineVolume(500, 'imperial')).toContain('fl oz');
      expect(formatBrineVolume(2000, 'imperial')).toContain('qt');
    });
  });
});
