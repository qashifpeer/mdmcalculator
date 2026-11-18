// src/app/api/meals-entry/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

type InputRatesDoc = {
  prePrimaryRate?: number;
  primaryRate?: number;
  middleRate?: number;
  prePrimaryRice?: number;
  primaryRice?: number;
  middleRice?: number;
};

// Helper to fetch the latest inputRates record from Sanity
async function getLatestRates() {
  const rates = await sanityClient.fetch<InputRatesDoc | null>(
    `*[_type == "inputRates"] | order(_updatedAt desc)[0]{
      prePrimaryRate,
      primaryRate,
      middleRate,
      prePrimaryRice,
      primaryRice,
      middleRice
    }`
  );

  return {
    prePrimaryRate: Number(rates?.prePrimaryRate ?? 0),
    primaryRate: Number(rates?.primaryRate ?? 0),
    middleRate: Number(rates?.middleRate ?? 0),
    prePrimaryRice: Number(rates?.prePrimaryRice ?? 0),
    primaryRice: Number(rates?.primaryRice ?? 0),
    middleRice: Number(rates?.middleRice ?? 0),
  };
}

// GET /api/meals-entry?month=2026-11
export async function GET(req: NextRequest) {
  try {
    const month = req.nextUrl.searchParams.get('month');

    const query = month
      ? `*[_type == "mealsEntry" && date >= $start && date <= $end]{
          _id,
          date,
          prePrimary,
          primary,
          middle,
          prePrimaryRate,
          primaryRate,
          middleRate,
          prePrimaryRice,
          primaryRice,
          middleRice
        }`
      : `*[_type == "mealsEntry"]{
          _id,
          date,
          prePrimary,
          primary,
          middle,
          prePrimaryRate,
          primaryRate,
          middleRate,
          prePrimaryRice,
          primaryRice,
          middleRice
        }`;

    const params = month
      ? { start: `${month}-01`, end: `${month}-31` }
      : {};

    const entries = await sanityClient.fetch(query, params);

    return NextResponse.json({ success: true, entries });
  } catch (err: unknown) {
    console.error('GET /api/meals-entry error:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to fetch entries';
    return NextResponse.json(
      { success: false, error: errorMessage, entries: [] },
      { status: 500 }
    );
  }
}

// POST /api/meals-entry
export async function POST(req: NextRequest) {
  try {
    const { date, prePrimary, primary, middle } = await req.json();

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Date is required' },
        { status: 400 }
      );
    }

    const existing = await sanityClient.fetch(
      `*[_type == "mealsEntry" && date == $date][0]._id`,
      { date }
    );

    if (existing) {
      return NextResponse.json({
        success: false,
        reason: 'already_exists',
        id: existing,
      });
    }

    // Silently pull rates from inputRates
    const rates = await getLatestRates();

    const created = await sanityClient.create({
      _type: 'mealsEntry',
      date,
      prePrimary: Number(prePrimary),
      primary: Number(primary),
      middle: Number(middle),
      ...rates,
    });

    return NextResponse.json({ success: true, id: created._id });
  } catch (err: unknown) {
    console.error('POST /api/meals-entry error:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to create entry';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT /api/meals-entry
export async function PUT(req: NextRequest) {
  try {
    const { id, date, prePrimary, primary, middle } = await req.json();

    const docId =
      id ||
      (await sanityClient.fetch(
        `*[_type == "mealsEntry" && date == $date][0]._id`,
        { date }
      ));

    if (!docId) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    // Silently pull latest rates from inputRates on update as well
    const rates = await getLatestRates();

    await sanityClient
      .patch(docId)
      .set({
        prePrimary: Number(prePrimary),
        primary: Number(primary),
        middle: Number(middle),
        ...rates,
      })
      .commit();

    return NextResponse.json({ success: true, id: docId });
  } catch (err: unknown) {
    console.error('PUT /api/meals-entry error:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to update entry';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}