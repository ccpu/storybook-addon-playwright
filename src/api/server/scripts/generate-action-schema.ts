import { Mouse, Touchscreen } from 'playwright';
import { PageMethodKeys } from '../../typings';
import { generateSchema } from './generate-schema';

type MouseKeys = keyof Mouse;
type TouchscreenKeys = keyof Touchscreen;

const selectedPageKeys: PageMethodKeys[] = [
  'click',
  'dblclick',
  'fill',
  'focus',
  'hover',
  'hover',
  'press',
  'type',
  'check',
  'uncheck',
  'scrollSelector',
  'waitForSelector',
  'waitForTimeout',
  'dragDropSelector',
  'takeScreenshot',
  'takeScreenshotAll',
  'takeScreenshotOptions',
  'setSelectorSize',
  'clearInput',
  'mouseDownOnSelector',
  'mouseMoveToSelector',
  'selectorMouseWheel',
  'keyboard',
];

const selectedMouseKeys: MouseKeys[] = [
  'click',
  'dblclick',
  'down',
  'move',
  'up',
];

const selectedTouchProp: TouchscreenKeys[] = ['tap'];

const selectedKeys = [
  ...selectedPageKeys,
  ...selectedMouseKeys.map((x) => 'mouse.' + x),
  ...selectedTouchProp.map((x) => 'touchscreen.' + x),
] as string[];

export const generateActionSchema = (pathToTypes: string) => {
  const result = generateSchema({
    includeProps: selectedKeys,
    path: pathToTypes,
    type: 'PlaywrightPage',
  });
  return result;
};
