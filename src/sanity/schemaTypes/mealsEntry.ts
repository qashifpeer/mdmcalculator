// sanity/schemaTypes/midDayMeal.ts (path may differ slightly)
import { defineField, defineType } from 'sanity';

export const mealsEntry = defineType({
  name: 'mealsEntry',
  title: 'Meals Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
    }),
    defineField({
      name: 'prePrimary',
      title: 'Pre-primary',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primary',
      title: 'Primary',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middle',
      title: 'Middle',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
});
