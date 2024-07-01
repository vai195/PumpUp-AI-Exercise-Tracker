"use client";

import Link from "next/link";
import React, { useState } from "react";
import logo from "../assets/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import AddExerciseDialog from "@/components/ui/AddExerciseDialog";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import AIChatButton from "@/components/AIChatButton";

function Navbar() {
  const { theme } = useTheme();
  const [showAddExerciseDialog, setShowAddExerciseDialog] = useState(false);

  const path = usePathname();
  return (
    <>
      <div className='p-4 shadow'>
        <div className='max-w-7xl m-auto flex flex-wrap gap-3 items-center justify-between'>
          <Link href='/workouts' className='flex items-center gap-1'>
            <Image src={logo} alt='PumpUp Logo' width={40} height={40} />
            <span className='font-bold '>PumpUp</span>
          </Link>
          <div className='flex flex-wrap items-center gap-2'>
            <UserButton
              afterSignOutUrl='/'
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: {
                  avatarBox: {
                    width: "2.5rem",
                    height: "2.5rem",
                  },
                },
              }}
            />
            <ThemeToggleButton />
            <Button asChild>
              <Link
                href={
                  path === "/workouts/today" ? "/workouts" : "workouts/today"
                }>
                <Calendar />
                {path === "/workouts/today"
                  ? " All Exercises"
                  : " Today's Workout"}
              </Link>
            </Button>
            <Button
              onClick={() => {
                setShowAddExerciseDialog(true);
              }}>
              <Plus size={20} className='mr-2' />
              Add Workout
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      <AddExerciseDialog
        open={showAddExerciseDialog}
        setOpen={setShowAddExerciseDialog}
      />
    </>
  );
}

export default Navbar;
