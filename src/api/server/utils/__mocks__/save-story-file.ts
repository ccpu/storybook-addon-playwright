const saveStoryFile = vi.fn();

saveStoryFile.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve();
  });
});

export { saveStoryFile };
