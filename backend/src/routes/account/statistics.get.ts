import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { subDays, subMonths, subYears, format } from "date-fns";
import {getPrisma} from "@/lib/prisma.js";

interface MoodStat {
    id: number;
    name: string;
    count: number;
}

interface DailyMoodCount {
    day: string;
    [moodName: string]: string | number;
}

interface MonthlyMoodCount {
    month: string;
    [moodName: string]: string | number;
}

interface YearlyMoodCount {
    year: string;
    [moodName: string]: string | number;
}

type AggregatedMoodData = DailyMoodCount[] | MonthlyMoodCount[] | YearlyMoodCount[];

const prisma = getPrisma();

const querySchema = z.object({
    period: z.enum(['weekly', 'monthly', 'yearly']).default('monthly')
});

export const middleware = [
    zValidator('query', querySchema)
];

export default async function (c: Context<AppEnv>) {
    try {
        const user = c.get("user");
        // @ts-ignore
        const { period } = c.req.valid('query');

        const now = new Date();
        let startDate = new Date();
        let stats: MoodStat[] = [];
        let aggregatedData: AggregatedMoodData = [];

        if (period === 'weekly') {
            startDate = subDays(now, 7);

            const moodGroups = await prisma.history.groupBy({
                by: ['moodId'],
                where: {
                    userId: user.id,
                    createdAt: { gte: startDate }
                },
                _count: { moodId: true }
            });
            
            stats = await Promise.all(moodGroups.map(async (stat) => {
                const mood = await prisma.mood.findUnique({
                    where: { id: stat.moodId }
                });
                return {
                    id: stat.moodId,
                    name: mood?.name || 'Unknown',
                    count: stat._count.moodId
                };
            }));
            
            const days = [];
            for (let i = 6; i >= 0; i--) {
                const day = subDays(now, i);
                days.push(format(day, 'yyyy-MM-dd'));
            }
            
            const dailyMoods = await Promise.all(days.map(async (day) => {
                const dayStart = new Date(day);
                const dayEnd = new Date(day);
                dayEnd.setHours(23, 59, 59, 999);

                const dayMoods = await prisma.history.findMany({
                    where: {
                        userId: user.id,
                        createdAt: {
                            gte: dayStart,
                            lte: dayEnd
                        }
                    },
                    include: {
                        mood: true
                    }
                });

                const moodCounts: { [moodName: string]: number } = {};
                dayMoods.forEach(entry => {
                    if (!moodCounts[entry.mood.name]) {
                        moodCounts[entry.mood.name] = 0;
                    }
                    moodCounts[entry.mood.name]++;
                });

                return {
                    day: format(dayStart, 'EEE'),
                    ...moodCounts
                };
            }));

            aggregatedData = dailyMoods;

        } else if (period === 'monthly') {
            startDate = subMonths(now, 12);

            const moodGroups = await prisma.history.groupBy({
                by: ['moodId'],
                where: {
                    userId: user.id,
                    createdAt: { gte: startDate }
                },
                _count: { moodId: true }
            });
            
            stats = await Promise.all(moodGroups.map(async (stat) => {
                const mood = await prisma.mood.findUnique({
                    where: { id: stat.moodId }
                });
                return {
                    id: stat.moodId,
                    name: mood?.name || 'Unknown',
                    count: stat._count.moodId
                };
            }));

            const months = [];
            for (let i = 11; i >= 0; i--) {
                const month = subMonths(now, i);
                months.push({
                    date: month,
                    key: format(month, 'yyyy-MM'),
                    label: format(month, 'MMM yyyy')
                });
            }
            
            const monthlyMoods = await Promise.all(months.map(async (month) => {
                const monthStart = new Date(month.date);
                monthStart.setDate(1);
                monthStart.setHours(0, 0, 0, 0);

                const monthEnd = new Date(month.date);
                monthEnd.setMonth(monthEnd.getMonth() + 1);
                monthEnd.setDate(0); 
                monthEnd.setHours(23, 59, 59, 999);

                const monthMoods = await prisma.history.findMany({
                    where: {
                        userId: user.id,
                        createdAt: {
                            gte: monthStart,
                            lte: monthEnd
                        }
                    },
                    include: {
                        mood: true
                    }
                });
                
                const moodCounts: { [moodName: string]: number } = {};
                monthMoods.forEach(entry => {
                    if (!moodCounts[entry.mood.name]) {
                        moodCounts[entry.mood.name] = 0;
                    }
                    moodCounts[entry.mood.name]++;
                });

                return {
                    month: month.label,
                    ...moodCounts
                };
            }));

            aggregatedData = monthlyMoods;

        } else if (period === 'yearly') {
            
            startDate = subYears(now, 5);

            const moodGroups = await prisma.history.groupBy({
                by: ['moodId'],
                where: {
                    userId: user.id,
                    createdAt: { gte: startDate }
                },
                _count: { moodId: true }
            });
            
            stats = await Promise.all(moodGroups.map(async (stat) => {
                const mood = await prisma.mood.findUnique({
                    where: { id: stat.moodId }
                });
                return {
                    id: stat.moodId,
                    name: mood?.name || 'Unknown',
                    count: stat._count.moodId
                };
            }));

            const years = [];
            for (let i = 4; i >= 0; i--) {
                const year = subYears(now, i);
                years.push({
                    date: year,
                    key: format(year, 'yyyy'),
                    label: format(year, 'yyyy')
                });
            }
            
            const yearlyMoods = await Promise.all(years.map(async (year) => {
                const yearStart = new Date(year.date);
                yearStart.setMonth(0, 1); 
                yearStart.setHours(0, 0, 0, 0);

                const yearEnd = new Date(year.date);
                yearEnd.setMonth(11, 31); 
                yearEnd.setHours(23, 59, 59, 999);

                const yearMoods = await prisma.history.findMany({
                    where: {
                        userId: user.id,
                        createdAt: {
                            gte: yearStart,
                            lte: yearEnd
                        }
                    },
                    include: {
                        mood: true
                    }
                });

                const moodCounts: { [moodName: string]: number } = {};
                yearMoods.forEach(entry => {
                    if (!moodCounts[entry.mood.name]) {
                        moodCounts[entry.mood.name] = 0;
                    }
                    moodCounts[entry.mood.name]++;
                });

                return {
                    year: year.label,
                    ...moodCounts
                };
            }));

            aggregatedData = yearlyMoods;
        }

        return c.json({
            success: true,
            data: {
                summary: stats,
                aggregated: aggregatedData,
                period
            }
        });
    } catch (error: any) {
        console.error('Error fetching mood statistics:', error);
        return c.json({
            success: false,
            message: error.message || 'Failed to fetch mood statistics'
        }, 500);
    }
}