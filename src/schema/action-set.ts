import { z } from 'zod';

import { createStoryInputSchema, storyInputSchema } from './story';

export const storyActionSchema = z.object({
  args: z.record(z.string(), z.unknown()).optional(),
  id: z.string(),
  labe: z.string().optional(),
  name: z.string(),
  subtitleItems: z.array(z.string()).optional(),
});

export const actionSetSchema = z.object({
  actions: z.array(storyActionSchema),
  id: z.string(),
  temp: z.boolean().optional(),
  title: z.string(),
});

export const favouriteActionSetSchema = actionSetSchema.extend({
  visibleTo: z.string().optional(),
});

export const getActionSetInputSchema = storyInputSchema;

export const deleteActionSetInputSchema = createStoryInputSchema({
  actionSetId: z.string(),
});

export const saveActionSetInputSchema = createStoryInputSchema({
  actionSet: actionSetSchema,
});

export const changeActionSetIndexInputSchema = createStoryInputSchema({
  newIndex: z.number().int().nonnegative(),
  oldIndex: z.number().int().nonnegative(),
});

export type StoryActionInput = z.infer<typeof storyActionSchema>;
export type ActionSetInput = z.infer<typeof actionSetSchema>;
export type FavouriteActionSetInput = z.infer<typeof favouriteActionSetSchema>;
export type GetActionSetInput = z.infer<typeof getActionSetInputSchema>;
export type DeleteActionSetInput = z.infer<typeof deleteActionSetInputSchema>;
export type SaveActionSetInput = z.infer<typeof saveActionSetInputSchema>;
export type ChangeActionSetIndexInput = z.infer<
  typeof changeActionSetIndexInputSchema
>;
