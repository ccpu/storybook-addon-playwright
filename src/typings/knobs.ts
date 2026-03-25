export interface KnobStoreKnob {
  name: string;
  type: string;
  value: unknown;
  defaultValue?: unknown;
  options?: unknown;
  optionsObj?: { display?: string };
  groupId?: string;
  label?: string;
  used?: boolean;
}

export type KnobStore = Record<string, KnobStoreKnob>;

export { KnobStoreKnob as KnobStoreKnobType };
