
import { NextResponse } from "next/server"
import { connectMongoDB } from "@/lib/mongodb"
import { Habit } from "../../../../models/habit"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    await connectMongoDB()
    const habits = await Habit.find({ userEmail: email })
    return NextResponse.json(habits)
}

export async function POST(request: Request) {
    const body = await request.json()
    const { userEmail, name } = body

    await connectMongoDB()
    const newHabit = await Habit.create({
        userEmail,
        name,
        checkmarks: Array(31).fill(false),
    })

    return NextResponse.json(newHabit)
}
