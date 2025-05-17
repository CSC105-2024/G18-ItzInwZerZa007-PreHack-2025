import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { createMoodEntry } from "@/services/mood.service.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const createMoodSchema = z.object({
    moodId: z.number().int().positive(),
    note: z.string().max(25000).nullish().optional()
});

export const middleware = [
    zValidator('json', createMoodSchema)
];

export default async function (c: Context<AppEnv>) {
    try {
        const user = c.get("user");
        // @ts-ignore
        const { moodId, note } = c.req.valid('json');

        const entry = await createMoodEntry(user.id, moodId, note);

        return c.json({
            success: true,
            message: 'Mood entry created successfully',
            data: entry
        });
    } catch (error: any) {
        console.error('Error creating mood entry:', error);
        return c.json({
            success: false,
            message: error.message || 'Failed to create mood entry'
        }, 500);
    }
}