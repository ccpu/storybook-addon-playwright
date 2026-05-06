import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const variantOptions = ['primary', 'secondary'] as const;
const contactOptions = ['email', 'phone', 'mail'] as const;
const countryOptions = ['USA', 'Canada', 'Mexico'] as const;

const iconMapping = {
  arrow: <span aria-hidden>{'>'}</span>,
  none: null,
  plus: <span aria-hidden>+</span>,
  star: <span aria-hidden>*</span>,
};

type Variant = (typeof variantOptions)[number];
type Contact = (typeof contactOptions)[number];
type Country = (typeof countryOptions)[number];

type ControlsLabProps = {
  accentColor: string;
  advanced: boolean;
  avatar: string[];
  contact: Contact;
  contactMethods: Contact[];
  countries: Country[];
  country: Country;
  createdAt: number;
  disabled: boolean;
  elevation: number;
  icon: React.ReactNode;
  label: string;
  margin: number;
  padding: number;
  tags: string[];
  user: {
    name: string;
    role: string;
  };
  variant: Variant;
  width: number;
};

type ControlsStoryArgs = ControlsLabProps & {
  debugSecret: string;
  footer: string;
  internalOnly: string;
  themeNote: string;
};

const ControlsLab = ({
  accentColor,
  advanced,
  avatar,
  contact,
  contactMethods,
  countries,
  country,
  createdAt,
  disabled,
  elevation,
  icon,
  label,
  margin,
  padding,
  tags,
  user,
  variant,
  width,
}: ControlsLabProps) => {
  const createdDate = new Date(createdAt);
  const dateValue = Number.isNaN(createdDate.getTime())
    ? 'Invalid date'
    : createdDate.toISOString().slice(0, 10);

  return (
    <section
      style={{
        border: `1px solid ${accentColor}`,
        borderRadius: 12,
        boxShadow: `0 ${elevation}px ${elevation * 2}px rgba(0, 0, 0, 0.12)`,
        color: '#1f2937',
        margin: '20px auto',
        maxWidth: width,
        padding: 20,
      }}
    >
      <button
        disabled={disabled}
        style={{
          background: variant === 'primary' ? accentColor : '#ffffff',
          border: `1px solid ${accentColor}`,
          borderRadius: 8,
          color: variant === 'primary' ? '#ffffff' : '#111827',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          gap: 6,
          opacity: disabled ? 0.6 : 1,
          padding: `${padding}px ${margin + 8}px`,
        }}
        type="button"
      >
        {icon}
        {label}
      </button>

      <pre
        style={{
          background: '#f3f4f6',
          borderRadius: 8,
          fontSize: 12,
          marginTop: 16,
          overflow: 'auto',
          padding: 12,
        }}
      >
        {JSON.stringify(
          {
            advanced,
            avatarCount: avatar.length,
            contact,
            contactMethods,
            countries,
            country,
            createdAt: dateValue,
            tags,
            user,
            variant,
          },
          null,
          2,
        )}
      </pre>
    </section>
  );
};

const meta: Meta<ControlsStoryArgs> = {
  argTypes: {
    accentColor: {
      control: {
        presetColors: ['#0f766e', '#2563eb', '#dc2626'],
        type: 'color',
      },
    },
    advanced: { control: 'boolean' },
    avatar: { control: { accept: '.png,.jpg', type: 'file' } },
    contact: { control: 'inline-radio', options: contactOptions },
    contactMethods: { control: 'inline-check', options: contactOptions },
    countries: { control: 'multi-select', options: countryOptions },
    country: { control: 'select', options: countryOptions },
    createdAt: { control: 'date' },
    debugSecret: { control: false },
    elevation: { control: { max: 12, min: 0, step: 1, type: 'range' } },
    icon: {
      control: {
        labels: {
          arrow: 'Arrow',
          none: 'None',
          plus: 'Plus',
          star: 'Star',
        },
        type: 'select',
      },
      mapping: iconMapping,
      options: ['none', 'plus', 'arrow', 'star'],
    },
    internalOnly: { table: { disable: true } },
    label: { control: 'text' },
    margin: { control: 'number', if: { arg: 'advanced' } },
    padding: { control: 'number', if: { arg: 'advanced' } },
    tags: { control: 'object' },
    themeNote: { control: 'text', if: { eq: 'dark', global: 'theme' } },
    user: { control: 'object' },
    variant: {
      control: { type: 'radio' },
      options: variantOptions,
    },
    width: { control: { max: 520, min: 240, step: 20, type: 'number' } },
  },
  args: {
    accentColor: '#0f766e',
    advanced: false,
    avatar: [],
    contact: 'email',
    contactMethods: ['email'],
    countries: ['USA'],
    country: 'USA',
    createdAt: Date.now(),
    debugSecret: 'sensitive-token',
    disabled: false,
    elevation: 4,
    footer: 'Footer from custom args',
    icon: 'none',
    internalOnly: 'hidden-from-table',
    label: 'Controls Playground',
    margin: 8,
    padding: 10,
    tags: ['alpha', 'beta'],
    themeNote: 'Theme note from custom args',
    user: {
      name: 'Storybook User',
      role: 'admin',
    },
    variant: 'primary',
    width: 420,
  },
  component: ControlsLab,
  parameters: {
    controls: {
      expanded: true,
      sort: 'alpha',
    },
  },
  render: ({ debugSecret, footer, internalOnly, themeNote, ...args }) => (
    <div>
      <ControlsLab {...args} />
      <p style={{ margin: '8px auto', maxWidth: 420 }}>{footer}</p>
      <p style={{ margin: '8px auto', maxWidth: 420 }}>{themeNote}</p>
      <p style={{ margin: '8px auto', maxWidth: 420 }}>
        {debugSecret
          ? 'Debug secret exists (control disabled)'
          : 'No debug secret'}
      </p>
      <p style={{ margin: '8px auto', maxWidth: 420 }}>
        Internal row hidden: {internalOnly ? 'yes' : 'no'}
      </p>
    </div>
  ),
  title: 'Controls/Arg Patterns',
};

export default meta;
type Story = StoryObj<ControlsStoryArgs>;

const storyLevelArgs: Partial<ControlsStoryArgs> = {
  accentColor: '#b45309',
  contact: 'phone',
  disabled: true,
  label: 'Story-level args override',
  variant: 'secondary',
};

export const MetaArgsAndMetaArgTypes: Story = {};

export const StoryLevelArgsOverride: Story = {
  args: storyLevelArgs,
};

export const StoryLevelArgTypesOverride: Story = {
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: variantOptions,
    },
    width: {
      control: { max: 520, min: 240, step: 20, type: 'range' },
    },
  },
  args: {
    label: 'Story-level argTypes override',
    width: 360,
  },
};

export const CustomArgsNotInComponentProps: Story = {
  args: {
    footer: 'Added as custom story arg, then rendered below component.',
    themeNote: 'Visible only when global theme is dark.',
  },
};

export const IncludeSubsetControls: Story = {
  parameters: {
    controls: {
      include: ['label', 'variant', 'disabled', 'accentColor'],
    },
  },
};

export const ExcludeSomeControls: Story = {
  parameters: {
    controls: {
      exclude: ['avatar', 'debugSecret', 'internalOnly'],
    },
  },
};

export const DisableControlsAtStoryLevel: Story = {
  argTypes: {
    label: { control: false },
    tags: { table: { disable: true } },
  },
  parameters: {
    controls: {
      include: ['label', 'tags', 'variant', 'width'],
    },
  },
};

export const RequiredFirstSort: Story = {
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
  },
};
