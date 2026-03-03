// src/app/api/input-rates/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type RatesPayload = {
  prePrimaryRate: number;
  primaryRate: number;
  middleRate: number;
};

const RATES_ID = 'inputRatesSingleton'; // fixed id

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RatesPayload;

    const prePrimaryRate = Number(body.prePrimaryRate) || 0;
    const primaryRate = Number(body.primaryRate) || 0;
    const middleRate = Number(body.middleRate) || 0;

    const doc = {
      _id: RATES_ID,
      _type: 'inputRates',
      prePrimaryRate,
      primaryRate,
      middleRate,
    };

     // This will create it first time, and overwrite on later calls
    const saved = await sanityClient.createOrReplace(doc);

    

    return NextResponse.json({ success: true, id: saved._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to save  rates' },
      { status: 500 }
    );
  }
}
