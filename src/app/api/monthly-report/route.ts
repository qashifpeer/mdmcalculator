// src/app/api/monthly-report/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type MonthlyReportReq = {
  year: number;   // e.g. 2025
  month: number;  // 1-12
};

type MealsEntry = {
  date: string;
  prePrimary?: number;
  primary?: number;
  middle?: number;
};

type IncomeRow = {
  date: string;
  prePrimaryAmount?: number;
  primaryAmount?: number;
  middleAmount?: number;
};

type RiceRow = {
  date: string;
  prePrimaryQty?: number;
  primaryQty?: number;
  middleQty?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MonthlyReportReq;
    const { year, month } = body;

    if (!year || !month) {
      return NextResponse.json(
        { success: false, error: 'year and month are required' },
        { status: 400 }
      );
    }

    // Current month range
    const fromDate = new Date(year, month - 1, 1);
    const toDate = new Date(year, month, 0);
    const from = fromDate.toISOString().slice(0, 10);
    const to = toDate.toISOString().slice(0, 10);

    // Previous month end
    const prevMonthEnd = new Date(year, month - 1, 0);
    const prevTo = prevMonthEnd.toISOString().slice(0, 10);

    // ---------- Rates (latest) ----------
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

    // ---------- Meals current month ----------
    const meals: MealsEntry[] = await sanityClient.fetch(
      `*[
        _type == "mealsEntry" &&
        date >= $from &&
        date <= $to
      ] | order(date asc){
        date,
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

    // Rice consumed from meals (current month) – kg
    const riceConsumedPre = totPreMeals * 0.1;   // 100g
    const riceConsumedPri = totPriMeals * 0.1;
    const riceConsumedMid = totMidMeals * 0.15;  // 150g
    const totalRiceConsumedCurrent =
      riceConsumedPre + riceConsumedPri + riceConsumedMid;

    // Expenditure from meals & rates (current month)
    const expPre = totPreMeals * preRate;
    const expPri = totPriMeals * priRate;
    const expMid = totMidMeals * midRate;
    const totalExpenditureCurrent = expPre + expPri + expMid;

    // ---------- Income current month (per section) ----------
    const incomesCurrent: IncomeRow[] = await sanityClient.fetch(
      `*[
        _type == "incomeReceived" &&
        date >= $from &&
        date <= $to
      ]{
        date,
        prePrimaryAmount,
        primaryAmount,
        middleAmount
      }`,
      { from, to }
    );

    let incomePreCur = 0;
    let incomePriCur = 0;
    let incomeMidCur = 0;

    for (const inc of incomesCurrent) {
      incomePreCur += inc.prePrimaryAmount || 0;
      incomePriCur += inc.primaryAmount || 0;
      incomeMidCur += inc.middleAmount || 0;
    }

    const totalIncomeCurrent =
      incomePreCur + incomePriCur + incomeMidCur;

    // ---------- Rice received current month (per section) ----------
    const riceCurrent: RiceRow[] = await sanityClient.fetch(
      `*[
        _type == "riceReceived" &&
        date >= $from &&
        date <= $to
      ]{
        date,
        prePrimaryQty,
        primaryQty,
        middleQty
      }`,
      { from, to }
    );

    let ricePreCur = 0;
    let ricePriCur = 0;
    let riceMidCur = 0;

    for (const r of riceCurrent) {
      ricePreCur += r.prePrimaryQty || 0;
      ricePriCur += r.primaryQty || 0;
      riceMidCur += r.middleQty || 0;
    }

    const totalRiceLiftedCurrent = ricePreCur + ricePriCur + riceMidCur;

    // ---------- Previous period (for opening balances) ----------

    // Income up to previous month (per section)
    const incomesPrev: IncomeRow[] = await sanityClient.fetch(
      `*[
        _type == "incomeReceived" &&
        date <= $prevTo
      ]{
        prePrimaryAmount,
        primaryAmount,
        middleAmount
      }`,
      { prevTo }
    );

    let incomePrePrev = 0;
    let incomePriPrev = 0;
    let incomeMidPrev = 0;

    for (const inc of incomesPrev) {
      incomePrePrev += inc.prePrimaryAmount || 0;
      incomePriPrev += inc.primaryAmount || 0;
      incomeMidPrev += inc.middleAmount || 0;
    }

    const totalIncomePrev =
      incomePrePrev + incomePriPrev + incomeMidPrev;

    // Meals up to previous month
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

    // Rice received up to previous month (per section)
    const ricePrev: RiceRow[] = await sanityClient.fetch(
      `*[
        _type == "riceReceived" &&
        date <= $prevTo
      ]{
        prePrimaryQty,
        primaryQty,
        middleQty
      }`,
      { prevTo }
    );

    let ricePrePrev = 0;
    let ricePriPrev = 0;
    let riceMidPrev = 0;

    for (const r of ricePrev) {
      ricePrePrev += r.prePrimaryQty || 0;
      ricePriPrev += r.primaryQty || 0;
      riceMidPrev += r.middleQty || 0;
    }

    const totalRiceReceivedPrev = ricePrePrev + ricePriPrev + riceMidPrev;

    // ---------- Opening/closing balances (totals) ----------
    const openingAmountBalance =
      totalIncomePrev - totalExpenditurePrev;
    const closingAmountBalance =
      openingAmountBalance +
      totalIncomeCurrent -
      totalExpenditureCurrent;

    const openingRiceBalance =
      totalRiceReceivedPrev - totalRiceConsumedPrev;
    const closingRiceBalance =
      openingRiceBalance +
      totalRiceLiftedCurrent -
      totalRiceConsumedCurrent;

    const totalRiceAvailableCurrent =
      openingRiceBalance + totalRiceLiftedCurrent;

    // ---------- Per-section money balances ----------
    const openAmtPre = incomePrePrev - prevExpPre;
    const openAmtPri = incomePriPrev - prevExpPri;
    const openAmtMid = incomeMidPrev - prevExpMid;

    const availAmtPre = openAmtPre + incomePreCur;
    const availAmtPri = openAmtPri + incomePriCur;
    const availAmtMid = openAmtMid + incomeMidCur;

    const closeAmtPre = availAmtPre - expPre;
    const closeAmtPri = availAmtPri - expPri;
    const closeAmtMid = availAmtMid - expMid;

    // ---------- Per-section rice balances ----------
    const openRicePre = ricePrePrev - prevRiceConsumedPre;
    const openRicePri = ricePriPrev - prevRiceConsumedPri;
    const openRiceMid = riceMidPrev - prevRiceConsumedMid;

    const availRicePre = openRicePre + ricePreCur;
    const availRicePri = openRicePri + ricePriCur;
    const availRiceMid = openRiceMid + riceMidCur;

    const closeRicePre = availRicePre - riceConsumedPre;
    const closeRicePri = availRicePri - riceConsumedPri;
    const closeRiceMid = availRiceMid - riceConsumedMid;

    return NextResponse.json({
      success: true,
      month,
      year,
      meals,
      totals: {
        meals: {
          prePrimary: totPreMeals,
          primary: totPriMeals,
          middle: totMidMeals,
          all: totalMealsAll,
        },
        income: {
          totalReceivedAmountCurrent: totalIncomeCurrent,
          openingAmountBalance,
          closingAmountBalance,
        },
        expenditure: {
          prePrimary: expPre,
          primary: expPri,
          middle: expMid,
          totalExpenditureCurrent,
        },
        rice: {
          totalRiceLiftedCurrent,
          totalRiceConsumedCurrent,
          openingRiceBalance,
          closingRiceBalance,
          totalRiceAvailableCurrent,
          riceConsumedPre,
          riceConsumedPri,
          riceConsumedMid,
        },
        sectionMoney: {
          prePrimary: {
            opening: openAmtPre,
            income: incomePreCur,
            available: availAmtPre,
            expenditure: expPre,
            closing: closeAmtPre,
          },
          primary: {
            opening: openAmtPri,
            income: incomePriCur,
            available: availAmtPri,
            expenditure: expPri,
            closing: closeAmtPri,
          },
          middle: {
            opening: openAmtMid,
            income: incomeMidCur,
            available: availAmtMid,
            expenditure: expMid,
            closing: closeAmtMid,
          },
        },
        sectionRice: {
          prePrimary: {
            opening: openRicePre,
            lifted: ricePreCur,
            available: availRicePre,
            consumed: riceConsumedPre,
            closing: closeRicePre,
          },
          primary: {
            opening: openRicePri,
            lifted: ricePriCur,
            available: availRicePri,
            consumed: riceConsumedPri,
            closing: closeRicePri,
          },
          middle: {
            opening: openRiceMid,
            lifted: riceMidCur,
            available: availRiceMid,
            consumed: riceConsumedMid,
            closing: closeRiceMid,
          },
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
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
