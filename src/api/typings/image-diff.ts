import { BrowserTypes } from '../../typings';
import {
  ImageDiffResultOutput as OrgImageDiffResultOutput,
  StoryInfo,
} from '../../schema';

export type DiffDirection = 'horizontal' | 'vertical';

export type ImageDiffResult = OrgImageDiffResultOutput;

export interface DiffImageToScreenShot extends StoryInfo {
  title: string;
  browserType: BrowserTypes;
}
