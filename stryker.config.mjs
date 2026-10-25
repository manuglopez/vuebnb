// Configuración de Stryker (v10): exporta el objeto directamente, sin defineConfig.
export default {
  mutator: {},
  testRunner: 'vitest',
  coverageAnalysis: 'perTest',
  thresholds: {
    high: 95,
    low: 90,
    break: 85,
  },
  concurrency: 4,
  // La lógica de producción del front con tests unitarios: helpers.js y store.js.
  mutate: [
    'resources/assets/js/helpers.js',
    'resources/assets/js/store.js',
  ],
  timeoutMS: 10_000,
  outputFolder: 'build/stryker',
};