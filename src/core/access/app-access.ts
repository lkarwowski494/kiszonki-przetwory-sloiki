// ============================================================================
// Słoik (Jarwise) — Model Monetyzacji Impulsowej „Cheaper than Espresso”
// Apps4Brew Studio — 100% Offline-First.
// ============================================================================
// Cennik:
// - $0.99 USD / miesiąc (~4,49 zł)
// - $4.99 USD / rok (~22,99 zł) — oferta główna
// - $14.99 USD Lifetime (~69,99 zł) — zakup jednorazowy na zawsze
//
// Zasady:
// 1. ZERO podziału na Free i Pro podczas trialu (100% funkcji dostępne).
// 2. Po trialu: HISTORIA ZAWSZE CZYTELNA (Read-Only). Użytkownik nigdy nie traci
//    wglądu w archiwalne słoiki, notatki i stany spiżarni.
// 3. Po trialu blokowane są wyłącznie akcje tworzenia nowych partii (canCreate).
// ============================================================================

import { useState, useEffect } from 'react';
import { dbStore } from '../../data/db/database';

export type AppAccessStatus = 'trial_active' | 'trial_expired' | 'subscribed';

export type PricingPlanId = 'monthly' | 'yearly' | 'lifetime';

export interface PricingPlan {
  id: PricingPlanId;
  namePl: string;
  nameEn: string;
  pricePln: string;
  priceUsd: string;
  billingPeriodPl: string;
  billingPeriodEn: string;
  highlightBadge?: string;
  savingsPercent?: number;
  hasFreeTrial?: boolean;
}

export const APPS4BREW_PLANS: PricingPlan[] = [
  {
    id: 'monthly',
    namePl: 'Miesięczny',
    nameEn: 'Monthly',
    pricePln: '4,49 zł',
    priceUsd: '$0.99',
    billingPeriodPl: 'co miesiąc',
    billingPeriodEn: 'per month',
  },
  {
    id: 'yearly',
    namePl: 'Roczny (Polecany)',
    nameEn: 'Annual (Best Value)',
    pricePln: '22,99 zł',
    priceUsd: '$4.99',
    billingPeriodPl: 'za cały rok (~1,91 zł/msc)',
    billingPeriodEn: 'per year (~$0.41/mo)',
    highlightBadge: '7 DNI ZA DARMO',
    savingsPercent: 57,
    hasFreeTrial: true,
  },
  {
    id: 'lifetime',
    namePl: 'Złoty Lifetime',
    nameEn: 'Gold Lifetime',
    pricePln: '69,99 zł',
    priceUsd: '$14.99',
    billingPeriodPl: 'jednorazowo na zawsze',
    billingPeriodEn: 'one-time purchase',
    highlightBadge: 'NA ZAWSZE',
  },
];

const SETTING_KEY_INSTALL_DATE = 'app_installed_at';
const SETTING_KEY_SUBSCRIPTION = 'subscription_tier';
const SETTING_KEY_DEBUG_STATE = 'access_debug_state';

const TRIAL_DAYS = 7;
const TRIAL_FREE_BATCHES_ALLOWED = 3;

export class AppAccessService {
  /**
   * Zwraca aktualny stan dostępu użytkownika do aplikacji
   */
  public getAccessStatus(): AppAccessStatus {
    // 1. Sprawdź tryb deweloperski / testowy
    const debug = dbStore.getSetting(SETTING_KEY_DEBUG_STATE);
    if (debug === 'trial_active' || debug === 'trial_expired' || debug === 'subscribed') {
      return debug;
    }

    // 2. Sprawdź czy użytkownik posiada aktywną subskrypcję lub zakup Lifetime
    const sub = dbStore.getSetting(SETTING_KEY_SUBSCRIPTION);
    if (sub === 'monthly' || sub === 'yearly' || sub === 'lifetime') {
      return 'subscribed';
    }

    // 3. Pobierz lub zainicjalizuj datę pierwszej instalacji
    let installedAtStr = dbStore.getSetting(SETTING_KEY_INSTALL_DATE);
    let installedAt = installedAtStr ? parseInt(installedAtStr, 10) : 0;
    if (!installedAt || isNaN(installedAt)) {
      installedAt = Date.now();
      dbStore.setSetting(SETTING_KEY_INSTALL_DATE, String(installedAt));
    }

    const elapsedDays = (Date.now() - installedAt) / (1000 * 60 * 60 * 24);
    const completedBatchesCount = dbStore.getAllBatches().length;

    // Trial jest aktywny przez 7 dni ORAZ do 3 ukończonych partii (co nastąpi pierwsze)
    if (elapsedDays <= TRIAL_DAYS && completedBatchesCount < TRIAL_FREE_BATCHES_ALLOWED) {
      return 'trial_active';
    }

    return 'trial_expired';
  }

  /**
   * Sprawdza czy użytkownik może tworzyć nowe zasoby (nastaw słoika, wpis, pasteryzacja)
   */
  public canCreate(): boolean {
    const status = this.getAccessStatus();
    return status === 'trial_active' || status === 'subscribed';
  }

  /**
   * Zwraca liczbę dni pozostałych w okresie próbnym (lub 0 jeśli wygasł)
   */
  public getDaysLeftInTrial(): number {
    const installedAtStr = dbStore.getSetting(SETTING_KEY_INSTALL_DATE);
    const installedAt = installedAtStr ? parseInt(installedAtStr, 10) : Date.now();
    const elapsedDays = (Date.now() - installedAt) / (1000 * 60 * 60 * 24);
    const remaining = Math.max(0, Math.ceil(TRIAL_DAYS - elapsedDays));
    return remaining;
  }

  /**
   * Symulacja zakupu planu w StoreKit / RevenueCat
   */
  public subscribe(planId: PricingPlanId): void {
    dbStore.setSetting(SETTING_KEY_SUBSCRIPTION, planId);
    dbStore.setSetting(SETTING_KEY_DEBUG_STATE, 'subscribed');
  }

  /**
   * Przywracanie zakupów (Apple HIG / Google Play)
   */
  public restorePurchases(): boolean {
    const sub = dbStore.getSetting(SETTING_KEY_SUBSCRIPTION);
    if (sub) {
      return true;
    }
    return false;
  }

  /**
   * Wymuszenie stanu dla celów testowych / developerskich
   */
  public setDebugState(state: AppAccessStatus | 'reset'): void {
    if (state === 'reset') {
      dbStore.setSetting(SETTING_KEY_DEBUG_STATE, '');
      dbStore.setSetting(SETTING_KEY_SUBSCRIPTION, '');
    } else {
      dbStore.setSetting(SETTING_KEY_DEBUG_STATE, state);
    }
  }
}

export const appAccessService = new AppAccessService();

/**
 * Hook React Native do reaktywnego monitorowania stanu dostępu
 */
export function useAppAccess() {
  const [status, setStatus] = useState<AppAccessStatus>(appAccessService.getAccessStatus());
  const [daysLeft, setDaysLeft] = useState<number>(appAccessService.getDaysLeftInTrial());

  const refresh = () => {
    setStatus(appAccessService.getAccessStatus());
    setDaysLeft(appAccessService.getDaysLeftInTrial());
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    status,
    isSubscribed: status === 'subscribed',
    isTrialActive: status === 'trial_active',
    isTrialExpired: status === 'trial_expired',
    canCreate: status === 'trial_active' || status === 'subscribed',
    daysLeftInTrial: daysLeft,
    subscribe: (plan: PricingPlanId) => {
      appAccessService.subscribe(plan);
      refresh();
    },
    restorePurchases: () => {
      const ok = appAccessService.restorePurchases();
      refresh();
      return ok;
    },
    setDebugState: (st: AppAccessStatus | 'reset') => {
      appAccessService.setDebugState(st);
      refresh();
    },
    refresh,
  };
}
