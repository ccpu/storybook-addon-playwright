const makeScreenshot = jest.fn();
makeScreenshot.mockImplementation(() => {
  return new Promise((resolve) => {
    resolve({
      base64: 'base64-image',
      browserName: '',
      buffer: Buffer.from('base64-image', 'utf-8'),
    });
  });
});

export { makeScreenshot };
