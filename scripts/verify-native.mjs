// ============================================================================
// Apps4Brew / Słoik — Native iOS Invariants Verification (BR-REL-009, Chapter 12.4)
// Weryfikuje 20 niezmienników iOS na Linuksie/Windowsie bez Xcode.
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const invariants = [];
function check(id, title, testFn) {
  try {
    const result = testFn();
    if (result === true || result === undefined) {
      invariants.push({ id, title, ok: true });
    } else {
      invariants.push({ id, title, ok: false, error: String(result) });
    }
  } catch (err) {
    invariants.push({ id, title, ok: false, error: err.message });
  }
}

const appJsonPath = path.join(root, 'app.json');
const pkgJsonPath = path.join(root, 'package.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
const expo = appJson.expo;

// Invariant 1: Nazwa aplikacji
check(1, 'app.json posiada zdefiniowaną nazwę aplikacji expo.name', () => {
  return typeof expo.name === 'string' && expo.name.length > 0;
});

// Invariant 2: Identyfikator slug
check(2, 'app.json posiada zdefiniowany slug', () => {
  return typeof expo.slug === 'string' && expo.slug.length > 0;
});

// Invariant 3: Wersja semver i zgodność package.json z app.json
check(3, 'app.json i package.json posiadają zgodną wersję SemVer', () => {
  const isSemver = /^\d+\.\d+\.\d+$/.test(expo.version);
  if (!isSemver) return 'Niepoprawny format SemVer w app.json';
  if (expo.version !== pkg.version) {
    return `Niezgodność wersji: app.json (${expo.version}) !== package.json (${pkg.version})`;
  }
  return true;
});

// Invariant 4: iOS bundleIdentifier
check(4, 'expo.ios posiada bundleIdentifier w domenie com.apps4brew', () => {
  return expo.ios?.bundleIdentifier?.startsWith('com.apps4brew.');
});

// Invariant 5: iOS buildNumber
check(5, 'expo.ios posiada numeryczny buildNumber', () => {
  return /^\d+$/.test(expo.ios?.buildNumber);
});

// Invariant 6: supportsTablet: false (iPhone only wg standardu Role-Model) i brak zakazanego audio background mode
check(6, 'expo.ios.supportsTablet jest false (iPhone-only) i brak UIBackgroundModes audio', () => {
  if (expo.ios?.supportsTablet !== false) return 'supportsTablet nie jest false';
  const modes = expo.ios?.infoPlist?.UIBackgroundModes || [];
  if (modes.includes('audio')) return 'Wykryto zakazany tryb UIBackgroundModes: audio (Guideline 2.5.4)';
  return true;
});

// Invariant 7: Orientacja portrait
check(7, 'expo.orientation jest ustawione na "portrait"', () => {
  return expo.orientation === 'portrait';
});

// Invariant 8: Ikona aplikacji istnieje na dysku
const iconPath = path.join(root, expo.icon || 'assets/icon.png');
check(8, 'Plik ikony assets/icon.png istnieje', () => {
  return fs.existsSync(iconPath);
});

// Invariant 9: Ikona jest RGB bez kanału alfa (colorType 2, ITMS-90717)
check(9, 'Ikona assets/icon.png jest w formacie PNG RGB (colorType 2, brak przezroczystości)', () => {
  const buf = fs.readFileSync(iconPath);
  const colorType = buf[25];
  if (colorType !== 2) {
    return `Wykryto colorType: ${colorType} zamiast 2 (RGB bez alfa)`;
  }
  return true;
});

// Invariant 10: privacyManifests zadeklarowane w ios
check(10, 'expo.ios posiada privacyManifests zadeklarowane pod App Store 2024+', () => {
  return Boolean(expo.ios?.privacyManifests?.NSPrivacyAccessedAPITypes);
});

// Invariant 11-14: Wszystkie 4 kategorie Required Reason API
const reasons = expo.ios?.privacyManifests?.NSPrivacyAccessedAPITypes || [];
const hasReason = (cat) => reasons.some((r) => r.NSPrivacyAccessedAPIType === cat);

check(11, 'privacyManifests deklaruje NSPrivacyAccessedAPICategoryUserDefaults', () => {
  return hasReason('NSPrivacyAccessedAPICategoryUserDefaults');
});

check(12, 'privacyManifests deklaruje NSPrivacyAccessedAPICategoryFileTimestamp', () => {
  return hasReason('NSPrivacyAccessedAPICategoryFileTimestamp');
});

check(13, 'privacyManifests deklaruje NSPrivacyAccessedAPICategorySystemBootTime', () => {
  return hasReason('NSPrivacyAccessedAPICategorySystemBootTime');
});

check(14, 'privacyManifests deklaruje NSPrivacyAccessedAPICategoryDiskSpace', () => {
  return hasReason('NSPrivacyAccessedAPICategoryDiskSpace');
});

// Invariant 15: Ciemne tło splash #121214 (ceramic basalt)
check(15, 'splash.backgroundColor lub splash.dark.backgroundColor wynosi #121214', () => {
  const bg = expo.splash?.backgroundColor;
  const darkBg = expo.splash?.dark?.backgroundColor;
  return bg?.toUpperCase() === '#121214' || darkBg?.toUpperCase() === '#121214';
});

// Invariant 16: Repozytorium jest prywatne w package.json
check(16, 'package.json posiada flagę private: true', () => {
  return pkg.private === true;
});

// Invariant 17: Brak zakazanych zewnętrznych SDK telemetrii (Offline-First)
check(17, 'Brak telemetrii / reklam w package.json (zero admob, firebase-analytics, segment)', () => {
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
  const forbidden = ['@react-native-firebase/analytics', 'react-native-google-mobile-ads', 'analytics-react-native'];
  for (const f of forbidden) {
    if (allDeps[f]) return `Wykryto zakazaną zależność: ${f}`;
  }
  return true;
});

// Invariant 18: Brak twardo zakodowanych hostów lokalnych / staging w kodzie produkcyjnym
check(18, 'Brak hardcoded localhost: w kodzie produkcyjnym src/', () => {
  const walkSrc = (d) => {
    let bad = [];
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) {
        if (!p.includes('__tests__')) bad = bad.concat(walkSrc(p));
      } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        const txt = fs.readFileSync(p, 'utf8');
        if (/http:\/\/localhost:\d+/.test(txt)) bad.push(p);
      }
    }
    return bad;
  };
  const hits = walkSrc(path.join(root, 'src'));
  if (hits.length > 0) return `Znaleziono localhost w: ${hits.join(', ')}`;
  return true;
});

