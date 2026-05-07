import type {
  ImageDiffResultOutput as OrgImageDiffResultOutput,
  StoryInfo,
} from '../../schema';
import type { BrowserTypes } from '../../typings';

export type DiffDirection = 'horizontal' | 'vertical';

export type ImageDiffResult = OrgImageDiffResultOutput;

export interface DiffImageToScreenShot extends StoryInfo {
  title: string;
  browserType: BrowserTypes;
}
