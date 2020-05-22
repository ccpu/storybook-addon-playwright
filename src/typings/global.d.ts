import 'jest-enzyme';
import { StoryAction } from '../src/typings';

declare global {
  interface Window {
    __storyActions: StoryAction[];
  }
}

declare namespace NodeJS {
  interface Global {
    UNSTABLE_SKIP_REPORTING: boolean;
  }
}

export {};
