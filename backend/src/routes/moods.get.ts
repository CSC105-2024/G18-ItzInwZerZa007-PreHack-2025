import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getAllMoods } from "@/services/mood.service.js";

export default async function (c: Context<AppEnv>) {
    try {
        const moods = await getAllMoods();

        return c.json({
            success: true,
            data: moods
        });
    } catch (error: any) {
        console.error('Error fetching moods:', error);
        return c.json({
            success: false,
            message: error.message || 'Failed to fetch moods'
        }, 500);
    }
}