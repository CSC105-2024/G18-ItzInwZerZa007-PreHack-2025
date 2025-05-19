import React from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils.js";
import { buttonVariants } from "@/components/ui/button.jsx";

function Page() {
  return (
    <div
      data-status="404"
      className="min-h-screen bg-[#fffaf3] flex flex-col items-center justify-center px-4 py-12 text-center space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-[#8bbbd9]">404</h1>
        <p className="text-xl text-[#f1b24a] font-medium">Oops! Page Not Found</p>
        <p className="text-sm text-gray-600 max-w-md">
          The page you’re looking for doesn’t exist. Maybe it moved, or maybe it never existed.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="h-48 w-72 rounded-xl bg-[#fef3c7]" />
        <Skeleton className="h-4 w-56 bg-[#fde68a]" />
        <Skeleton className="h-4 w-40 bg-[#fdba74]" />
      </div>

      <NavLink
        to="/"
        className={cn(
          "mt-4 rounded-full px-6 py-2 bg-[#8bbbd9] text-white text-sm font-semibold hover:bg-[#72a2c3] transition-all shadow",
          "font-mono"
        )}
      >
        ⬅ Back to Home
      </NavLink>
    </div>
  );
}

export default Page;