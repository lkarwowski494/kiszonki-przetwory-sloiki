// ============================================================================
// Słoik (Jarwise) — System Międzynarodowości i18n (Apps4Brew Core / Parity S2)
// Polskie klucze źródłowe + słownik angielski EN + interpolacja parametrów {param}.
// 100% Offline-First.
// ============================================================================

import { useState, useEffect } from 'react';
import { EN } from './i18n.en';
import { dbStore } from '../data/db/database';

export const LANGS = ['pl', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const plDictionary: Record<string, string> = { ...EN };

let currentLang: Lang = 'pl';
type LangListener = (l: Lang) => void;
const listeners = new Set<LangListener>();

export function setLang(lang: Lang, persist = true): void {
  currentLang = lang;
  if (persist) {
    dbStore.setSetting('app_language', lang);
  }
  listeners.forEach((fn) => fn(lang));
}

export function clearLangListenersForTesting(): void {
  listeners.clear();
}

export function lang(): Lang {
  const saved = dbStore.getSetting('app_language');
  if (saved === 'en' || saved === 'pl') {
    currentLang = saved;
  }
  return currentLang;
}

export function useLang(): Lang {
  const [l, setL] = useState<Lang>(() => {
    const saved = dbStore.getSetting('app_language');
    if (saved === 'en' || saved === 'pl') {
      currentLang = saved;
      return saved;
    }
    return currentLang;
  });
  useEffect(() => {
    listeners.add(setL);
    return () => {
      listeners.delete(setL);
    };
  }, []);
  return l;
}

const own = (dict: Record<string, string>, key: string): string | undefined => {
  return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : undefined;
};

/**
 * Tłumaczenie tekstu z opcjonalną interpolacją parametrów {klucz}.
 */
export function t(pl: string, params?: Record<string, string | number>): string {
  let text = currentLang === 'pl' ? pl : own(EN, pl) ?? pl;
  if (params) {
    for (const k of Object.keys(params)) {
      text = text.split(`{${k}}`).join(String(params[k]));
    }
  }
  return text;
}

/**
 * RD-ENG-09 / NFR-I18N-007: Polska odmiana liczebników
 * forms: [mianownik l. pojedyncza, mianownik l. mnoga, dopełniacz l. mnoga]
 * np. ['słoik', 'słoiki', 'słoików'] lub ['seria', 'serie', 'serii']
 */
export function pluralPl(count: number, forms: [string, string, string]): string {
  const abs = Math.abs(Math.round(count));
  if (abs === 1) return forms[0];
  const n100 = abs % 100;
  const n10 = abs % 10;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) {
    return forms[1];
  }
  return forms[2];
}

/**
 * Uniwersalna pluralizacja wspierająca PL i EN (NFR-I18N-007)
 */
export function plural(
  language: Lang,
  count: number,
  forms: [string, string, string] | [string, string]
): string {
  if (language === 'pl') {
    const plForms = forms.length === 3 ? forms : ([forms[0], forms[1], forms[1]] as [string, string, string]);
    return pluralPl(count, plForms);
  }
  const abs = Math.abs(Math.round(count));
  return abs === 1 ? forms[0] : (forms[1] ?? forms[0]);
}

