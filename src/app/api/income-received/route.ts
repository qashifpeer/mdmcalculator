// src/app/api/income-received/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type IncomePayload = {
  date: string;            // YYYY-MM-DD
  prePrimaryAmount: number;
  primaryAmount: number;
  middleAmount: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IncomePayload;

    if (!body.date) {
      return NextResponse.json(
        { success: false, error: 'date is required' },
        { status: 400 }
      );
    }

    const date = body.date;
    const prePrimaryAmount = Number(body.prePrimaryAmount) || 0;
    const primaryAmount = Number(body.primaryAmount) || 0;
    const middleAmount = Number(body.middleAmount) || 0;

    const created = await sanityClient.create({
      _type: 'incomeReceived',
      date,
      prePrimaryAmount,
      primaryAmount,
      middleAmount,
    });

    return NextResponse.json({ success: true, id: created._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to save income' },
      { status: 500 }
    );
  }
}
