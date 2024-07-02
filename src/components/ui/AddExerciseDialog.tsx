import {
  CreateExerciseSchema,
  createExerciseSchema,
} from "@/lib/validation/workout";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import LoadingButton from "../loading-button";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { Exercise } from "@prisma/client";
interface AddExerciseDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  exerciseToEdit?: Exercise;
}

function AddExerciseDialog({
  open,
  setOpen,
  exerciseToEdit,
}: AddExerciseDialogProps) {
  const { toast } = useToast();
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreateExerciseSchema>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      name: exerciseToEdit?.name || "",
      completed: exerciseToEdit?.completed || false,
      weight: exerciseToEdit?.weight || 0,
      reps: exerciseToEdit?.reps || 0,
      sets: exerciseToEdit?.sets || 0,
    },
  });

  async function onSubmit(input: CreateExerciseSchema) {
    try {
      if (exerciseToEdit) {
        const response = await fetch(`/api/exercises`, {
          method: "PUT",
          body: JSON.stringify({
            id: exerciseToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) {
          throw new Error("Status code: " + response.status);
        }
        toast({
          title: "Exercise edited successfully!",
          description: "Your exercise has been edited.",
        });
      } else {
        const response = await fetch("/api/exercises", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw new Error("Status code: " + response.status);
        }
        toast({
          title: "Exercise added successfully!",
          description: "Your exercise has been added.",
        });
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Something went wrong please try again.",
      });
    }
  }

  async function deleteExercise() {
    if (!exerciseToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/exercises", {
        method: "DELETE",

        body: JSON.stringify({ id: exerciseToEdit.id }),
      });
      if (!response.ok) {
        throw new Error("Status code: " + response.status);
      }
      toast({
        title: "Exercise deleted successfully!",
        description: "Your exercise has been deleted.",
      });
      router.refresh();
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Something went wrong please try again.",
      });
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {exerciseToEdit ? "Edit Exercise" : "Add Exercise"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. bench press, squat, deadlift'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='weight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount of Weight (lbs)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='e.g. a number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='reps'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount of Reps</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='e.g. a number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='sets'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount of Sets</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='e.g. a number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='completed'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Completed Exercise</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='gap-1 sm:gap-0'>
              {exerciseToEdit && (
                <LoadingButton
                  variant='destructive'
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteExercise}
                  type='button'>
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                type='submit'
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}>
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddExerciseDialog;
