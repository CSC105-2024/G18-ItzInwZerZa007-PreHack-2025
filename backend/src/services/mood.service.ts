import {getPrisma} from "@/lib/prisma.js";

const prisma = getPrisma();

export const getAllMoods = async () => {
    const moods = await prisma.mood.findMany({
        orderBy: {
            id: 'asc'
        }
    });

    return moods;
};

export const getUserMoodHistory = async (userId: string, limit = 10, page = 1) => {
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
        prisma.history.findMany({
            where: {
                userId
            },
            include: {
                mood: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit,
            skip
        }),
        prisma.history.count({
            where: {
                userId
            }
        })
    ]);

    return {
        history,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const createMoodEntry = async (userId: string, moodId: number, note?: string) => {
    const entry = await prisma.history.create({
        data: {
            userId,
            moodId,
            note,
            createdAt: new Date()
        },
        include: {
            mood: true
        }
    });

    return entry;
};

export const updateMoodEntry = async (id: string, moodId: number, note?: string) => {
    const entry = await prisma.history.update({
        where: {
            id
        },
        data: {
            moodId,
            note
        },
        include: {
            mood: true
        }
    });

    return entry;
};

export const deleteMoodEntry = async (id: string, userId: string) => {
    const entry = await prisma.history.findFirst({
        where: {
            id,
            userId
        }
    });

    if (!entry) {
        throw new Error("Mood entry not found or you don't have permission to delete it");
    }

    await prisma.history.delete({
        where: {
            id
        }
    });

    return true;
};
