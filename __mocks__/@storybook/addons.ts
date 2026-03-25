/* eslint-disable @typescript-eslint/no-explicit-any */
// Legacy mock - redirects to @storybook/manager-api mock for backward compatibility
import { EventEmitter } from 'events';

const addonsMock = {} as any;

export const types = {
  PANEL: 'panel',
  PREVIEW: 'preview',
  TAB: 'tab',
  TOOL: 'tool',
  TOOLEXTRA: 'toolextra',
};

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
