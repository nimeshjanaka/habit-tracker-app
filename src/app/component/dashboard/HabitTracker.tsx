// src/components/dashboard/HabitTracker.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";

export function HabitTracker() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [habits, setHabits] = useState([
        { id: 1, name: "Drink water", completed: false },
        { id: 2, name: "Exercise", completed: false },
        { id: 3, name: "Read", completed: false },
    ]);

    const toggleHabit = (id: number) => {
        setHabits(
            habits.map((habit) =>
                habit.id === id ? { ...habit, completed: !habit.completed } : habit
            )
        );
    };

    const downloadSheet = (type: "daily" | "weekly" | "monthly") => {
        // Generate CSV data (simplified example)
        const csvData = habits.map((h) => `${h.name},${h.completed}\n`).join("");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-habit-tracker-${new Date().toISOString()}.csv`;
        a.click();
    };

    return (
        <div className="flex flex space-y-4 ml-32">
            <Calendar mode="single" selected={date} onSelect={setDate} />

            <div className="space-y-2 ml-24">
                {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`habit-${habit.id}`}
                            checked={habit.completed}
                            onCheckedChange={() => toggleHabit(habit.id)}
                        />
                        <label htmlFor={`habit-${habit.id}`}>{habit.name}</label>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 ml-24">
                <Button onClick={() => downloadSheet("daily")} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Daily
                </Button>
                <Button onClick={() => downloadSheet("weekly")} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Weekly
                </Button>
                <Button onClick={() => downloadSheet("monthly")} variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Monthly
                </Button>
            </div>
        </div>
    );
} 