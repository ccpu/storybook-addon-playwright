const joinImages = vi.fn(async (images: Buffer[] = []) => {
  const mergedBuffer =
    images.length > 0 ? Buffer.concat(images) : Buffer.from('join-images');

  return {
    toFormat: vi.fn(() => ({
      toBuffer: vi.fn(async () => mergedBuffer),
    })),
  };
});

export default joinImages;
