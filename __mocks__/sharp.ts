type SharpChain = {
  composite: jest.Mock;
  extend: jest.Mock;
  modulate: jest.Mock;
  sharpen: jest.Mock;
  resize: jest.Mock;
  png: jest.Mock;
  toFormat: jest.Mock;
  toBuffer: jest.Mock;
  metadata: jest.Mock;
};

const createChain = (input?: Buffer) => {
  const chain = {} as SharpChain;

  chain.composite = jest.fn(() => chain);
  chain.extend = jest.fn(() => chain);
  chain.modulate = jest.fn(() => chain);
  chain.sharpen = jest.fn(() => chain);
  chain.resize = jest.fn(() => chain);
  chain.png = jest.fn(() => chain);
  chain.toFormat = jest.fn(() => chain);
  chain.toBuffer = jest.fn(async () => input ?? Buffer.from('sharp'));
  chain.metadata = jest.fn(async () => ({
    height: 1,
    width: 1,
  }));

  return chain;
};

const sharp = jest.fn((input?: Buffer) => createChain(input));

export default sharp;
