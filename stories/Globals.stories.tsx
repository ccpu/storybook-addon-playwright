import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

type Theme = 'light' | 'dark';

type GlobalsControlsArgs = {
  accentColor: string;
  body: string;
  headline: string;
  showMetadata: boolean;
  themeHint: string;
};

type GlobalsControlsProps = GlobalsControlsArgs & {
  theme: Theme;
};

const GlobalsControlsPanel = ({
  accentColor,
  body,
  headline,
  showMetadata,
  theme,
  themeHint,
}: GlobalsControlsProps) => {
  const isDark = theme === 'dark';

  return (
    <section
      style={{
        background: isDark ? '#0f172a' : '#f8fafc',
        border: `1px solid ${accentColor}`,
        borderRadius: 16,
        color: isDark ? '#e2e8f0' : '#0f172a',
        margin: '24px auto',
        maxWidth: 520,
        padding: 24,
        transition: 'background 160ms ease, color 160ms ease, border-color 160ms ease',
      }}
    >
      <div
        style={{
          color: accentColor,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        Toolbar global: {theme}
      </div>

      <h2 style={{ fontSize: 28, lineHeight: 1.1, margin: '0 0 12px' }}>{headline}</h2>

      <p style={{ fontSize: 16, lineHeight: 1.5, margin: 0 }}>{body}</p>

      {themeHint ? (
        <p
          style={{
            background: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(15, 118, 110, 0.12)',
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.5,
            marginTop: 16,
            padding: 12,
          }}
        >
          {themeHint}
        </p>
      ) : null}

      {showMetadata ? (
        <pre
          style={{
            background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#ffffff',
            borderRadius: 12,
            fontSize: 12,
            marginTop: 16,
            overflow: 'auto',
            padding: 12,
          }}
        >
          {JSON.stringify(
            {
              accentColor,
              theme,
            },
            null,
            '  ',
          )}
        </pre>
      ) : null}
    </section>
  );
};

const meta: Meta<GlobalsControlsArgs> = {
  argTypes: {
    accentColor: {
      control: {
        presetColors: ['#0f766e', '#2563eb', '#dc2626'],
        type: 'color',
      },
    },
    body: { control: 'text' },
    headline: { control: 'text' },
    showMetadata: { control: 'boolean' },
    themeHint: { control: 'text', if: { eq: 'dark', global: 'theme' } },
  },
  args: {
    accentColor: '#0f766e',
    body: 'Use the toolbar to switch the theme global and watch the preview react.',
    headline: 'Globals and controls together',
    showMetadata: true,
    themeHint: 'This extra control only appears when the theme global is dark.',
  },
  component: GlobalsControlsPanel,
  parameters: {
    controls: {
      expanded: true,
      sort: 'alpha',
    },
  },
  title: 'Globals/Theme Controls',
};

export default meta;

type Story = StoryObj<GlobalsControlsArgs>;

export const ToolbarDrivenPlayground: Story = {
  render: (args, context) => {
    const theme = context.globals.theme === 'dark' ? 'dark' : 'light';

    return <GlobalsControlsPanel {...args} theme={theme} />;
  },
};

export const CurrentGlobalsSnapshot: Story = {
  args: {
    body: 'Capture this story to verify that screenshot globals match toolbar state.',
    headline: 'Live globals view',
    showMetadata: false,
    themeHint: '',
  },
  render: (args, context) => {
    const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
    const isDark = theme === 'dark';

    return (
      <section
        style={{
          margin: '24px auto',
          maxWidth: 620,
        }}
      >
        <GlobalsControlsPanel {...args} theme={theme} />

        <div
          style={{
            background: isDark ? '#020617' : '#f1f5f9',
            borderRadius: 12,
            color: isDark ? '#cbd5e1' : '#0f172a',
            marginTop: 12,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
            Current globals (from story context)
          </div>
          <pre
            style={{
              fontSize: 12,
              lineHeight: 1.4,
              margin: 0,
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {JSON.stringify(context.globals, null, '  ')}
          </pre>
        </div>
      </section>
    );
  },
};
