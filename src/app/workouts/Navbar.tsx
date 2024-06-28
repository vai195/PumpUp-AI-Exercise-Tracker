"use client";

import Link from "next/link";
import React, { useState } from "react";
import logo from "../assets/logo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddExerciseDialog from "@/components/ui/AddExerciseDialog";

function Navbar() {
  const [showAddExerciseDialog, setShowAddExerciseDialog] = useState(false);
  return (
    <>
      <div className="p-4 shadow">
        <div className="max-w-7xl m-auto flex flex-wrap gap-3 items-center justify-between">
          <Link href="/workouts" className="flex items-center gap-1">
            <Image src={logo} alt="PumpUp Logo" width={40} height={40} />
            <span className="font-bold ">PumpUp</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <Button
              onClick={() => {
                setShowAddExerciseDialog(true);
              }}
            >
              <Plus size={20} className="mr-2" />
              Add Workout
            </Button>
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
