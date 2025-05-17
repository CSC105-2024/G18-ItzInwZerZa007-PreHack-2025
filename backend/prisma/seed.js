import { PrismaClient } from "./generated/index.js";

const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed process...')

    const moodCount = await prisma.mood.count()

    if (moodCount === 0) {
        const moods = [
            { name: 'Happy' },
            { name: 'Sad' },
            { name: 'Angry' },
            { name: 'Shy' },
            { name: 'Excited' },
            { name: 'Neutral' },
            { name: 'Romance' },
            { name: 'Calm' },
            { name: 'Awkward' },
            { name: 'Silly' }
        ]

        for (const mood of moods) {
            await prisma.mood.create({
                data: mood
            })
            console.log(`Created mood: ${mood.name}`)
        }

        console.log('Mood seed completed successfully')
    } else {
        console.log('Moods already exist, skipping seed')
    }
}

main()
    .catch((e) => {
        console.error('Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })