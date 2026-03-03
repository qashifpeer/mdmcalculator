// src/app/api/income-report/route.ts
import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';

type IncomeReportReq = {
  from: string;
  to: string;
};

type IncomeRow = {
  _id: string;
  date: string;
  prePrimaryAmount?: number;
  primaryAmount?: number;
  middleAmount?: number;
};

type RiceRow = {
  _id: string;
  date: string;
  prePrimaryQty?: number;
  primaryQty?: number;
  middleQty?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as IncomeReportReq;
    const { from, to } = body;

    if (!from || !to) {
      return NextResponse.json(
        { success: false, error: 'from and to are required' },
        { status: 400 }
      );
    }

    // Income rows with per-section fields
    const incomes: IncomeRow[] = await sanityClient.fetch(
      `*[
        _type == "incomeReceived" &&
        date >= $from &&
        date <= $to
      ] | order(date asc){
        _id,
        date,
        prePrimaryAmount,
        primaryAmount,
        middleAmount
      }`,
      { from, to }
    );

    // Derive total per row and grand total
    const incomeRowsWithTotal = incomes.map((row) => {
      const total =
        (row.prePrimaryAmount || 0) +
        (row.primaryAmount || 0) +
        (row.middleAmount || 0);
      return { ...row, total };
    });

    let totalIncome = 0;
    for (const row of incomeRowsWithTotal) {
      totalIncome += row.total;
    }

    // Rice rows with per-section fields
    const rice: RiceRow[] = await sanityClient.fetch(
      `*[
        _type == "riceReceived" &&
        date >= $from &&
        date <= $to
      ] | order(date asc){
        _id,
        date,
        prePrimaryQty,
        primaryQty,
        middleQty
      }`,
      { from, to }
    );

    const riceRowsWithTotal = rice.map((row) => {
      const total =
        (row.prePrimaryQty || 0) +
        (row.primaryQty || 0) +
        (row.middleQty || 0);
      return { ...row, total };
    });

    let totalRice = 0;
    for (const row of riceRowsWithTotal) {
      totalRice += row.total;
    }

    return NextResponse.json({
      success: true,
      from,
      to,
      incomes: incomeRowsWithTotal,
      rice: riceRowsWithTotal,
      totals: {
        income: totalIncome,
        rice: totalRice,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to load income report' },
      { status: 500 }
    );
  }
}
