import React from "react";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="mb-4 flex items-center justify-between border-b p-4">
      <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
        Vivid Cart
      </h1>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
