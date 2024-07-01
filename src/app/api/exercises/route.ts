import { exerciseIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createExerciseSchema,
  deleteExerciseSchema,
  updateExerciseSchema,
} from "@/lib/validation/workout";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    const x = new Date();

    const embedding = await getEmbeddingForExecise(
      name,
      completed,
      sets,
      reps,
      weight,
      x,
      x
    );

    const exercise = await prisma.$transaction(async (tx) => {
      const exercise = await tx.exercise.create({
        data: {
          name,
          completed,
          reps,
          sets,
          weight,
          userId,
        },
      });

      await exerciseIndex.upsert([
        {
          id: exercise.id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return exercise;
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parseResult = updateExerciseSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return NextResponse.json({ errors: "Invalid input" }, { status: 400 });
    }

    const { id, name, completed, reps, sets, weight } = parseResult.data;

    const exercise = await prisma.exercise.findUnique({ where: { id } });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const { userId } = auth();

    if (!userId || userId !== exercise.userId) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const x = new Date();

    const embedding = await getEmbeddingForExecise(
      name,
      completed,
      sets,
      reps,
      weight,
      exercise.created_at,
      x
    );

    const updatedExercise = await prisma.$transaction(async (tx) => {
      const updatedExercise = await tx.exercise.update({
        where: { id },
        data: {
          name,
          completed,
          reps,
          sets,
          weight,
        },
      });

      await exerciseIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);

      return updatedExercise;
    });

    return NextResponse.json(
      {
        updatedExercise,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parseResult = deleteExerciseSchema.safeParse(body);
    if (!parseResult.success) {
      console.error(parseResult.error);
      return NextResponse.json({ errors: "Invalid input" }, { status: 400 });
    }

    const { id } = parseResult.data;

    const exercise = await prisma.exercise.findUnique({ where: { id } });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const { userId } = auth();

    if (!userId || userId !== exercise.userId) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.exercise.delete({
        where: { id },
      });
      await exerciseIndex.deleteOne(id);
    });

    return NextResponse.json({ message: "Exercise deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function getEmbeddingForExecise(
  name: string,
  completed: boolean,
  sets: number,
  reps: number,
  weight: number,
  created_at: Date,
  updated_at: Date
) {
  return getEmbedding(
    name +
      "\n\n" +
      completed +
      "\n\n" +
      sets +
      "\n\n" +
      reps +
      "\n\n" +
      weight +
      "\n\n" +
      created_at +
      "\n\n" +
      updated_at
  );
}
