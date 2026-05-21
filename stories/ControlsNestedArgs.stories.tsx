import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

type ControlsNestedArgs = {
  data: {
    nested: {
      footer: string;
      themeNote: string;
    };
    title: string;
  };
};

const JSON_SPACING = 2;

const ControlsNestedArgsPanel = ({ data }: ControlsNestedArgs) => {
  return (
    <section
      style={{
        margin: '24px auto',
        maxWidth: 520,
        padding: 20,
      }}
    >
      <pre
        style={{
          background: '#f3f4f6',
          borderRadius: 12,
          fontSize: 13,
          margin: 0,
          overflow: 'auto',
          padding: 16,
        }}
      >
        {JSON.stringify(data, null, JSON_SPACING)}
      </pre>
    </section>
  );
};

const meta: Meta<ControlsNestedArgs> = {
  argTypes: {
    data: { control: 'object' },
  },
  args: {
    data: {
      nested: {
        footer: 'Added as a nested custom arg.',
        themeNote: 'Visible only when global theme is dark.',
      },
      title: 'Nested custom args data',
    },
  },
  component: ControlsNestedArgsPanel,
  parameters: {
    controls: {
      expanded: true,
      sort: 'alpha',
    },
  },
  title: 'Controls/Nested Args',
};

export default meta;

type Story = StoryObj<ControlsNestedArgs>;

export const NestedCustomArgs: Story = {};
