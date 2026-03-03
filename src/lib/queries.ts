// src/lib/queries.ts
export const mealsSummaryQuery = `
  *[
    _type == "mealsEntry" &&
    date >= $from &&
    date <= $to
  ]{
    prePrimary,
    primary,
    middle
  }
`;
