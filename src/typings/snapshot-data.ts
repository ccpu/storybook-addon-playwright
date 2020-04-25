import { KnobStoreKnob } from '.';

export type Actions = { key: string; value: unknown };

export interface SnapshotData {
  description: string;
  knobs?: KnobStoreKnob[];
  actions?: Actions[];
  clip?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}
