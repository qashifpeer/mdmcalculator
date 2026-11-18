// sanity/schemaTypes/inputRates.ts
import { defineField, defineType } from 'sanity';

export const inputRates = defineType({
  name: 'inputRates',
  title: 'Input Rates',
  type: 'document',
  fields: [
    defineField({
      name: 'prePrimaryRate',
      title: 'Pre-primary rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primaryRate',
      title: 'Primary rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middleRate',
      title: 'Middle rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'prePrimaryRice',
      title: 'Pre-primary rice rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'primaryRice',
      title: 'Primary rice rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'middleRice',
      title: 'Middle rice rate',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
});