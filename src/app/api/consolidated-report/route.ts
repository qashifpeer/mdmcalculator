// src/app/api/consolidated-report/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type ConsolidatedReq = {
  from: string; // YYYY-MM-DD
  to: string;   // YYYY-MM-DD
};

type MealsEntry = {
  prePrimary?: number;
  primary?: number;
  middle?: number;
};

type IncomeDoc = {
  amount?: number;
};

type RiceDoc = {
  quantity?: number; // kg
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ConsolidatedReq;
    const { from, to } = body;

    if (!from || !to) {
      return NextResponse.json(
        { success: false, error: 'from and to are required' },
        { status: 400 }
      );
    }

    // Latest rates
    const rates = await sanityClient.fetch(
      `*[_type == "inputRates"] | order(_createdAt desc)[0]{
        prePrimaryRate,
        primaryRate,
        middleRate
      }`
    );

    const preRate = rates?.prePrimaryRate ?? 0;
    const priRate = rates?.primaryRate ?? 0;
    const midRate = rates?.middleRate ?? 0;

    // Meals in range
    const meals: MealsEntry[] = await sanityClient.fetch(
      `*[
        _type == "mealsEntry" &&
        date >= $from &&
        date <= $to
      ]{
        prePrimary,
        primary,
        middle
      }`,
      { from, to }
    );

    let totPreMeals = 0;
    let totPriMeals = 0;
    let totMidMeals = 0;

    for (const m of meals) {
      totPreMeals += m.prePrimary || 0;
      totPriMeals += m.primary || 0;
      totMidMeals += m.middle || 0;
    }

    const totalMealsAll = totPreMeals + totPriMeals + totMidMeals;

    // Rice consumed from meals (0.1kg, 0.1kg, 0.15kg)
    const riceConsumedPre = totPreMeals * 0.1;
    const riceConsumedPri = totPriMeals * 0.1;
    const riceConsumedMid = totMidMeals * 0.15;
    const totalRiceConsumed = riceConsumedPre + riceConsumedPri + riceConsumedMid;

    // Expenditure
    const expPre = totPreMeals * preRate;
    const expPri = totPriMeals * priRate;
    const expMid = totMidMeals * midRate;
    const totalExpenditure = expPre + expPri + expMid;

    // Income in range
    const incomes: IncomeDoc[] = await sanityClient.fetch(
      `*[
        _type == "incomeReceived" &&
        date >= $from &&
        date <= $to
      ]{
        amount
      }`,
      { from, to }
    );

    let totalReceivedAmount = 0;
    for (const inc of incomes) {
      totalReceivedAmount += inc.amount || 0;
    }

    // Rice received in range
    const riceDocs: RiceDoc[] = await sanityClient.fetch(
      `*[
        _type == "riceReceived" &&
        date >= $from &&
        date <= $to
      ]{
        quantity
      }`,
      { from, to }
    );

    let totalRiceLifted = 0;
    for (const r of riceDocs) {
      totalRiceLifted += r.quantity || 0;
    }

    // Opening balances up to "from" - 1 day
    const fromDate = new Date(from);
    const prevDay = new Date(fromDate.getTime() - 24 * 60 * 60 * 1000);
    const prevTo = prevDay.toISOString().slice(0, 10);

    const incomesPrev: IncomeDoc[] = await sanityClient.fetch(
      `*[
        _type == "incomeReceived" &&
        date <= $prevTo
      ]{
        amount
      }`,
      { prevTo }
    );

    let totalIncomePrev = 0;
    for (const inc of incomesPrev) {
      totalIncomePrev += inc.amount || 0;
    }

    const mealsPrev: MealsEntry[] = await sanityClient.fetch(
      `*[
        _type == "mealsEntry" &&
        date <= $prevTo
      ]{
        prePrimary,
        primary,
        middle
      }`,
      { prevTo }
    );

    let prevPreMeals = 0;
    let prevPriMeals = 0;
    let prevMidMeals = 0;

    for (const m of mealsPrev) {
      prevPreMeals += m.prePrimary || 0;
      prevPriMeals += m.primary || 0;
      prevMidMeals += m.middle || 0;
    }

    const prevRiceConsumedPre = prevPreMeals * 0.1;
    const prevRiceConsumedPri = prevPriMeals * 0.1;
    const prevRiceConsumedMid = prevMidMeals * 0.15;
    const totalRiceConsumedPrev =
      prevRiceConsumedPre + prevRiceConsumedPri + prevRiceConsumedMid;

    const prevExpPre = prevPreMeals * preRate;
    const prevExpPri = prevPriMeals * priRate;
    const prevExpMid = prevMidMeals * midRate;
    const totalExpenditurePrev = prevExpPre + prevExpPri + prevExpMid;

    const ricePrev: RiceDoc[] = await sanityClient.fetch(
      `*[
        _type == "riceReceived" &&
        date <= $prevTo
      ]{
        quantity
      }`,
      { prevTo }
    );

    let totalRiceReceivedPrev = 0;
    for (const r of ricePrev) {
      totalRiceReceivedPrev += r.quantity || 0;
    }

    const openingAmountBalance = totalIncomePrev - totalExpenditurePrev;
    const closingAmountBalance =
      openingAmountBalance + totalReceivedAmount - totalExpenditure;

    const openingRiceBalance =
      totalRiceReceivedPrev - totalRiceConsumedPrev;
    const closingRiceBalance =
      openingRiceBalance + totalRiceLifted - totalRiceConsumed;

    const totalRiceAvailable = openingRiceBalance + totalRiceLifted;
    const totalAvailableAmount = openingAmountBalance + totalReceivedAmount;

    return NextResponse.json({
      success: true,
      from,
      to,
      totals: {
        meals: {
          prePrimary: totPreMeals,
          primary: totPriMeals,
          middle: totMidMeals,
          all: totalMealsAll,
        },
        income: {
          openingAmountBalance,
          totalReceivedAmount,
          totalAvailableAmount,
          closingAmountBalance,
        },
        expenditure: {
          prePrimary: expPre,
          primary: expPri,
          middle: expMid,
          totalExpenditure,
        },
        rice: {
          openingRiceBalance,
          totalRiceLifted,
          totalRiceAvailable,
          totalRiceConsumed,
          closingRiceBalance,
        },
        rates: {
          prePrimaryRate: preRate,
          primaryRate: priRate,
          middleRate: midRate,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate consolidated report' },
      { status: 500 }
    );
  }
}
