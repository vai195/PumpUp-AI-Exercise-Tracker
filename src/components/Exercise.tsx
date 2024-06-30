"use client";
import { Exercise as ExerciseModel } from "@prisma/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useState } from "react";
import AddExerciseDialog from "./ui/AddExerciseDialog";

interface ExerciseProps {
    exercise: ExerciseModel;
}

function Exercise({ exercise }: ExerciseProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);
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
    const formattedDateTimeCreated = formatter.format(exercise.created_at);

    return (
        <>
            <Card
                className='cursor-pointer transition-shadow hover:shadow-lg'
                onClick={() => setShowEditDialog(true)}>
                <CardHeader>
                    <CardTitle className='capitalize mb-4'>
                        {exercise.name}:{" "}
                        {exercise.completed ? "completed" : "incomplete"}
                    </CardTitle>

                    <CardContent className='flex flex-col gap-3 '>
                        <span className='font-semibold'>
                            Reps: {exercise.reps} Sets: {exercise.sets} Weight:{" "}
                            {exercise.weight}
                            lbs
                        </span>
                        <span>
                            {wasUpdated
                                ? "Updated: " + formattedDateTime
                                : formattedDateTime}
                        </span>
                        <span>
                            {wasUpdated ? "" + formattedDateTimeCreated : ""}
                        </span>
                    </CardContent>
                </CardHeader>
            </Card>
            <AddExerciseDialog
                open={showEditDialog}
                setOpen={setShowEditDialog}
                exerciseToEdit={exercise}
            />
        </>
    );
}

export default Exercise;
