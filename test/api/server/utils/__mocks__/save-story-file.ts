const saveStoryFile = vi.fn();

saveStoryFile.mockImplementation(() => {
  return new Promise<void>((resolve) => {
    resolve();
  });
});

export { saveStoryFile };
