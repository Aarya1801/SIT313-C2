import { z } from 'zod'

const titleSchema = z
  .string()
  .trim()
  .min(1, 'Enter a title')
  .min(5, 'Title must be at least 5 characters')
  .max(120, 'Title must be no more than 120 characters')

const tagSchema = z
  .string()
  .trim()
  .min(1, 'Tags cannot be empty')
  .max(30, 'Each tag must be no more than 30 characters')

const tagsSchema = z
  .array(tagSchema)
  .max(3, 'Add no more than 3 tags')
  .refine(
    (tags) => new Set(tags.map((tag) => tag.toLowerCase())).size === tags.length,
    'Tags must be unique',
  )

export const questionPostSchema = z.object({
  title: titleSchema,
  description: z
    .string()
    .trim()
    .min(1, 'Describe your problem')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be no more than 2000 characters'),
  tags: tagsSchema,
})

export const articlePostSchema = z.object({
  title: titleSchema,
  abstract: z
    .string()
    .trim()
    .min(1, 'Enter an abstract')
    .min(10, 'Abstract must be at least 10 characters')
    .max(500, 'Abstract must be no more than 500 characters'),
  articleText: z
    .string()
    .trim()
    .min(1, 'Enter the article text')
    .min(20, 'Article text must be at least 20 characters')
    .max(5000, 'Article text must be no more than 5000 characters'),
  tags: tagsSchema,
})
