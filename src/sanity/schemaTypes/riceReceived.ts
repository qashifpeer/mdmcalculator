// sanity/schemaTypes/riceReceived.ts
import { defineField, defineType } from 'sanity';

export const riceReceived = defineType({
  name: 'riceReceived',
  title: 'Rice Received',
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
      name: 'prePrimaryQty',
      title: 'Pre-primary rice (kg)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primaryQty',
      title: 'Primary rice (kg)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middleQty',
      title: 'Middle rice (kg)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
});
