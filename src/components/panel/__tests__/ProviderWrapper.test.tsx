import { ProviderWrapper } from '../ProviderWrapper';
import { shallow } from 'enzyme';
import React from 'react';

describe('ProviderWrapper', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ProviderWrapper>
        <div>test</div>
      </ProviderWrapper>,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
