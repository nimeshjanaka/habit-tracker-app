// models/Habit.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IHabit extends Document {
    userEmail: string
    name: string
    checkmarks: boolean[]
}

const HabitSchema: Schema = new Schema({
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    checkmarks: { type: [Boolean], required: true, default: Array(31).fill(false) },
})

export const Habit = mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema)
