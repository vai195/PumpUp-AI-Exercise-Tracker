import { Exercise as ExerciseModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface ExerciseProps {
  exercise: ExerciseModel;
}

function Exercise({ exercise }: ExerciseProps) {
  const wasUpdated = exercise.updated_at > exercise.created_at;
  const createdUpdatedAtTimestamp = wasUpdated
    ? exercise.updated_at
    : exercise.created_at;
  const formatter = new Intl.DateTimeFormat([], {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });

  // Format the date and time according to the user's preferences
  const formattedDateTime = formatter.format(createdUpdatedAtTimestamp);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{exercise.name}</CardTitle>
        <CardDescription></CardDescription>
        <CardContent className="flex flex-col gap-3">
          <span className="font-semibold">
            Reps: {exercise.reps} Sets: {exercise.sets} Weight:{" "}
            {exercise.weight}
            lbs
          </span>
          <span>{formattedDateTime}</span>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

export default Exercise;
