

import { NextRequest, NextResponse } from "next/server"
import { connectMongoDB } from "@/lib/mongodb"
import { Habit } from "../../../../../models/habit"


export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params
    const { checkmarks } = await request.json()

    await connectMongoDB()

    const updatedHabit = await Habit.findByIdAndUpdate(id, { checkmarks }, { new: true })
    return NextResponse.json(updatedHabit)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params

    await connectMongoDB()

    await Habit.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
}