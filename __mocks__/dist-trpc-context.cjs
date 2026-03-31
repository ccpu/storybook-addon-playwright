// Test mock for dist/trpc/context – prevents loading the real context factory.
const { fn } = require('vitest');
module.exports = {
  createContext: fn
    ? fn().mockReturnValue({})
    : function () {
        return {};
      },
};
