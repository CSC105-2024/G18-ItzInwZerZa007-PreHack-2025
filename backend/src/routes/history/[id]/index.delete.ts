import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { deleteMoodEntry } from "@/services/mood.service.js";

export default async function (c: Context<AppEnv>) {
    try {
        const id = c.req.param('id');
        const user = c.get("user");

        await deleteMoodEntry(id, user.id);

        return c.json({
            success: true,
            message: 'Mood entry deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting mood entry:', error);
        return c.json({
            success: false,
            message: error.message || 'Failed to delete mood entry'
        }, 500);
    }
}