import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { createTheme, ThemeProvider as MuThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';

import { Dialog } from '../src/components/common/Dialog';

const bodyLines = Array.from(
  { length: 24 },
  (_, index) =>
    `This is dialog body row ${index + 1}. The content area should scroll while the header and footer remain visible.`,
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a',
    },
  },
});

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'Common/Dialog',
  args: {
    enableCloseButton: true,
    height: '420px',
    open: true,
    subtitle: 'The dialog body should scroll independently of the title and actions.',
    title: 'Scrollable dialog shell',
    width: '560px',
  },
  render: (args) => {
    const TitleActions = () => (
      <button
        type="button"
        style={{
          background: '#e2e8f0',
          border: '1px solid #94a3b8',
          borderRadius: 6,
          color: '#0f172a',
          fontSize: 12,
          padding: '6px 10px',
        }}
      >
        Title action
      </button>
    );

    const FooterActions = () => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', width: '100%' }}>
        <button
          type="button"
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            color: '#0f172a',
            fontSize: 12,
            padding: '6px 12px',
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          style={{
            background: '#0f172a',
            border: '1px solid #0f172a',
            borderRadius: 6,
            color: '#ffffff',
            fontSize: 12,
            padding: '6px 12px',
          }}
        >
          Confirm
        </button>
      </div>
    );

    return (
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(15,23,42,0.08), rgba(148,163,184,0.16))',
          minHeight: '100vh',
          padding: 24,
        }}
      >
        <StylesThemeProvider theme={theme}>
          <MuThemeProvider theme={theme}>
            <Dialog {...args} titleActions={TitleActions} footerActions={FooterActions}>
              <div style={{ display: 'grid', gap: 12 }}>
                <p style={{ margin: 0 }}>
                  This content block intentionally exceeds the dialog height so the
                  scrolling behavior is easy to inspect in the browser.
                </p>
                {bodyLines.map((line) => (
                  <p key={line} style={{ margin: 0 }}>
                    {line}
                  </p>
                ))}
              </div>
            </Dialog>
          </MuThemeProvider>
        </StylesThemeProvider>
      </div>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const LongContent: Story = {};
