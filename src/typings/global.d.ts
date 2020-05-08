import 'jest-enzyme';
import { StoryAction } from '../src/typings';

declare global {
  interface Window {
    __storyActions: StoryAction[];
  }
}

export {};
