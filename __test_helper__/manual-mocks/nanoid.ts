jest.mock('nanoid', () => ({
  nanoid: () => {
    return 'action-id';
  },
}));
