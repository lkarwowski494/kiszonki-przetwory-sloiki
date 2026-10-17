// ============================================================================
// Apps4Brew / Słoik — Test Helpers & RNTL Harness (BR-TEST-016..020)
// renderApp({ route, saved, lang, params }):
// Renderuje dowolny z 7 ekranów aplikacji w pamięci w Jest z deterministycznym stanem.
// ============================================================================

import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';
import { dbStore, BatchRecord } from '../src/data/db/database';
import { SloikBackupData } from '../src/lib/backup';
import { setLang, Lang, clearLangListenersForTesting } from '../src/lib/i18n';
import { clearUnitListenersForTesting } from '../src/core/unit-converter';
import * as expoRouter from 'expo-router';

import RitualScreen from '../app/(tabs)/index';
import DojrzewalniaScreen from '../app/(tabs)/dojrzewalnia';
import WiedzaScreen from '../app/(tabs)/wiedza';
import ExperimentsScreen from '../app/experiments';
import SettingsScreen from '../app/settings';
import PasteurizerScreen from '../app/pasteurizer';
import BatchPassportScreen from '../app/batch/[id]';

export interface RenderAppOptions {
  route:
    | '/'
    | '/(tabs)'
    | '/(tabs)/index'
    | '/(tabs)/dojrzewalnia'
    | '/(tabs)/wiedza'
    | '/experiments'
    | '/settings'
    | '/pasteurizer'
    | '/batch/[id]'
    | string;
  saved?: Partial<SloikBackupData>;
  lang?: Lang;
  params?: Record<string, string>;
}

export interface RenderAppResult {
  root: ReactTestRenderer;
  toJSON: () => any;
  getAllText: () => string[];
  pressByText: (text: string | RegExp) => Promise<void>;
}

export function createSampleBatch(overrides: Partial<BatchRecord> = {}): BatchRecord {
  return {
    id: 'batch_test_sample',
    recipeId: 'REC-01',
    recipeTitle: 'Ogórki małosolne chrupiące',
    culture: 'Polska',
    method: 'lacto_fermentation',
    startedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    targetFermentationDays: 3,
    produceWeightGrams: 1000,
    waterWeightGrams: 800,
    saltWeightGrams: 20,
    salinityPercent: 2.0,
    status: 'fermenting',
    qrCodeUri: 'sloik://batch/batch_test_sample',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    notes: 'Próbna partia testowa',
    ...overrides,
  };
}

export async function renderApp(options: RenderAppOptions): Promise<RenderAppResult> {
  const { route, saved, lang = 'pl', params = {} } = options;

  clearLangListenersForTesting();
  clearUnitListenersForTesting();
  setLang(lang);
  dbStore.clearAllForTesting();
  dbStore.init();

  if (saved) {
    if (saved.batches) {
      for (const b of saved.batches) {
        dbStore.saveBatch(b);
      }
    }
    if (saved.pantryItems) {
      for (const p of saved.pantryItems) {
        dbStore.addPantryItem(p);
      }
    }
    if (saved.customRecipes) {
      for (const r of saved.customRecipes) {
        dbStore.saveCustomRecipe(r);
      }
    }
  }

  if ((expoRouter as any).__setMockParams) {
    (expoRouter as any).__setMockParams(params);
  }
  if ((expoRouter as any).__setMockPath) {
    (expoRouter as any).__setMockPath(route);
  }

  let ElementToRender: React.ReactElement;
  if (route === '/' || route === '/(tabs)' || route === '/(tabs)/index') {
    ElementToRender = <RitualScreen />;
  } else if (route === '/(tabs)/dojrzewalnia') {
    ElementToRender = <DojrzewalniaScreen />;
  } else if (route === '/(tabs)/wiedza') {
    ElementToRender = <WiedzaScreen />;
  } else if (route === '/experiments') {
    ElementToRender = <ExperimentsScreen />;
  } else if (route === '/settings') {
    ElementToRender = <SettingsScreen />;
  } else if (route === '/pasteurizer') {
    ElementToRender = <PasteurizerScreen />;
  } else if (route.startsWith('/batch/')) {
    ElementToRender = <BatchPassportScreen />;
  } else {
    ElementToRender = <RitualScreen />;
  }

  let rootRenderer!: ReactTestRenderer;
  await act(async () => {
    rootRenderer = renderer.create(ElementToRender);
  });

  const getAllText = (): string[] => {
    const textNodes = rootRenderer.root.findAll((node) => (node.type as any) === 'Text');
    return textNodes.map((n) => (typeof n.props.children === 'string' ? n.props.children : '')).filter(Boolean);
  };

  const pressByText = async (text: string | RegExp) => {
    const pressable = rootRenderer.root.find((node) => {
      if (node.props.onPress) {
        const str = JSON.stringify(node.props.children);
        return typeof text === 'string' ? str.includes(text) : text.test(str);
      }
      return false;
    });
    if (pressable) {
      await act(async () => {
        pressable.props.onPress();
      });
    }
  };

  return {
    root: rootRenderer,
    toJSON: () => rootRenderer.toJSON(),
    getAllText,
    pressByText,
  };
}
