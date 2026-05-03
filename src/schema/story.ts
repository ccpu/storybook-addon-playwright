import z from 'zod';

const storyLocatorShape = {
  fileName: z.string().optional(),
  filePath: z.string().optional(),
  storyId: z.string(),
};

export const storyInfoSchema = z.object({
  fileName: z.string().optional(),
  filePath: z.string(),
  storyId: z.string(),
});

export const createStoryInputSchema = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object({
      ...storyLocatorShape,
      ...shape,
    })
    .refine(
      (value) => {
        const story = value as { fileName?: string; filePath?: string };
        return Boolean(story.filePath || story.fileName);
      },
      {
        message: 'Either filePath or fileName must be provided',
      },
    )
    .transform((value) => {
      const story = value as { fileName?: string; filePath?: string };
      return {
        ...value,
        filePath: story.filePath ?? story.fileName!,
      };
    });

export const storyInputSchema = createStoryInputSchema({});

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
export type StoryInput = z.infer<typeof storyInputSchema>;
