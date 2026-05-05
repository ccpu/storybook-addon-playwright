import { saveStoryFile as orgSaveStoryFile } from '../../../../../src/api/server/utils/save-story-file';

const saveStoryFile = vi.fn<typeof orgSaveStoryFile>();

saveStoryFile.mockImplementation(() => {
  return new Promise<void>((resolve) => {
    resolve();
  });
});

export { saveStoryFile };
