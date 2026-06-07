import { getStoryData } from '../../configs/story-data';
import { ImageDiffMenuItem } from '../../../src/components/tool-bar/ImageDiffMenuItem';
import { shallow } from 'enzyme';
import React from 'react';
import { ListItem } from '@storybook/components';
import { useStorybookApi } from '@storybook/manager-api';

function assertIsReactElement(
  value: React.ReactNode,
): asserts value is React.ReactElement<{ children?: React.ReactNode }> {
  expect(React.isValidElement(value)).toBe(true);
}

describe('ImageDiffMenuItem', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ImageDiffMenuItem imageDiff={{ pass: true }} onClick={vi.fn()} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should load story and call callback', () => {
    const onClickMock = vi.fn();
    const selectStoryMock = vi.fn();
    const setSelectedPanelMock = vi.fn();

    (useStorybookApi as Mock).mockImplementationOnce(() => ({
      getData: () => {
        return getStoryData();
      },
      selectStory: selectStoryMock,
      setSelectedPanel: setSelectedPanelMock,
    }));

    const wrapper = shallow(
      <ImageDiffMenuItem
        imageDiff={{ pass: true, storyId: 'story-id' }}
        onClick={onClickMock}
      />,
    );

    wrapper
      .find(ListItem)
      .props()
      .onClick?.({} as React.MouseEvent);

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(selectStoryMock).toHaveBeenCalledWith('story-id');
    expect(setSelectedPanelMock).toHaveBeenCalledWith(
      'playwright-addon/screenshot-panel',
    );
  });

  it('should show error if unable to find story', () => {
    const onClickMock = vi.fn();
    const selectStoryMock = vi.fn();
    const setSelectedPanelMock = vi.fn();

    (useStorybookApi as Mock).mockImplementationOnce(() => ({
      getData: () => {
        return undefined;
      },
      selectStory: selectStoryMock,
      setSelectedPanel: setSelectedPanelMock,
    }));

    const wrapper = shallow(
      <ImageDiffMenuItem
        imageDiff={{ pass: true, storyId: 'story-id', filePath: './test.stories.tsx' }}
        onClick={onClickMock}
      />,
    );

    expect(wrapper.find(ListItem).props().onClick).toBeUndefined();

    const title = wrapper.find(ListItem).props().title;

    assertIsReactElement(title);

    const titleChildren = React.Children.toArray(title.props.children);
    const messageLine = titleChildren[0] as React.ReactElement<{
      children?: React.ReactNode;
    }>;
    const idLine = titleChildren[1] as React.ReactElement<{ children?: React.ReactNode }>;
    const fileLine = titleChildren[2] as React.ReactElement<{
      children?: React.ReactNode;
    }>;

    expect(messageLine.props.children).toBe('Unable to locate story!');

    const idLineChildren = React.Children.toArray(idLine.props.children);
    const fileLineChildren = React.Children.toArray(fileLine.props.children);

    expect((idLineChildren[0] as React.ReactElement).props.children).toBe('ID:');
    expect(idLineChildren[2]).toBe('story-id');
    expect((fileLineChildren[0] as React.ReactElement).props.children).toBe('File:');
    expect(fileLineChildren[2]).toBe('./test.stories.tsx');
  });
});
