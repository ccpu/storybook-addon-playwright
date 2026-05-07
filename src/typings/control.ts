import type { ControlTypes } from '.';

export type OptionsKnobOptionsDisplay =
  | 'radio'
  | 'inline-radio'
  | 'check'
  | 'inline-check'
  | 'select'
  | 'multi-select';

export interface ControlProps {
  label: string;
  type: ControlTypes;
  value?: unknown;
  onChange: (value: unknown) => void;
  options?: string[];
  display?: OptionsKnobOptionsDisplay;
  description?: string;
  appendValueToTitle: boolean;
  onAppendValueToTitle: () => void;
  isRequired: boolean;
  defaultValue?: unknown;
}
