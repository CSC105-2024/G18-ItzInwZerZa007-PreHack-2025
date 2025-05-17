import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useUserDeleteOverlay } from "@/overlay/authentication/delete";
import { useSignOutOverlay } from "@/overlay/authentication/session";
import { useAuth } from "@/contexts/auth-context";
import { useMood } from "@/contexts/mood-context";
import LoadingLayout from "@/components/layout/loading";

const MOOD_COLORS = {
  Happy: "#4ade80",
  Sad: "#60a5fa",
  Angry: "#f87171",
  Shy: "#c084fc",
  Excited: "#facc15",
  Neutral: "#94a3b8",
  Romance: "#fb7185",
  Calm: "#2dd4bf",
  Awkward: "#f97316",
  Silly: "#a78bfa",
};

function Page() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const {
    statistics,
    aggregatedStats,
    currentPeriod,
    fetchStatistics,
    isLoading: moodLoading,
  } = useMood();
  const [statsPeriod, setStatsPeriod] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");
  const location = useLocation();

  const { open: openUserDeleteOverlay } = useUserDeleteOverlay();
  const { open: openSignOutOverlay } = useSignOutOverlay();

  useEffect(() => {
    if (isAuthenticated) {
      fetchStatistics(statsPeriod);
    }
  }, [isAuthenticated, statsPeriod]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};

    statistics.forEach((stat) => {
      if (stat.count > 0) {
        config[stat.name] = {
          label: stat.name,
          color:
            MOOD_COLORS[stat.name as keyof typeof MOOD_COLORS] || "#94a3b8",
        };
      }
    });

    return config;
  }, [statistics]);

  const isLoading = authLoading || moodLoading;

  if (isLoading) {
    return <LoadingLayout />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/authentication/sign-in"
        state={{ from: location }}
        replace
      />
    );
  }

  const mostFrequentMood = [...statistics].sort((a, b) => b.count - a.count)[0];
  const totalMoods = statistics.reduce((sum, stat) => sum + stat.count, 0);

  const getXAxisKey = () => {
    switch (currentPeriod) {
      case "weekly":
        return "day";
      case "monthly":
        return "month";
      case "yearly":
        return "year";
      default:
        return "month";
    }
  };

  const availableMoods = statistics
    .filter((stat) => stat.count > 0)
    .map((stat) => stat.name);

  const hasMoodData = availableMoods.length > 0;

  const getPeriodText = () => {
    switch (statsPeriod) {
      case "weekly":
        return "Showing data for the past 7 days";
      case "monthly":
        return "Showing data for the past 12 months";
      case "yearly":
        return "Showing data for the past 5 years";
      default:
        return "";
    }
  };

  const getChartTitle = () => {
    switch (statsPeriod) {
      case "weekly":
        return "Weekly Mood Trends";
      case "monthly":
        return "Monthly Mood Trends";
      case "yearly":
        return "Yearly Mood Trends";
      default:
        return "Mood Trends";
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:space-y-16">
        <section className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-5xl font-bold">iMood Account</h1>
            <p className="font-mono">{user.email}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <Link to="/" className={cn(buttonVariants({}), "max-w-lg flex-1")}>
              Home
            </Link>
            <Button
              className="max-w-lg flex-1"
              variant="destructive"
              onClick={() => openUserDeleteOverlay({})}
            >
              Delete Account
            </Button>
            <Button
              className="max-w-lg flex-1"
              variant="secondary"
              onClick={() => openSignOutOverlay({})}
            >
              Sign out
            </Button>
          </div>
        </section>
        <section className="space-y-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Statistics</h2>
              <span>Your mood summary over time</span>
            </div>
          </div>

          {/* Period selector - completely outside of tabs */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center justify-center rounded-lg border p-1">
              <button
                className={cn(
                  "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  statsPeriod === "weekly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setStatsPeriod("weekly")}
              >
                Weekly
              </button>
              <button
                className={cn(
                  "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  statsPeriod === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setStatsPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                className={cn(
                  "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  statsPeriod === "yearly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setStatsPeriod("yearly")}
              >
                Yearly
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              {getPeriodText()}
            </div>

            {/* Chart and summary - completely outside of tabs */}
            <div className="flex flex-col gap-4 md:flex-row">
              {aggregatedStats.length > 0 && hasMoodData ? (
                <div className="rounded-lg border p-4 md:w-2/3">
                  <h3 className="mb-4 text-lg font-semibold">
                    {getChartTitle()}
                  </h3>
                  <ChartContainer
                    config={chartConfig}
                    className="h-[350px] w-full"
                  >
                    <BarChart data={aggregatedStats}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey={getXAxisKey()}
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tickFormatter={(value) => {
                          return value.length > 10
                            ? `${value.slice(0, 10)}...`
                            : value;
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend
                        content={<ChartLegendContent className="flex-wrap" />}
                      />

                      {/* Render a bar for each available mood */}
                      {availableMoods.map((mood) => (
                        <Bar
                          key={mood}
                          dataKey={mood}
                          fill={`var(--color-${mood})`}
                          radius={4}
                        />
                      ))}
                    </BarChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="flex h-[400px] w-full items-center justify-center rounded-lg border p-4 md:w-2/3">
                  <p className="text-gray-500">
                    No mood data available for this period
                  </p>
                </div>
              )}

              <div className="rounded-lg border bg-gray-50 p-4 md:w-1/3">
                <h3 className="text-xl font-bold md:text-2xl">Summary</h3>
                {totalMoods > 0 ? (
                  <>
                    <p className="mt-4">
                      You've recorded <strong>{totalMoods}</strong> mood
                      {totalMoods !== 1 ? "s " : " "}
                      during this {currentPeriod.slice(0, -2)} period.
                    </p>
                    {mostFrequentMood && (
                      <p className="mt-2">
                        Your most frequent mood was{" "}
                        <strong>{mostFrequentMood.name}</strong> with{" "}
                        <strong>{mostFrequentMood.count}</strong> entries (
                        {Math.round(
                          (mostFrequentMood.count / totalMoods) * 100,
                        )}
                        % of the time).
                      </p>
                    )}
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold">Mood breakdown:</h4>
                      <ul className="space-y-1">
                        {statistics
                          .filter((stat) => stat.count > 0)
                          .sort((a, b) => b.count - a.count)
                          .map((stat) => (
                            <li
                              key={stat.id}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    MOOD_COLORS[
                                      stat.name as keyof typeof MOOD_COLORS
                                    ] || "#94a3b8",
                                }}
                              />
                              <span>
                                {stat.name}: {stat.count} entries
                              </span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <p className="mt-4 text-sm">
                      Regular mood tracking helps you understand your emotional
                      patterns and improve your wellbeing.
                    </p>
                  </>
                ) : (
                  <p className="mt-2">
                    You haven't recorded any moods for this{" "}
                    {currentPeriod.slice(0, -2)} period. Start tracking your
                    moods to see statistics here!
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <span className="py-2 font-mono">
        &copy; {new Date().getFullYear()} iMood
      </span>
    </div>
  );
}

export default Page;
