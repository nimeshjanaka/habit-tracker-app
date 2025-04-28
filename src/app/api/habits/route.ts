import { NextResponse } from "next/server"
import { connectMongoDB } from "@/lib/mongodb"
import { Habit } from "../../../../models/habit"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    try {
        await connectMongoDB()
        const startDate = new Date(parseInt(year!), parseInt(month!), 1)
        const endDate = new Date(parseInt(year!), parseInt(month!) + 1, 0)

        const habits = await Habit.find({
            userEmail: email,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json(habits)
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching habits", error },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userEmail, name, createdAt } = body

        await connectMongoDB()

        const creationDate = createdAt ? new Date(createdAt) : new Date()
        if (isNaN(creationDate.getTime())) {
            throw new Error("Invalid date provided")
        }

        const newHabit = await Habit.create({
            userEmail,
            name,
            checkmarks: Array(31).fill(false),
            createdAt: creationDate,
        })

        return NextResponse.json(newHabit)
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating habit", error },
            { status: 500 }
        )
    }
}

