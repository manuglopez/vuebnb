import { declareValuePlugin, PluginKind } from '@stryker-mutator/api/plugin';

const MACRO_NAMES = ['defineProps', 'defineEmits', 'defineExpose', 'withDefaults'];

const vueMacros = {
  shouldIgnore(path) {
    if (path.isCallExpression() && MACRO_NAMES.includes(path.node.callee?.name)) {
      return 'Macro del compilador de Vue: no se puede mutar';
    }
    if (
      path.isExpressionStatement() &&
      path.node.expression?.type === 'CallExpression' &&
      MACRO_NAMES.includes(path.node.expression.callee?.name)
    ) {
      return 'Macro del compilador de Vue: no se puede mutar';
    }
    if (
      path.isVariableDeclaration() &&
      path.node.declarations?.some(
        (d) =>
          d.init?.type === 'CallExpression' &&
          MACRO_NAMES.includes(d.init.callee?.name),
      )
    ) {
      return 'Macro del compilador de Vue: no se puede mutar';
    }
  },
};

export const strykerPlugins = [
  declareValuePlugin(PluginKind.Ignore, 'vue-macros', vueMacros),
];

export default {
  mutator: {},
  testRunner: 'vitest',
  plugins: [
    '@stryker-mutator/vitest-runner',
    './stryker.config.mjs',
  ],
  ignorers: ['vue-macros'],
  coverageAnalysis: 'perTest',
  thresholds: { high: 95, low: 90, break: 90 },
  concurrency: 4,
  mutate: [
    'resources/assets/js/helpers.js',
    'resources/assets/js/store.js',
    'resources/assets/js/router.js',
    'resources/assets/js/main.js',
    'resources/assets/js/components/**/*.vue',
  ],
  timeoutMS: 10_000,
  reporters: ['clear-text', 'progress', 'html'],
  htmlReporter: {
    fileName: 'build/stryker/index.html',
  },
};
