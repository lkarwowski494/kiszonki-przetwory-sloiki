import {
  AppAccessService,
  appAccessService,
  APPS4BREW_PLANS,
  PricingPlanId,
} from '../access/app-access';
import { dbStore } from '../../data/db/database';

describe('AppAccessService & "Cheaper than Espresso" Monetization Model', () => {
  beforeEach(() => {
    // Reset debug states and settings before each test
    appAccessService.setDebugState('reset');
    dbStore.setSetting('subscription_tier', '');
    dbStore.setSetting('access_debug_state', '');
    dbStore.setSetting('app_installed_at', '');
  });

  describe('APPS4BREW_PLANS catalog', () => {
    it('defines exact impulse pricing points conforming to "Cheaper than Espresso" standard', () => {
      expect(APPS4BREW_PLANS).toHaveLength(3);

      const monthly = APPS4BREW_PLANS.find((p) => p.id === 'monthly');
      const yearly = APPS4BREW_PLANS.find((p) => p.id === 'yearly');
      const lifetime = APPS4BREW_PLANS.find((p) => p.id === 'lifetime');

      expect(monthly).toBeDefined();
      expect(monthly?.priceUsd).toBe('$0.99');
      expect(monthly?.pricePln).toBe('4,49 zł');

      expect(yearly).toBeDefined();
      expect(yearly?.priceUsd).toBe('$4.99');
      expect(yearly?.pricePln).toBe('22,99 zł');
      expect(yearly?.hasFreeTrial).toBe(true);

      expect(lifetime).toBeDefined();
      expect(lifetime?.priceUsd).toBe('$14.99');
      expect(lifetime?.pricePln).toBe('69,99 zł');
    });
  });

  describe('Trial on New Installation', () => {
    it('initializes new installations with trial_active and canCreate true', () => {
      const status = appAccessService.getAccessStatus();
      expect(status).toBe('trial_active');
      expect(appAccessService.canCreate()).toBe(true);
      expect(appAccessService.getDaysLeftInTrial()).toBeGreaterThanOrEqual(1);
      expect(appAccessService.getDaysLeftInTrial()).toBeLessThanOrEqual(7);
    });

    it('persists app_installed_at on first access', () => {
      expect(dbStore.getSetting('app_installed_at')).toBeNull();
      appAccessService.getAccessStatus();
      const installedAt = dbStore.getSetting('app_installed_at');
      expect(installedAt).not.toBeNull();
      expect(Number(installedAt)).toBeGreaterThan(0);
    });
  });

  describe('Trial Expiration and Read-Only Enforcement', () => {
    it('transitions to trial_expired when elapsed time exceeds 7 days and minimum batches are met', () => {
      // Simulate installation 10 days ago
      const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000;
      dbStore.setSetting('app_installed_at', String(tenDaysAgo));

      // Ensure at least 3 batches exist to satisfy trial conditions
      const currentBatches = dbStore.getAllBatches();
      for (let i = currentBatches.length; i < 3; i++) {
        dbStore.createBatch({
          recipeId: `TEST-REC-${i}`,
          recipeTitle: `Test Jar ${i}`,
          culture: 'Test Culture',
          method: 'lacto_fermentation',
          startedAt: Date.now(),
          targetFermentationDays: 5,
          produceWeightGrams: 500,
          waterWeightGrams: 400,
          saltWeightGrams: 10,
          salinityPercent: 2.0,
          status: 'fermenting',
        });
      }

      const status = appAccessService.getAccessStatus();
      expect(status).toBe('trial_expired');
      expect(appAccessService.canCreate()).toBe(false);
      expect(appAccessService.getDaysLeftInTrial()).toBe(0);
    });

    it('guarantees that reading existing batches and pantry remains 100% functional even when trial_expired', () => {
      appAccessService.setDebugState('trial_expired');
      expect(appAccessService.canCreate()).toBe(false);

      // Verify that database read operations are completely unrestricted
      const batches = dbStore.getAllBatches();
      expect(Array.isArray(batches)).toBe(true);

      const pantry = dbStore.getPantryItems();
      expect(Array.isArray(pantry)).toBe(true);

      const recipes = dbStore.getCustomRecipes();
      expect(Array.isArray(recipes)).toBe(true);
    });
  });

  describe('Subscriptions and Lifetime Purchase', () => {
    const plans: PricingPlanId[] = ['monthly', 'yearly', 'lifetime'];

    plans.forEach((planId) => {
      it(`restores canCreate capability when subscribed with ${planId}`, () => {
        appAccessService.setDebugState('trial_expired');
        expect(appAccessService.canCreate()).toBe(false);

        appAccessService.subscribe(planId);
        expect(appAccessService.getAccessStatus()).toBe('subscribed');
        expect(appAccessService.canCreate()).toBe(true);
        expect(appAccessService.restorePurchases()).toBe(true);
      });
    });

    it('returns false for restorePurchases when user has never subscribed', () => {
      expect(appAccessService.restorePurchases()).toBe(false);
    });
  });

  describe('Developer / QA Debug Overrides', () => {
    it('allows deterministic switching between trial_active, trial_expired, subscribed, and reset', () => {
      appAccessService.setDebugState('trial_expired');
      expect(appAccessService.getAccessStatus()).toBe('trial_expired');
      expect(appAccessService.canCreate()).toBe(false);

      appAccessService.setDebugState('subscribed');
      expect(appAccessService.getAccessStatus()).toBe('subscribed');
      expect(appAccessService.canCreate()).toBe(true);

      appAccessService.setDebugState('trial_active');
      expect(appAccessService.getAccessStatus()).toBe('trial_active');
      expect(appAccessService.canCreate()).toBe(true);

      appAccessService.setDebugState('reset');
      // After reset and clean db, status defaults back to trial_active on fresh install
      expect(appAccessService.getAccessStatus()).toBe('trial_active');
    });
  });
});
