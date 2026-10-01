import { defineField, defineType } from 'sanity';
import { ExhibitControl } from '../components/ExhibitControl';

export const exhibitType = defineType({
  name: 'exhibit',
  title: 'Living Exhibit',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'era',
      title: 'Era',
      type: 'string',
    }),
    defineField({
      name: 'creator',
      title: 'Creator',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Exhibit Image',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Invention', value: 'invention' },
          { title: 'Art', value: 'art' },
          { title: 'History', value: 'history' },
          { title: 'Future', value: 'future' },
        ],
      }
    }),
    defineField({
      name: 'popularity',
      title: 'Popularity (Visitors)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'control',
      title: 'Museum Control',
      type: 'object',
      components: {
        input: ExhibitControl
      },
      fields: [
        { name: 'x', type: 'number', initialValue: 0 },
        { name: 'y', type: 'number', initialValue: 0 },
        { name: 'z', type: 'number', initialValue: 0 },
        { name: 'rotation', type: 'number', initialValue: 0 },
        { name: 'vitality', type: 'number', initialValue: 100 },
        { name: 'lifecycle', type: 'string', initialValue: 'ACTIVE' },
      ],
      initialValue: {
        x: 0, y: 0, z: 0, rotation: 0, vitality: 100, lifecycle: 'ACTIVE'
      }
    }),
    defineField({
      name: 'workflowState',
      title: 'Workflow State',
      type: 'string',
      options: {
        list: [
          { title: 'New Exhibit', value: 'NEW' },
          { title: 'AI Research', value: 'RESEARCH' },
          { title: 'Content Created', value: 'CONTENT' },
          { title: 'Fact Check', value: 'FACT_CHECK' },
          { title: 'Curator Review', value: 'REVIEW' },
          { title: 'Approved', value: 'APPROVED' },
          { title: 'Placed In Museum', value: 'PLACED' },
          { title: 'Live', value: 'LIVE' },
        ]
      },
      initialValue: 'NEW'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'workflowState'
    }
  }
})
