import z from 'zod';

const storyInfoShape = {
  filePath: z.string(),
  storyId: z.string(),
};

export const storyInfoSchema = z.object(storyInfoShape);

export const createStoryInputSchema = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    ...storyInfoShape,
    ...shape,
  });

export const storyInputSchema = createStoryInputSchema({});

export const storyDataSchema = z.object({
  filePath: z.string(),
  id: z.string(),
  name: z.string(),
  parent: z.string(),
});

export type StoryData = z.infer<typeof storyDataSchema>;
export type StoryInfo = z.infer<typeof storyInfoSchema>;
export type StoryInput = z.infer<typeof storyInputSchema>;
