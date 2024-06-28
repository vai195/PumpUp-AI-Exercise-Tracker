import React from "react";
import Navbar from "./Navbar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="p-4 max-w-7xl m-auto">{children}</main>
    </>
  );
}

export default layout;
