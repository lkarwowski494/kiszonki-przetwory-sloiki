import { localDateKey, parseLocalDateKey, addDaysLocal, formatDayMonthKey } from '../dates/local-date';

describe('RD-ENG-05 & BR-TEST-015: DST-Resilient Local Date Handling', () => {
  test('localDateKey generates formatted YYYY-MM-DD from Date components', () => {
    const d = new Date(2026, 3, 12, 14, 30); // 12 April 2026
    expect(localDateKey(d)).toBe('2026-04-12');
  });

  test('parseLocalDateKey sets time to 12:00:00 local time to prevent DST rollover', () => {
    const parsed = parseLocalDateKey('2026-04-12');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(3);
    expect(parsed.getDate()).toBe(12);
    expect(parsed.getHours()).toBe(12);
    expect(parsed.getMinutes()).toBe(0);
    expect(parsed.getSeconds()).toBe(0);
  });

  test('addDaysLocal handles calendar day progression across DST switch', () => {
    // 29 March 2026 in Europe is the DST switch (doba 23h)
    const nextDay = addDaysLocal('2026-03-29', 1);
    expect(nextDay).toBe('2026-03-30');

    // Adding multiple days
    expect(addDaysLocal('2026-04-12', 7)).toBe('2026-04-19');
    expect(addDaysLocal('2026-12-31', 1)).toBe('2027-01-01');
  });

  test('formatDayMonthKey returns DD.MM format', () => {
    expect(formatDayMonthKey('2026-04-12')).toBe('12.04');
    expect(formatDayMonthKey('2026-01-05')).toBe('05.01');
  });
});
