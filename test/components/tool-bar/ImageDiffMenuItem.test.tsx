import { getStoryData } from '../../configs/story-data';
import { ImageDiffMenuItem } from '../../../src/components/tool-bar/ImageDiffMenuItem';
import { shallow } from 'enzyme';
import React from 'react';
import { ListItem } from '@storybook/components';
import { useStorybookApi } from '@storybook/manager-api';

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
        imageDiff={{ pass: true, storyId: 'story-id' }}
        onClick={onClickMock}
      />,
    );

    expect(wrapper.find(ListItem).props().onClick).toBeUndefined();

    expect(wrapper.find(ListItem).props().title).toBe('Unable to locate story!');
  });
});
