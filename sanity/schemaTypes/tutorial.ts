import { defineField, defineType } from 'sanity';

export const tutorialType = defineType({
  name: 'tutorial',
  title: 'Tutorial',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'reference',
      to: [{ type: 'topic' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
      initialValue: 'beginner',
    }),
    defineField({ name: 'content', title: 'Content', type: 'text', description: 'Full tutorial content in markdown' }),
    defineField({
      name: 'codeExamples',
      title: 'Code Examples',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'codeSnippet',
          title: 'Code Snippet',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'language', title: 'Language', type: 'string', initialValue: 'typescript' }),
            defineField({ name: 'code', title: 'Code', type: 'text' }),
            defineField({ name: 'explanation', title: 'Explanation', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'lastVerified', title: 'Last Verified', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'difficulty' },
  },
});
