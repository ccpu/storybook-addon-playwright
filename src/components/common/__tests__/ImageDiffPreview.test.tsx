import { ImageDiffPreview } from '../ImageDiffPreview';
import { shallow } from 'enzyme';
import React from 'react';
import { ImagePreview } from '../ImagePreview';
import { Tabs } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

describe('ImageDiffPreview', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ImageDiffPreview imageDiffResult={{ pass: true }} />,
    );
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should not have Tabs if image diff passed', () => {
    const wrapper = shallow(
      <ImageDiffPreview imageDiffResult={{ pass: true }} />,
    );
    expect(wrapper.find(Tabs)).toHaveLength(0);
  });

  it('should have tabs when image diff not passed', () => {
    const wrapper = shallow(
      <ImageDiffPreview imageDiffResult={{ pass: false }} />,
    );
    expect(wrapper.find(Tabs)).toHaveLength(1);
  });

  it('should show new image if image diff passed', () => {
    const wrapper = shallow(
      <ImageDiffPreview
        imageDiffResult={{
          imgSrcString: 'diff',
          newScreenshot: 'new',
          pass: true,
        }}
      />,
    );
    expect(wrapper.find(ImagePreview).props().imgSrcString).toBe('new');
  });

  it('should show new image if image diff not passed and activeTab not set', () => {
    const wrapper = shallow(
      <ImageDiffPreview
        imageDiffResult={{
          imgSrcString: 'diff',
          newScreenshot: 'new',
          pass: true,
        }}
      />,
    );
    expect(wrapper.find(ImagePreview).props().imgSrcString).toBe('new');
  });

  it('should show diff image if image diff not passed and activeTab set to "imageDiff"', () => {
    const wrapper = shallow(
      <ImageDiffPreview
        imageDiffResult={{
          imgSrcString: 'diff',
          newScreenshot: 'new',
          pass: false,
        }}
        activeTab="imageDiff"
      />,
    );
    expect(wrapper.find(ImagePreview).props().imgSrcString).toBe('diff');
  });

  it('should toggle view', () => {
    const wrapper = shallow(
      <ImageDiffPreview
        imageDiffResult={{
          imgSrcString: 'diff',
          newScreenshot: 'new',
          pass: false,
        }}
      />,
    );
    wrapper
      .find(Tabs)
      .props()
      .onChange({} as React.ChangeEvent<unknown>, 0);

    expect(wrapper.find(ImagePreview).props().imgSrcString).toBe('diff');

    wrapper
      .find(Tabs)
      .props()
      .onChange({} as React.ChangeEvent<unknown>, 1);

    expect(wrapper.find(ImagePreview).props().imgSrcString).toBe('new');
  });

  it('should show image diff error', () => {
    const wrapper = shallow(
      <ImageDiffPreview
        imageDiffResult={{
          diffRatio: 0.5,
          imgSrcString: 'diff',
          newScreenshot: 'new',
          pass: false,
        }}
        activeTab="imageDiff"
      />,
    );
    expect(wrapper.find(Alert).text()).toBe(
      'Expected image to match or be a close match to snapshot but was 50% different from snapshot (undefined differing pixels).',
    );
  });
});
