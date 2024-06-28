import { z } from "zod";
export const createExerciseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  completed: z.boolean().default(false),
  sets: z.coerce
    .number()
    .int()
    .positive({ message: "Valid Number is required" })
    .min(1, "Sets are required"),
  reps: z.coerce
    .number()
    .int()
    .positive({ message: "Valid Number is required" })
    .min(1, "Reps are required"),
  weight: z.coerce
    .number()
    .int()
    .positive({ message: "Valid Number is required" })
    .min(1, "Weight is required"),
});

export type CreateExerciseSchema = z.infer<typeof createExerciseSchema>;
