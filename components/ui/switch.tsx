"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[#433CE7] data-[state=unchecked]:bg-gray-200 border-2 data-[state=unchecked]:border-gray-300 data-[state=checked]:border-[#433CE7] inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#433CE7]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:border-gray-200",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white border-2 border-gray-200 pointer-events-none block size-4 rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
