const joinImages = jest.fn(async (images: Buffer[] = []) => {
  const mergedBuffer =
    images.length > 0 ? Buffer.concat(images) : Buffer.from('join-images');

  return {
    toFormat: jest.fn(() => ({
      toBuffer: jest.fn(async () => mergedBuffer),
    })),
  };
});

export default joinImages;
