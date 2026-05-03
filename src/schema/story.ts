import z from 'zod';

export const storyInfoSchema = z.object({
  fileName: z.string().optional(),
  filePath: z.string(),
  storyId: z.string(),
});

export const storyDataSchema = z.object({
  id: z.string(),
  importPath: z.string(),
  name: z.string(),
  parameters: z.object({
    fileName: z.string(),
  }),
  parent: z.string(),
});

export type StoryData = z.infer<typeof storyDataSchema>;
export type StoryInfo = z.infer<typeof storyInfoSchema>;
