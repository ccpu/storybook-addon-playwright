// Test mock for dist/trpc/router – prevents loading the real router (which
// transitively imports sharp/join-images).
module.exports = { appRouter: { _def: {} } };
