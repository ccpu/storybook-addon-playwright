import { ControlTypes } from '.';
import { OptionsKnobOptionsDisplay } from '@storybook/addon-knobs/dist/ts3.9/components/types/Options';

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
