jest.mock('../../use-knobs', () => ({
  useKnobs: () => {
    return undefined;
  },
}));
