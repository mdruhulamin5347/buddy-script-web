
import { z } from 'zod';

export const ZCreateFeed = z.object({
  content: z.string()
    .trim()
    .max(5000, "Feed content too long")
    .optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"])
    .default("PUBLIC")
});

export const ZUpdateFeed = z.object({
  content: z.string()
    .trim()
    .max(5000)
    .optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"])
    .optional()
});

export const ZCreateComment = z.object({
  feedId: z.string(),
  content: z.string().trim().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
  parentId: z.string().optional().nullable()
});

export const ZUpdateComment = z.object({
  content: z.string().trim().min(1, "Comment cannot be empty").max(2000, "Comment too long"),
});

export type TCreateFeed = z.infer<typeof ZCreateFeed>;
export type TUpdateFeed = z.infer<typeof ZUpdateFeed>;
export type TCreateComment = z.infer<typeof ZCreateComment>;
export type TUpdateComment = z.infer<typeof ZUpdateComment>;