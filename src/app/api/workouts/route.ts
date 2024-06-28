import prisma from "@/lib/db/prisma";
import { createExerciseSchema } from "@/lib/validation/workout";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const parseResult = createExerciseSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return NextResponse.json({ errors: "Invalid input" }, { status: 400 });
    }

    const { name, completed, reps, sets, weight } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        completed,
        reps,
        sets,
        weight,
        userId,
      },
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
