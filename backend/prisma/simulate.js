import { PrismaClient } from "./generated/index.js";
import { sub } from 'date-fns'

const prisma = new PrismaClient()

// Configuration
const USER_EMAIL = 'test@example.com'
const USER_PASSWORD = 'password123'
const ENTRY_COUNT = {
    DAILY: 1,       // Entries per day (average)
    WEEKLY: 7,      // Days with entries / week
    MONTHLY: 25,    // Days with entries / month
    YEARLY: 300     // Days with entries / year
}
const TIME_PERIODS = {
    DAYS_TO_GENERATE: 365,
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getWeightedRandomMoodId(moods) {
    const weightMap = {
        'Happy': 5,
        'Sad': 3,
        'Angry': 2,
        'Shy': 2,
        'Excited': 4,
        'Neutral': 6,
        'Romance': 2,
        'Calm': 4,
        'Awkward': 2,
        'Silly': 3
    }

    const weightedMoods = []

    moods.forEach(mood => {
        const weight = weightMap[mood.name] || 1
        for (let i = 0; i < weight; i++) {
            weightedMoods.push(mood.id)
        }
    })

    const randomIndex = randomInt(0, weightedMoods.length - 1)
    return weightedMoods[randomIndex]
}

// Generate a random note
function generateRandomNote() {
    const notes = [
        "Had a great day today!",
        "Feeling a bit down, but trying to stay positive.",
        "Work was stressful, need to relax.",
        "Spent time with friends and had a blast!",
        "Just a normal day, nothing special.",
        "Achieved something I've been working on for a while!",
        "Disappointed with how things turned out.",
        "Excited about upcoming plans!",
        "Feeling peaceful and content.",
        "Had an argument that left me upset.",
        null, // Sometimes no note
        null  // Increase probability of no note
    ]

    return notes[randomInt(0, notes.length - 1)]
}

async function main() {
    console.log('Starting history simulation...')

    let user = await prisma.user.findUnique({
        where: { email: USER_EMAIL }
    })

    if (!user) {
        import('bcryptjs').then(async (bcrypt) => {
            const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10)
            user = await prisma.user.create({
                data: {
                    email: USER_EMAIL,
                    password: hashedPassword,
                    createdAt: new Date()
                }
            })
            console.log(`Created test user: ${USER_EMAIL}`)
            await generateHistoryData(user.id)
        })
    } else {
        console.log(`Using existing user: ${USER_EMAIL}`)
        await generateHistoryData(user.id)
    }
}

async function generateHistoryData(userId) {
    const moods = await prisma.mood.findMany()

    if (moods.length === 0) {
        console.error('No moods found in database. Run the seed script first!')
        return
    }

    const deletedCount = await prisma.history.deleteMany({
        where: { userId }
    })
    console.log(`Cleared ${deletedCount.count} existing history entries`)

    const startDate = sub(new Date(), { days: TIME_PERIODS.DAYS_TO_GENERATE })
    const endDate = new Date()

    let currentDate = new Date(startDate)
    let entriesCreated = 0

    while (currentDate <= endDate) {
        // Decide if we create entries for this day (based on frequency)
        const dayOfYear = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        const createEntry = dayOfYear < ENTRY_COUNT.YEARLY

        if (createEntry) {
            // How many entries to create for this day (1-3)
            const entriesToCreate = randomInt(1, Math.min(3, ENTRY_COUNT.DAILY + 1))

            for (let i = 0; i < entriesToCreate; i++) {
                // Set a random time during the day
                const entryDate = new Date(currentDate)
                entryDate.setHours(randomInt(8, 22))
                entryDate.setMinutes(randomInt(0, 59))

                await prisma.history.create({
                    data: {
                        userId,
                        moodId: getWeightedRandomMoodId(moods),
                        note: generateRandomNote(),
                        createdAt: entryDate
                    }
                })

                entriesCreated++
            }
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1)
    }

    console.log(`Successfully created ${entriesCreated} mood history entries over ${TIME_PERIODS.DAYS_TO_GENERATE} days`)
    console.log(`Test user: ${USER_EMAIL} with password: ${USER_PASSWORD}`)
}

main()
    .catch((e) => {
        console.error('Simulation error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })