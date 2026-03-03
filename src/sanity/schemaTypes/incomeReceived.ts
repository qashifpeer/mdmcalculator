// sanity/schemaTypes/incomeReceived.ts
import { defineField, defineType } from 'sanity';

export const incomeReceived = defineType({
  name: 'incomeReceived',
  title: 'Income Received',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prePrimaryAmount',
      title: 'Pre-primary amount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primaryAmount',
      title: 'Primary amount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middleAmount',
      title: 'Middle amount',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
});
