import { useFixScreenshotFileName as orgUseFixScreenshotFileName } from '../src/features/screenshot/hooks/use-fix-screenshot-file-name';

type UseFixScreenshotFileName = (props: {
  fixFunction?: boolean;
}) => ReturnType<typeof orgUseFixScreenshotFileName>;

export const useFixScreenshotFileName = vi.fn<UseFixScreenshotFileName>();
