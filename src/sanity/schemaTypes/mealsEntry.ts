// sanity/schemaTypes/midDayMeal.ts
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
    defineField({
      name: 'prePrimaryRate',
      title: 'Pre-primary Rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primaryRate',
      title: 'Primary Rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middleRate',
      title: 'Middle Rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'prePrimaryRice',
      title: 'Pre-primary Rice',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primaryRice',
      title: 'Primary Rice',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middleRice',
      title: 'Middle Rice',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
});