/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';
import { types as addonsTypes } from '@storybook/addons';

const addonsMock = jest.createMockFromModule('@storybook/addons') as any;
export const types = addonsTypes;

const ee = new EventEmitter();

addonsMock.getChannel = () => ({
  emit: ee.emit.bind(ee),
  off: ee.off.bind(ee),
  on: ee.on.bind(ee),
});

addonsMock.__setEvent = (eve: string, val: unknown) => {
  ee.emit(eve, val);
};

addonsMock.register = (_id: string, fn: () => void) => fn();

addonsMock.add = jest.fn();

export default addonsMock;
