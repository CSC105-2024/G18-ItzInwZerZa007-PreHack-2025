import type { Context } from "hono";
import type { AppEnv } from "@/types/env.js";
import { getUserMoodHistory } from "@/services/mood.service.js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const querySchema = z.object({
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1)
});

export const middleware = [
    zValidator('query', querySchema)
];

export default async function (c: Context<AppEnv>) {
    try {
        const user = c.get("user");
        // @ts-ignore
        const { limit, page } = c.req.valid('query');

        const result = await getUserMoodHistory(user.id, limit, page);

        return c.json({
            success: true,
            data: result.history,
            pagination: result.pagination
        });
    } catch (error: any) {
        console.error('Error fetching mood history:', error);
        return c.json({
            success: false,
            message: error.message || 'Failed to fetch mood history'
        }, 500);
    }
}