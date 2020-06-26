import { getRawStories } from './get-raw-stories';

export const getStoryFunction = (storyId: string) => {
  const raw = getRawStories();
  if (!raw) return undefined;
  const story = raw.find((x) => x.id === storyId);
  if (!story) return undefined;

  return story.getOriginal();
};
