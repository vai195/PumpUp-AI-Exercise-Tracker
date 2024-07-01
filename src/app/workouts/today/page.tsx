import Exercise from "@/components/Exercise";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PumpUp - Today's Workout",
};

export default async function WorkoutsPage() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("UserID undefined");
  }

  const allExercises = await prisma.exercise.findMany({
    orderBy: { created_at: "desc" },
    where: { userId },
  });
  const currDate = new Date();

  const getTodaysExercises = allExercises.filter((x) => x.created_at.getDate() === currDate.getDate());
  

  return (
    <>
      <h1 className="text-lg font-bold mb-2 text-center">Today&apos;s Workout</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {getTodaysExercises.map((exercise) => (
          <Exercise exercise={exercise} key={exercise.id} />
        ))}
        {getTodaysExercises.length === 0 && (
          <Card className="col-span-full text-center">
            <CardHeader>
              <CardTitle>No Exercises Added</CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>
    </>
  );
}