import { type SchemaTypeDefinition } from 'sanity'
import { mealsEntry } from './mealsEntry';
import { inputRates } from './inputRates';
import { incomeReceived } from './incomeReceived';
import { riceReceived } from './riceReceived';




export const schema: { types: SchemaTypeDefinition[] } = {
  types: [mealsEntry,inputRates,incomeReceived, riceReceived],
}
