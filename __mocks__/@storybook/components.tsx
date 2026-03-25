/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// Mock Storybook UI components for testing
export const IconButton = React.forwardRef<any, any>((props, ref) =>
  React.createElement('button', { ...props, ref }, props.children),
);
IconButton.displayName = 'IconButton';

export const Separator = (props: any) =>
  React.createElement('span', props, props.children);
Separator.displayName = 'Separator';

export const ScrollArea = (props: any) =>
  React.createElement('div', props, props.children);
ScrollArea.displayName = 'ScrollArea';

export const AddonPanel = (props: any) =>
  React.createElement('div', props, props.children);
AddonPanel.displayName = 'AddonPanel';

export const Placeholder = (props: any) =>
  React.createElement('div', props, props.children);

export const TabsState = (props: any) =>
  React.createElement('div', props, props.children);

export const Tabs = (props: any) =>
  React.createElement('div', props, props.children);

export const Link = (props: any) =>
  React.createElement('a', props, props.children);

export const Form = {
  Button: (props: any) => React.createElement('button', props, props.children),
  Field: (props: any) => React.createElement('div', props, props.children),
  Input: React.forwardRef<any, any>((props, ref) =>
    React.createElement('input', { ...props, ref }),
  ),
  Select: React.forwardRef<any, any>((props, ref) =>
    React.createElement('select', { ...props, ref }, props.children),
  ),
  Textarea: React.forwardRef<any, any>((props, ref) =>
    React.createElement('textarea', { ...props, ref }),
  ),
};

export const ActionBar = (props: any) =>
  React.createElement('div', props, props.children);

export const Spaced = (props: any) =>
  React.createElement('div', props, props.children);

export const Loader = (props: any) =>
  React.createElement('div', props, props.children);

export const TooltipNote = (props: any) =>
  React.createElement('div', props, props.children);

export const WithTooltip = (props: any) =>
  React.createElement('div', props, props.children);

export const TooltipLinkList = (props: any) =>
  React.createElement('div', props, props.children);

export const Badge = (props: any) =>
  React.createElement('span', props, props.children);

export const Button = (props: any) =>
  React.createElement('button', props, props.children);

export const SyntaxHighlighter = (props: any) =>
  React.createElement('pre', props, props.children);
