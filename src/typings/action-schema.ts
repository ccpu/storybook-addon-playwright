import { Definition } from 'ts-to-json';

export type ActionSchema = Definition;

export type StoryActions = {
  [key: string]: ActionSchema;
};
