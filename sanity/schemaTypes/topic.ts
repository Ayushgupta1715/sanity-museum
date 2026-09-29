import { defineField, defineType } from 'sanity';

export const topicType = defineType({
  name: 'topic',
  title: 'Topic',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'icon', title: 'Icon Emoji', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'color', title: 'Brand Color', type: 'string', description: 'Hex color e.g. #61DAFB' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'icon' },
    prepare({ title, subtitle }) {
      return { title: `${subtitle || ''} ${title}` };
    },
  },
});
