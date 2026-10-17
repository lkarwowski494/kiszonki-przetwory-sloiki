// ============================================================================
// Apps4Brew / Słoik — setupFilesAfterEnv (BR-TEST-018, BR-TEST-008, RYZ-15)
// Automatyczne oblewanie testu przy ostrzeżeniach act(), console.error
// oraz globalne logowanie ziarna PROP_SEED / MATRIX_SEED
// ============================================================================

const seed = process.env.PROP_SEED || process.env.MATRIX_SEED || '0x5eed1234';
if (!global.__PROP_SEED_LOGGED) {
  global.__PROP_SEED_LOGGED = true;
  process.stdout.write(`[prop-seed] PROP_SEED=${seed} (odtwórz: PROP_SEED=${seed} npm test)\n`);
}

const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  console.error = (...args) => {
    const msg = args
      .map((a) => (typeof a === 'string' ? a : a?.message || JSON.stringify(a)))
      .join(' ');

    // Dozwolone ostrzeżenia o deprecjacji z zewnętrznych bibliotek (React 19 test-renderer)
    if (msg.includes('react-test-renderer is deprecated')) {
      return;
    }

    originalError(...args);
    throw new Error(`[BR-TEST-018] console.error wywołany w teście:\n${msg}`);
  };

  console.warn = (...args) => {
    const msg = args
      .map((a) => (typeof a === 'string' ? a : a?.message || JSON.stringify(a)))
      .join(' ');

    if (
      msg.includes('not wrapped in act(') ||
      msg.includes('An update to') ||
      msg.includes('inside a test was not wrapped in act')
    ) {
      originalWarn(...args);
      throw new Error(`[BR-TEST-018] Niedozwolone ostrzeżenie act() w teście:\n${msg}`);
    }

    originalWarn(...args);
  };
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
