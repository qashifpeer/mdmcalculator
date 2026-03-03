// src/app/api/rice-received/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type RicePayload = {
  date: string;        // YYYY-MM-DD
  prePrimaryQty: number;
  primaryQty: number;
  middleQty: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RicePayload;

    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'date is required' },
        { status: 400 }
      );
    }

    const date = body.date;
    const prePrimaryQty = Number(body.prePrimaryQty) || 0;
    const primaryQty = Number(body.primaryQty) || 0;
    const middleQty = Number(body.middleQty) || 0;

    const created = await sanityClient.create({
      _type: 'riceReceived',
      date,
      prePrimaryQty,
      primaryQty,
      middleQty,
    });

    return NextResponse.json({ success: true, id: created._id });
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : 'Failed to save rice';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
