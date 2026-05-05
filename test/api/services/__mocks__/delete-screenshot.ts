import { deleteScreenshot as orgDeleteScreenshot } from '../../../../src/api/services/delete-screenshot';

export const deleteScreenshot = vi.fn<typeof orgDeleteScreenshot>();
