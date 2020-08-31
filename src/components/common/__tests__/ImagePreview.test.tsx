import '../../../../__manual_mocks__/react-useEffect';
import { ImagePreview } from '../ImagePreview';
import { shallow } from 'enzyme';
import React from 'react';
import { MapInteraction } from 'react-map-interaction';

describe('ImagePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(<ImagePreview imgSrcString="base64-mage" />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should render nothing', () => {
    const wrapper = shallow(<ImagePreview imgSrcString={null} />);
    expect(wrapper.type()).toBe(null);
  });

  it('should render nothing when imgSrcString prop value changed, to refresh MapInteraction', () => {
    jest.useFakeTimers();
    const wrapper = shallow(<ImagePreview imgSrcString="base64-mage" />);

    const oldProps = wrapper.find(MapInteraction).props();

    wrapper.setProps({ imgSrcString: 'base64-mage-2' });

    const newProps = wrapper.find(MapInteraction).props();

    expect(oldProps === newProps).toBeFalsy();
  });
});
