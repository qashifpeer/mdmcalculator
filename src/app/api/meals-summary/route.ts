// src/app/api/meals-summary/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';
import { mealsSummaryQuery } from '@/lib/queries';

type MealsSummaryReq = {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MealsSummaryReq;

    if (!body.from || !body.to) {
      return NextResponse.json(
        { success: false, error: 'from and to are required' },
        { status: 400 }
      );
    }

    const results: { prePrimary?: number; primary?: number; middle?: number }[] =
      await sanityClient.fetch(mealsSummaryQuery, {
        from: body.from,
        to: body.to,
      });

    let totalPrePrimary = 0;
    let totalPrimary = 0;
    let totalMiddle = 0;

    for (const doc of results) {
      totalPrePrimary += doc.prePrimary || 0;
      totalPrimary += doc.primary || 0;
      totalMiddle += doc.middle || 0;
    }

    return NextResponse.json({
      success: true,
      from: body.from,
      to: body.to,
      totals: {
        prePrimary: totalPrePrimary,
        primary: totalPrimary,
        middle: totalMiddle,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to get summary' },
      { status: 500 }
    );
  }
}
