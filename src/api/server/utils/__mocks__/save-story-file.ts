const saveStoryFile = jest.fn();

saveStoryFile.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve();
  });
});

export { saveStoryFile };
