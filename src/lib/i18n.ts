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
