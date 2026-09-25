import { defineConfig } from 'vite-plus/test/config';

export default defineConfig({
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://release-v1-0-0-rc-1-viteplus-dev.voidzero-docs.workers.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    // playwright owns the runtime suite, this project is type tests only
    include: [],
    typecheck: {
      enabled: true,
      only: true,
      include: ['test-types/**/*.test-d.ts'],
      tsconfig: './test-types/tsconfig.json',
    },
  },
});
