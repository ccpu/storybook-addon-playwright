import { EventEmitter } from 'events';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addonsMock = jest.genMockFromModule('@storybook/addons') as any;

const ee = new EventEmitter();

addonsMock.getChannel = () => ({
  emit: ee.emit.bind(ee),
  off: ee.off.bind(ee),
  on: ee.on.bind(ee),
});

addonsMock.__setEvent = (eve: string, val: unknown) => {
  ee.emit(eve, val);
};

export default addonsMock;
