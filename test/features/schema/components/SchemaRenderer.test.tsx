import { SchemaRenderer } from '../../../../src/features/schema/components/SchemaRenderer';
import { shallow } from 'enzyme';
import React from 'react';

describe('SchemaRenderer', () => {
  const onChangeMock = vi.fn();

  const getVal = () => {
    return null;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(
      <SchemaRenderer
        onChange={onChangeMock}
        getValue={getVal}
        schemaProps={{ name: 'schema-name' }}
      />,
    );

    expect(wrapper.exists()).toBeTruthy();
  });
});
