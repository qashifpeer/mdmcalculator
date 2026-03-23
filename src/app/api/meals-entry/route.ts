import { NextResponse } from 'next/server';
import { sanityClient } from '@/sanity/client';
import { getServerSession } from "next-auth";  // ✅ Fixed import
import { authOptions } from "@/app/api/auth/[...nextauth]/route";  // ✅ Relative path (adjust if needed)

type MealPayload = {
  prePrimary: number;
  primary: number;
  middle: number;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);  // ✅ No req/res args
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as MealPayload;

    // Basic validation
    const prePrimary = Number(body.prePrimary) || 0;
    const primary = Number(body.primary) || 0;
    const middle = Number(body.middle) || 0;

    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

    // 1. check if today's entry already exists
    const existing = await sanityClient.fetch(
      `*[_type == "mealsEntry" && date == $date][0]{ _id }`,
      { date: isoDate }
    );

    if (existing?._id) {
      // Do NOT create; send back info so UI can show "already exists"
      return NextResponse.json({
        success: false,
        reason: 'already_exists',
        message: 'Meals entry for today already exists.',
        id: existing._id,
      });
    }

    const doc = {
      _type: 'mealsEntry',
      date: isoDate,
      prePrimary,
      primary,
      middle,
    };

    const created = await sanityClient.create(doc);

    return NextResponse.json({ success: true, id: created._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to save meal data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);  // ✅ Add this
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as MealPayload;

    const prePrimary = Number(body.prePrimary) || 0;
    const primary = Number(body.primary) || 0;
    const middle = Number(body.middle) || 0;

    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10);

    const existing = await sanityClient.fetch(
      `*[_type == "mealsEntry" && date == $date][0]{ _id }`,
      { date: isoDate }
    );

    if (!existing?._id) {
      return NextResponse.json(
        {
          success: false,
          error: 'No meals entry for today to update.',
        },
        { status: 404 }
      );
    }

    const updated = await sanityClient
      .patch(existing._id)
      .set({ prePrimary, primary, middle })  // ✅ Good Sanity pattern
      .commit();

    return NextResponse.json({ success: true, id: updated._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to update meal data' },
      { status: 500 }
    );
  }
}