// Invariant 19: Statyczne strony prawne i wsparcia w site/
check(19, 'Strony site/privacy.html oraz site/support.html istnieją dla App Store Connect', () => {
  const priv = path.join(root, 'site', 'privacy.html');
  const supp = path.join(root, 'site', 'support.html');
  return fs.existsSync(priv) && fs.existsSync(supp);
});

// Invariant 20: Strona główna witryny site/index.html istnieje
check(20, 'Strona produktowa site/index.html istnieje', () => {
  return fs.existsSync(path.join(root, 'site', 'index.html'));
});

// Podsumowanie
console.log('='.repeat(70));
console.log('Weryfikacja 20 Niezmienników Natywnych iOS (Linux/Windows offline runner)');
console.log('='.repeat(70));

let failedCount = 0;
for (const inv of invariants) {
  if (inv.ok) {
    console.log(`[PASS] Niezmiennik #${String(inv.id).padStart(2, '0')}: ${inv.title}`);
  } else {
    console.error(`[FAIL] Niezmiennik #${String(inv.id).padStart(2, '0')}: ${inv.title}`);
    if (inv.error) console.error(`       Szczegóły: ${inv.error}`);
    failedCount++;
  }
}

console.log('='.repeat(70));
if (failedCount > 0) {
  console.error(`WYNIK: ${failedCount} / ${invariants.length} niezmienników NIE SPEŁNIONYCH!`);
  process.exit(1);
} else {
  console.log(`WYNIK: Wszystkie ${invariants.length} / ${invariants.length} niezmienników iOS ZALICZONE!`);
}
