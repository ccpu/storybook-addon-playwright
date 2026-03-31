type SharpChain = {
  composite: Mock;
  extend: Mock;
  modulate: Mock;
  sharpen: Mock;
  resize: Mock;
  png: Mock;
  toFormat: Mock;
  toBuffer: Mock;
  metadata: Mock;
};

const createChain = (input?: Buffer) => {
  const chain = {} as SharpChain;

  chain.composite = vi.fn(() => chain);
  chain.extend = vi.fn(() => chain);
  chain.modulate = vi.fn(() => chain);
  chain.sharpen = vi.fn(() => chain);
  chain.resize = vi.fn(() => chain);
  chain.png = vi.fn(() => chain);
  chain.toFormat = vi.fn(() => chain);
  chain.toBuffer = vi.fn(async () => input ?? Buffer.from('sharp'));
  chain.metadata = vi.fn(async () => ({
    height: 1,
    width: 1,
  }));

  return chain;
};

const sharp = vi.fn((input?: Buffer) => createChain(input));

export default sharp;
