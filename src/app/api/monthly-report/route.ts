// src/app/api/monthly-report/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

// ---------- Types ----------

type MonthlyReportReq = {
  year: number;
  month: number; // 1-12
};

type MealsEntry = {
  date: string;
  prePrimary?: number;
  primary?: number;
  middle?: number;
};

type IncomeRow = {
  date?: string;
  prePrimaryAmount?: number;
  primaryAmount?: number;
  middleAmount?: number;
};

type RiceRow = {
  date?: string;
  prePrimaryQty?: number;
  primaryQty?: number;
  middleQty?: number;
};

type SectionTriplet = {
  prePrimary: number;
  primary: number;
  middle: number;
};

// ---------- Date helpers (local, no UTC shift) ----------

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthRange(year: number, month: number) {
  const fromDate = new Date(year, month - 1, 1);
  const toDate = new Date(year, month, 0);

  return {
    from: formatLocalDate(fromDate),
    to: formatLocalDate(toDate),
  };
}

function getPreviousMonthEnd(year: number, month: number) {
  return formatLocalDate(new Date(year, month - 1, 0));
}

function getFinancialYearStart(year: number, month: number) {
  const fyStartYear = month >= 4 ? year : year - 1;
  return formatLocalDate(new Date(fyStartYear, 3, 1)); // 1 April
}

// ---------- Sum helpers ----------

function sumMeals(rows: MealsEntry[]): SectionTriplet {
  return rows.reduce<SectionTriplet>(
    (acc, row) => ({
      prePrimary: acc.prePrimary + (row.prePrimary || 0),
      primary: acc.primary + (row.primary || 0),
      middle: acc.middle + (row.middle || 0),
    }),
    { prePrimary: 0, primary: 0, middle: 0 }
  );
}

function sumIncome(rows: IncomeRow[]): SectionTriplet {
  return rows.reduce<SectionTriplet>(
    (acc, row) => ({
      prePrimary: acc.prePrimary + (row.prePrimaryAmount || 0),
      primary: acc.primary + (row.primaryAmount || 0),
      middle: acc.middle + (row.middleAmount || 0),
    }),
    { prePrimary: 0, primary: 0, middle: 0 }
  );
}

function sumRice(rows: RiceRow[]): SectionTriplet {
  return rows.reduce<SectionTriplet>(
    (acc, row) => ({
      prePrimary: acc.prePrimary + (row.prePrimaryQty || 0),
      primary: acc.primary + (row.primaryQty || 0),
      middle: acc.middle + (row.middleQty || 0),
    }),
    { prePrimary: 0, primary: 0, middle: 0 }
  );
}

function getRiceConsumedFromMeals(meals: SectionTriplet): SectionTriplet {
  return {
    prePrimary: meals.prePrimary * 0.1,
    primary: meals.primary * 0.1,
    middle: meals.middle * 0.15,
  };
}

function getExpenditureFromMeals(
  meals: SectionTriplet,
  rates: SectionTriplet
): SectionTriplet {
  return {
    prePrimary: meals.prePrimary * rates.prePrimary,
    primary: meals.primary * rates.primary,
    middle: meals.middle * rates.middle,
  };
}

function getSectionTotal(values: SectionTriplet) {
  return values.prePrimary + values.primary + values.middle;
}

// ---------- Sanity fetch helpers ----------

async function fetchRates(): Promise<SectionTriplet> {
  const rates = await sanityClient.fetch(
    `*[_type == "inputRates"] | order(_createdAt desc)[0]{
      prePrimaryRate,
      primaryRate,
      middleRate
    }`
  );

  return {
    prePrimary: rates?.prePrimaryRate ?? 0,
    primary: rates?.primaryRate ?? 0,
    middle: rates?.middleRate ?? 0,
  };
}

