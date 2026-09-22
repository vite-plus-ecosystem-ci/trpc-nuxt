import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-0-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
  },
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    singleQuote: true,
    semi: true,
    experimentalSortPackageJson: true,
    sortImports: {
      groups: [
        ['type-import'],
        ['type-builtin', 'value-builtin'],
        ['type-external', 'value-external', 'type-internal', 'value-internal'],
        [
          'type-parent',
          'type-sibling',
          'type-index',
          'value-parent',
          'value-sibling',
          'value-index',
        ],
        ['unknown'],
      ],
      newlinesBetween: true,
      order: 'asc',
    },
  },
  lint: {
    plugins: ['import', 'jsdoc', 'vue'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: {
    entry: ['./src/client/index.ts', './src/server/index.ts'],
    clean: true,
    deps: {
      // tsdown <0.23 compatibility: resolve external dependency subpaths.
      // Remove to preserve subpath imports as written (the new default).
      // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
      resolveDepSubpath: true,
      neverBundle: ['#imports', 'nuxt/app', 'vue', 'h3', /@trpc\/client/, /@trpc\/server/],
    },
    dts: true,
  },
  run: {
    cache: {
      scripts: true,
      tasks: true,
    },
    tasks: {
      'build:lib': {
        command: 'vp pack',
        input: [{ auto: true }, '!dist/**'],
      },
      test: {
        command: 'vp exec playwright test',
        cwd: 'apps/test',
        dependsOn: ['build:lib'],
        input: [
          { auto: true },
          '!apps/test/.nuxt/**',
          '!apps/test/test-results/**',
          '!apps/test/playwright-report/**',
        ],
      },
      'test:types': {
        command: 'vp test',
        cwd: 'apps/test',
        dependsOn: ['build:lib'],
        // vp test writes its run cache under node_modules/.vite
        input: [{ auto: true }, '!apps/test/.nuxt/**', '!apps/test/node_modules/**'],
      },
      'build:playground': {
        command: 'vp exec nuxi build',
        cwd: 'apps/playground',
        dependsOn: ['build:lib'],
        input: [{ auto: true }, '!apps/playground/.nuxt/**', '!apps/playground/.output/**'],
      },
      'build:docs': {
        command: 'vp exec astro build',
        cwd: 'apps/docs',
        input: [{ auto: true }, '!apps/docs/dist/**'],
      },
    },
  },
});
