import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { updateMoodEntry } from "@/services/mood.service.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const updateMoodSchema = z.object({
    moodId: z.number().int().positive(),
    note: z.string().max(25000).optional()
});

export const middleware = [
    zValidator('json', updateMoodSchema)
];

export default async function (c: Context<AppEnv>) {
    try {
        const id = c.req.param('id');
        // @ts-ignore
        const { moodId, note } = c.req.valid('json');

        const entry = await updateMoodEntry(id, moodId, note);

        return c.json({
            success: true,
            message: 'Mood entry updated successfully',
            data: entry
        });
    } catch (error: any) {
        console.error('Error updating mood entry:', error);
        return c.json({
            success: false,
            message: error.message || 'Failed to update mood entry'
        }, 500);
    }
}