async function fetchMeals(from: string, to: string): Promise<MealsEntry[]> {
  return sanityClient.fetch(
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
}

async function fetchMealsUpto(to: string): Promise<MealsEntry[]> {
  return sanityClient.fetch(
    `*[
      _type == "mealsEntry" &&
      date <= $to
    ] | order(date asc){
      date,
      prePrimary,
      primary,
      middle
    }`,
    { to }
  );
}

async function fetchIncome(from: string, to: string): Promise<IncomeRow[]> {
  return sanityClient.fetch(
    `*[
      _type == "incomeReceived" &&
      date >= $from &&
      date <= $to
    ] | order(date asc){
      date,
      prePrimaryAmount,
      primaryAmount,
      middleAmount
    }`,
    { from, to }
  );
}


async function fetchRice(from: string, to: string): Promise<RiceRow[]> {
  return sanityClient.fetch(
    `*[
      _type == "riceReceived" &&
      date >= $from &&
      date <= $to
    ] | order(date asc){
      date,
      prePrimaryQty,
      primaryQty,
      middleQty
    }`,
    { from, to }
  );
}

async function fetchRiceUpto(to: string): Promise<RiceRow[]> {
  return sanityClient.fetch(
    `*[
      _type == "riceReceived" &&
      date <= $to
    ] | order(date asc){
      date,
      prePrimaryQty,
      primaryQty,
      middleQty
    }`,
    { to }
  );
}

// ---------- Main handler ----------

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MonthlyReportReq;
    const year = Number(body.year);
    const month = Number(body.month);

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json(
        { success: false, error: 'Valid year and month (1-12) are required' },
        { status: 400 }
      );
    }

    const { from, to } = getMonthRange(year, month);
    const prevTo = getPreviousMonthEnd(year, month);
    const fyStart = getFinancialYearStart(year, month);
    const isApril = month === 4;

    const rates = await fetchRates();

    // ---------- Current month data ----------
    const [meals, incomesCurrentRows, riceCurrentRows] = await Promise.all([
      fetchMeals(from, to),
      fetchIncome(from, to),
      fetchRice(from, to),
    ]);

    const currentMeals = sumMeals(meals);
    const currentIncome = sumIncome(incomesCurrentRows);
    const currentRiceLifted = sumRice(riceCurrentRows);

    const currentRiceConsumed = getRiceConsumedFromMeals(currentMeals);
    const currentExpenditure = getExpenditureFromMeals(currentMeals, rates);

    const totalMealsAll = getSectionTotal(currentMeals);
    const totalIncomeCurrent = getSectionTotal(currentIncome);
    const totalRiceLiftedCurrent = getSectionTotal(currentRiceLifted);
    const totalRiceConsumedCurrent = getSectionTotal(currentRiceConsumed);
    const totalExpenditureCurrent = getSectionTotal(currentExpenditure);

    // ---------- Previous period MONEY (reset each FY) ----------
    let previousIncome: SectionTriplet = {
      prePrimary: 0,
      primary: 0,
      middle: 0,
    };

    let previousMealsForMoney: SectionTriplet = {
      prePrimary: 0,
      primary: 0,
      middle: 0,
    };

    if (!isApril) {
      const [incomesPrevRows, mealsPrevRowsForMoney] = await Promise.all([
        fetchIncome(fyStart, prevTo),
        fetchMeals(fyStart, prevTo),
      ]);

      previousIncome = sumIncome(incomesPrevRows);
      previousMealsForMoney = sumMeals(mealsPrevRowsForMoney);
    }

    const previousExpenditure = getExpenditureFromMeals(
      previousMealsForMoney,
      rates
    );

    const totalIncomePrev = getSectionTotal(previousIncome);
    const totalExpenditurePrev = getSectionTotal(previousExpenditure);

    // ---------- Previous period RICE (carry from all past years) ----------
    const [mealsPrevRowsForRice, ricePrevRows] = await Promise.all([
      fetchMealsUpto(prevTo),
      fetchRiceUpto(prevTo),
    ]);

    const previousMealsForRice = sumMeals(mealsPrevRowsForRice);
    const previousRiceReceived = sumRice(ricePrevRows);
    const previousRiceConsumed =
      getRiceConsumedFromMeals(previousMealsForRice);

    const totalRiceReceivedPrev = getSectionTotal(previousRiceReceived);
    const totalRiceConsumedPrev = getSectionTotal(previousRiceConsumed);

    // ---------- Opening and closing balances (totals) ----------
    const openingAmountBalance = totalIncomePrev - totalExpenditurePrev;
    const closingAmountBalance =
      openingAmountBalance + totalIncomeCurrent - totalExpenditureCurrent;

    const openingRiceBalance = totalRiceReceivedPrev - totalRiceConsumedPrev;
    const totalRiceAvailableCurrent =
      openingRiceBalance + totalRiceLiftedCurrent;
    const closingRiceBalance =
      totalRiceAvailableCurrent - totalRiceConsumedCurrent;

    // ---------- Section-wise money ----------
    const openAmtPre =
      previousIncome.prePrimary - previousExpenditure.prePrimary;
    const openAmtPri =
      previousIncome.primary - previousExpenditure.primary;
    const openAmtMid =
      previousIncome.middle - previousExpenditure.middle;

    const availAmtPre = openAmtPre + currentIncome.prePrimary;
    const availAmtPri = openAmtPri + currentIncome.primary;
    const availAmtMid = openAmtMid + currentIncome.middle;

    const closeAmtPre = availAmtPre - currentExpenditure.prePrimary;
    const closeAmtPri = availAmtPri - currentExpenditure.primary;
    const closeAmtMid = availAmtMid - currentExpenditure.middle;

    // ---------- Section-wise rice ----------
    const openRicePre =
      previousRiceReceived.prePrimary - previousRiceConsumed.prePrimary;
    const openRicePri =
      previousRiceReceived.primary - previousRiceConsumed.primary;
    const openRiceMid =
      previousRiceReceived.middle - previousRiceConsumed.middle;

    const availRicePre = openRicePre + currentRiceLifted.prePrimary;
    const availRicePri = openRicePri + currentRiceLifted.primary;
    const availRiceMid = openRiceMid + currentRiceLifted.middle;

    const closeRicePre = availRicePre - currentRiceConsumed.prePrimary;
    const closeRicePri = availRicePri - currentRiceConsumed.primary;
    const closeRiceMid = availRiceMid - currentRiceConsumed.middle;

    return NextResponse.json({
      success: true,
      month,
      year,
      financialYearStart: fyStart,
      meals,
      totals: {
        meals: {
          prePrimary: currentMeals.prePrimary,
          primary: currentMeals.primary,
          middle: currentMeals.middle,
          all: totalMealsAll,
        },
        income: {
          totalReceivedAmountCurrent: totalIncomeCurrent,
          openingAmountBalance,
          closingAmountBalance,
        },
        expenditure: {
          prePrimary: currentExpenditure.prePrimary,
          primary: currentExpenditure.primary,
          middle: currentExpenditure.middle,
          totalExpenditureCurrent,
        },
        rice: {
          totalRiceLiftedCurrent,
          totalRiceConsumedCurrent,
          openingRiceBalance,
          closingRiceBalance,
          totalRiceAvailableCurrent,
          riceConsumedPre: currentRiceConsumed.prePrimary,
          riceConsumedPri: currentRiceConsumed.primary,
          riceConsumedMid: currentRiceConsumed.middle,
        },
        sectionMoney: {
          prePrimary: {
            opening: openAmtPre,
            income: currentIncome.prePrimary,
            available: availAmtPre,
            expenditure: currentExpenditure.prePrimary,
            closing: closeAmtPre,
          },
          primary: {
            opening: openAmtPri,
            income: currentIncome.primary,
            available: availAmtPri,
            expenditure: currentExpenditure.primary,
            closing: closeAmtPri,
          },
          middle: {
            opening: openAmtMid,
            income: currentIncome.middle,
            available: availAmtMid,
            expenditure: currentExpenditure.middle,
            closing: closeAmtMid,
          },
        },
        sectionRice: {
          prePrimary: {
            opening: openRicePre,
            lifted: currentRiceLifted.prePrimary,
            available: availRicePre,
            consumed: currentRiceConsumed.prePrimary,
            closing: closeRicePre,
          },
          primary: {
            opening: openRicePri,
            lifted: currentRiceLifted.primary,
            available: availRicePri,
            consumed: currentRiceConsumed.primary,
            closing: closeRicePri,
          },
          middle: {
            opening: openRiceMid,
            lifted: currentRiceLifted.middle,
            available: availRiceMid,
            consumed: currentRiceConsumed.middle,
            closing: closeRiceMid,
          },
        },
        rates: {
          prePrimaryRate: rates.prePrimary,
          primaryRate: rates.primary,
          middleRate: rates.middle,
        },
      },
    });
  } catch (error) {
    console.error('Monthly report generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}