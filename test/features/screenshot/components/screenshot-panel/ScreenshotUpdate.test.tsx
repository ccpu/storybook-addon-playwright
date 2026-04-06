// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
import '../../../../manual-mocks/react-useEffect';
import { ScreenshotUpdate } from '../../../../../src/features/screenshot/components/screenshot-panel/ScreenshotUpdate';
import { shallow } from 'enzyme';
import React from 'react';
import { getScreenshotDate } from '../../../../configs/get-screenshot-date';
import { IconButton } from '@material-ui/core';
import {
  testScreenshot,
  updateScreenshot,
} from '../../../../../src/api/trpc/clients/screenshot.client';
import { ImageDiffPreviewDialog } from '../../../../../src/components/common';

vi.mock(
  '../../../../../src/features/screenshot/store/context',
  async () => await import('../../store/__mocks__/context'),
);
vi.mock(
  '../../../../../src/api/trpc/clients/screenshot.client',
  async () =>
    await import('../../../../api/trpc/clients/__mocks__/screenshot.client'),
);
vi.mock(
  '../../../../../src/hooks/use-current-story-data',
  async () =>
    await import('../../../../hooks/__mocks__/use-current-story-data'),
);

const testScreenshotMock = vi.mocked(testScreenshot);
const updateScreenshotMock = vi.mocked(updateScreenshot);

describe('ScreenshotUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should render', () => {
    const onStateChangeMock = vi.fn();
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={onStateChangeMock}
      />,
    );
    expect(wrapper.exists()).toBeTruthy();
    expect(onStateChangeMock).toHaveBeenCalledTimes(1);
  });

  it('should fetch image diff and show ImageDiffPreviewDialog if imageDiffResult prop not provided and save', async () => {
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={vi.fn()}
      />,
    );
    const button = wrapper.find(IconButton).first();
    button
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    await new Promise((resolve) => setImmediate(resolve));

    const imageDiffPreviewDialog = wrapper.find(ImageDiffPreviewDialog);

    expect(imageDiffPreviewDialog).toHaveLength(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(imageDiffPreviewDialog.props().titleActions()).toBeDefined();

    expect(testScreenshotMock).toHaveBeenCalledWith({
      fileName: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });

    expect(updateScreenshotMock).toHaveBeenCalledTimes(0);

    const footerButtons = imageDiffPreviewDialog
      .props()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .footerActions().props.children as { props: { onClick: () => void } }[];

    await footerButtons[1].props.onClick();

    expect(footerButtons).toHaveLength(2);

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      base64: 'base64-image',
      fileName: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });

  it('should call for update directly if imageDiffResult prop provided', async () => {
    const wrapper = shallow(
      <ScreenshotUpdate
        screenshot={getScreenshotDate()}
        onStateChange={vi.fn()}
        imageDiffResult={{
          fileName: './test.stories.tsx',
          newScreenshot: 'base64-image',
          pass: true,
          screenshotId: 'screenshot-id',
          storyId: 'story-id',
        }}
      />,
    );
    const iconButton = wrapper.find(IconButton).first();

    await iconButton
      .props()
      .onClick({} as React.MouseEvent<HTMLButtonElement, MouseEvent>);

    await new Promise((resolve) => setImmediate(resolve));

    expect(wrapper.find(ImageDiffPreviewDialog)).toHaveLength(0);

    expect(testScreenshotMock).toHaveBeenCalledTimes(0);

    expect(updateScreenshotMock).toHaveBeenCalledWith({
      base64: 'base64-image',
      fileName: './test.stories.tsx',
      screenshotId: 'screenshot-id',
      storyId: 'story-id',
    });
  });
});
