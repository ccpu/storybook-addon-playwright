export default {
  '*.{ts,tsx}': () => ['pnpm run typecheck'],
  '*.{ts,tsx,js,jsx,yml,yaml,json}': () => ['pnpm run lint:fix', 'pnpm run format:fix'],
};
