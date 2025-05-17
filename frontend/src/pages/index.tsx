import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyMoodCard, MoodCard } from "@/components/mood/card";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { useMoodOverlay } from "@/overlay/mood";
import { useAuth } from "@/contexts/auth-context";
import { useMood } from "@/contexts/mood-context";
import LoadingLayout from "@/components/layout/loading";
import PaginationComponent from "@/components/mood/pagination.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

function Page() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    entries,
    pagination,
    fetchEntries,
    isLoading: moodLoading,
  } = useMood();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 9;

  const { open: openAddMoodOverlay } = useMoodOverlay();

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries(entriesPerPage, currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isLoading = authLoading || moodLoading;

  if (isLoading && !entries.length) {
    return <LoadingLayout />;
  }

  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center",
        isAuthenticated ? "justify-start" : "justify-center",
      )}
    >
      <div
        className={cn(
          "mx-auto w-full space-y-8 px-4 py-8 md:space-y-16",
          isAuthenticated ? "max-w-7xl" : "max-w-xl",
        )}
      >
        <section className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl font-bold">iMood</h1>
            <p>Your emotional journal, made beautiful</p>
          </div>
          {isAuthenticated && (
            <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row">
              <Link
                to="/account"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full max-w-lg flex-1",
                )}
              >
                My Account
              </Link>
              <Button
                className="max-w-lg flex-1 max-sm:w-full"
                onClick={() => openAddMoodOverlay({ isEditMode: false })}
              >
                New Entries
              </Button>
            </div>
          )}
          {!isAuthenticated && (
            <div className="flex w-full flex-row items-center justify-center gap-4">
              <Link
                to="/authentication/sign-in"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "max-w-lg flex-1",
                )}
              >
                Sign in
              </Link>
              <Link
                to="/authentication/sign-up"
                className={cn(buttonVariants({}), "max-w-lg flex-1")}
              >
                Sign up
              </Link>
            </div>
          )}
        </section>
        {isAuthenticated && (
          <section className="space-y-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="text-center text-3xl font-bold md:text-left md:text-4xl">
                  Mood History
                </h2>
                <span>Your emotional journey</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  {pagination && pagination.total > 0 ? (
                    <>
                      Showing entries {(currentPage - 1) * entriesPerPage + 1}-
                      {Math.min(currentPage * entriesPerPage, pagination.total)}{" "}
                      of {pagination.total}
                    </>
                  ) : (
                    "No entries"
                  )}
                </span>
              </div>
            </div>

            {isLoading && entries.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <Skeleton key={index} className="flex justify-center py-4 min-h-[15rem]"/>
                ))}
              </div>
            )}

            {!isLoading && entries.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {entries.map((entry) => (
                    <MoodCard key={entry.id} entry={entry} />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            ) : isLoading ? null : (
              <EmptyMoodCard />
            )}
          </section>
        )}
      </div>
      <span className="py-2 font-mono">
        &copy; {new Date().getFullYear()} iMood
      </span>
    </div>
  );
}

export default Page;
