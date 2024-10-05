"use client";

import { signOut } from "@/actions/auth";
import { AnimatedSpinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function DashboardPage() {
  const [isPending, setIsPending] = useState(false);

  return (
    <div>
      <Button
        disabled={isPending}
        className="relative"
        onClick={async () => {
          setIsPending(true);
          await signOut();
          setIsPending(false);
        }}
      >
        <span className={cn(isPending ? "opacity-0" : "")}>Sign Out</span>
        {isPending ? (
          <div className="absolute inset-0 grid place-items-center">
            <AnimatedSpinner className="size-6" />
          </div>
        ) : null}
      </Button>
    </div>
  );
}
