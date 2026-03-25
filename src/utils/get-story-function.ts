import { getRawStories } from './get-raw-stories';

export const getStoryFunction = (storyId: string): any => {
  const raw = getRawStories();
  if (!raw) return undefined;
  const story = raw.find((x) => x.id === storyId);
  if (!story) return undefined;

  // SB8: story is the prepared story object; the component function is the story itself
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (story as any).getOriginal === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (story as any).getOriginal();
  }
  return story;
};
