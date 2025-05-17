import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export interface Mood {
  id: number;
  name: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  moodId: number;
  note: string | null;
  createdAt: string;
  mood: Mood;
}

export interface MoodStatistic {
  id: number;
  name: string;
  count: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface MoodContextType {
  moods: Mood[];
  entries: MoodEntry[];
  pagination: Pagination | null;
  statistics: MoodStatistic[];
  aggregatedStats: any[];
  currentPeriod: "weekly" | "monthly" | "yearly";
  isLoading: boolean;
  fetchMoods: () => Promise<void>;
  fetchEntries: (limit?: number, page?: number) => Promise<void>;
  fetchStatistics: (period: "weekly" | "monthly" | "yearly") => Promise<void>;
  createEntry: (moodId: number, note?: string) => Promise<void>;
  updateEntry: (id: string, moodId: number, note?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [statistics, setStatistics] = useState<MoodStatistic[]>([]);
  const [aggregatedStats, setAggregatedStats] = useState<any[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");
  const [isLoading, setIsLoading] = useState(false);

  
  const fetchMoods = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/moods");
      if (response.data.success) {
        setMoods(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch moods");
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchEntries = async (limit = 10, page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/history", {
        params: { limit, page },
      });
      if (response.data.success) {
        setEntries(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch mood entries",
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchStatistics = async (
    period: "weekly" | "monthly" | "yearly" = "monthly",
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/account/statistics", {
        params: { period },
      });
      if (response.data.success) {
        setStatistics(response.data.data.summary);
        setAggregatedStats(response.data.data.aggregated);
        setCurrentPeriod(period);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch mood statistics",
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  const createEntry = async (moodId: number, note?: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/history", {
        moodId,
        note,
      });

      if (response.data.success) {
        toast.success("Mood entry created successfully");
        
        setEntries((prev) => [response.data.data, ...prev]);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to create mood entry",
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  const updateEntry = async (id: string, moodId: number, note?: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(`/history/${id}`, {
        moodId,
        note,
      });

      if (response.data.success) {
        toast.success("Mood entry updated successfully");
        
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? response.data.data : entry)),
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update mood entry",
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  const deleteEntry = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`/history/${id}`);

      if (response.data.success) {
        toast.success("Mood entry deleted successfully");
        
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete mood entry",
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    fetchMoods();
  }, []);

  const value = {
    moods,
    entries,
    pagination,
    statistics,
    aggregatedStats,
    currentPeriod,
    isLoading,
    fetchMoods,
    fetchEntries,
    fetchStatistics,
    createEntry,
    updateEntry,
    deleteEntry,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};


export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};
