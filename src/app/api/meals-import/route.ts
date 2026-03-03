// src/app/api/meals-import/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type MealRow = {
  date: string;
  prePrimary: number;
  primary: number;
  middle: number;
};

type ImportPayload = {
  rows: MealRow[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ImportPayload;

    if (!Array.isArray(body.rows) || body.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No rows provided' },
        { status: 400 }
      );
    }

    const docs = body.rows.map((row) => {
      const date = String(row.date).slice(0, 10);
      return {
        _type: 'mealsEntry',
        // _id: `meals-${date}`, // optional deterministic id
        date,
        prePrimary: Number(row.prePrimary) || 0,
        primary: Number(row.primary) || 0,
        middle: Number(row.middle) || 0,
      };
    });

    const tx = sanityClient.transaction();
    docs.forEach((doc) => tx.create(doc));
    await tx.commit();

    // Use docs.length instead of result.length
    return NextResponse.json({ success: true, count: docs.length });
  } catch (err: unknown) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : 'Import failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
