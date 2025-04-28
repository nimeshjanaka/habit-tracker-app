'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogDescription
} from "@/components/ui/dialog"
import {
    Form, FormField, FormItem, FormLabel,
    FormControl, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea"
import { UpgradeDialog } from "../UpgradeDialog"
import { HabitTracker } from "../dashboard/HabitTracker"

type Habit = {
    _id: string
    name: string
    checkmarks: boolean[]
    userEmail: string
    createdAt: Date
}

type Note = {
    _id?: string
    id: number
    content: string
    updatedAt: string
    userEmail: string
}

const habitSchema = z.object({
    name: z.string().min(1, "Habit name is required"),
})

type HabitForm = z.infer<typeof habitSchema>

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function MainDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [currentTime, setCurrentTime] = useState("")
    const [habits, setHabits] = useState<Habit[]>([])
    const [open, setOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const goalPerHabit = 20

    const [noteInput, setNoteInput] = useState("")
    const [notes, setNotes] = useState<Note[]>([])
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
    const [isAddingNote, setIsAddingNote] = useState(false)

    const habitForm = useForm<HabitForm>({
        resolver: zodResolver(habitSchema),
        defaultValues: { name: "" },
    })

    const fetchHabitsForMonth = async (date: Date) => {
        if (!session?.user?.email) return;

        try {
            const month = date.getMonth();
            const year = date.getFullYear();

            const habitsRes = await fetch(
                `/api/habits?email=${session.user.email}&month=${month}&year=${year}`
            );

            if (!habitsRes.ok) throw new Error('Failed to fetch habits');

            const habitsData = await habitsRes.json();
            setHabits(habitsData.map((habit: any) => ({
                ...habit,
                createdAt: new Date(habit.createdAt)
            })));
        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    };

    const fetchNotes = async () => {
        if (!session?.user?.email) return;

        try {
            const notesRes = await fetch(`/api/notes?email=${session.user.email}`);
            if (!notesRes.ok) throw new Error('Failed to fetch notes');
            const notesData = await notesRes.json();
            setNotes(notesData);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    useEffect(() => {
        if (status !== "loading" && status === "unauthenticated") {
            router.push("/sign-in")
        }
    }, [status, router])

    useEffect(() => {
        if (session?.user?.email) {
            fetchHabitsForMonth(selectedDate);
            fetchNotes();
        }
    }, [session, selectedDate])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            setCurrentTime(
                now.toLocaleString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            )
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    const onSubmit = async (data: HabitForm) => {
        const today = new Date();
        const isCurrentMonth = selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear();

        if (!isCurrentMonth && !confirm(`Are you sure you want to create this habit for ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}?`)) {
            return;
        }

        try {
            const res = await fetch("/api/habits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userEmail: session?.user?.email,
                    name: data.name,
                    createdAt: selectedDate.toISOString(),
                }),
            })

            const newHabit = await res.json();
            setHabits(prev => [...prev, {
                ...newHabit,
                createdAt: new Date(newHabit.createdAt),
            }]);
            habitForm.reset();
            setOpen(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 1000);
        } catch (error) {
            console.error("Error creating habit:", error);
        }
    };

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const goToPreviousMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setSelectedDate(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setSelectedDate(newDate);
    };

    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const toggleCheckmark = async (habitIndex: number, dayIndex: number) => {
        const updated = [...habits];
        const habit = updated[habitIndex];

        if (!habit.checkmarks) {
            habit.checkmarks = Array(31).fill(false);
        }

        habit.checkmarks[dayIndex] = !habit.checkmarks[dayIndex];

        try {
            await fetch(`/api/habits/${habit._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ checkmarks: habit.checkmarks }),
            });

            setHabits(updated);
        } catch (error) {
            console.error("Error updating habit:", error);
        }
    };

    const deleteHabit = async (habitIndex: number) => {
        const habit = habits[habitIndex];
        try {
            await fetch(`/api/habits/${habit._id}`, { method: "DELETE" });
            const updated = [...habits];
            updated.splice(habitIndex, 1);
            setHabits(updated);
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    };

    const handleNoteSave = async () => {
        if (!noteInput.trim() || !session?.user?.email) return;

        const now = new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        try {
            if (editingNoteId !== null) {
                const noteToUpdate = notes.find(note => note.id === editingNoteId);
                if (noteToUpdate?._id) {
                    const res = await fetch(`/api/notes?id=${noteToUpdate._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            content: noteInput,
                            updatedAt: now,
                        }),
                    });

                    if (!res.ok) throw new Error('Failed to update note');

                    const updatedNote = await res.json();
                    setNotes(prev =>
                        prev.map(note =>
                            note.id === editingNoteId ? updatedNote : note
                        )
                    );
                }
                setEditingNoteId(null);
            } else {
                const res = await fetch("/api/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: noteInput,
                        updatedAt: now,
                        userEmail: session.user.email,
                    }),
                });

                if (!res.ok) throw new Error('Failed to create note');

                const newNote = await res.json();
                setNotes(prev => [...prev, newNote]);
            }

            setNoteInput("");
            setIsAddingNote(false);
        } catch (error) {
            console.error("Failed to save note:", error);
        }
    };

    const deleteNote = async (noteId: number) => {
        try {
            const noteToDelete = notes.find(note => note.id === noteId);
            if (noteToDelete?._id) {
                const res = await fetch(`/api/notes?id=${noteToDelete._id}`, {
                    method: "DELETE"
                });

                if (!res.ok) throw new Error('Failed to delete note');

                setNotes(prev => prev.filter(note => note.id !== noteId));
            }
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    const startNewNote = () => {
        setNoteInput("")
        setEditingNoteId(null)
        setIsAddingNote(true)
    }

    const cancelNote = () => {
        setNoteInput("")
        setEditingNoteId(null)
        setIsAddingNote(false)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPreviousMonth();
            } else if (e.key === 'ArrowRight') {
                goToNextMonth();
            } else if (e.key === 't') {
                goToToday();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedDate]);

    if (status === "loading") return <div>Loading...</div>

    const daysInCurrentMonth = getDaysInMonth(selectedDate);

    return (
        <div className="min-h-screen flex flex-col px-6 bg-white dark:bg-gray-900">
           
            <div className="flex justify-between items-center py-4 border-b dark:border-gray-700">
                <div>
                    <h1 className="text-xl font-bold dark:text-white">DailyHabits</h1>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">{currentTime}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <UpgradeDialog />
                    <span className="text-gray-600 dark:text-gray-300">{session?.user?.email}</span>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="bg-red-200 mx-auto mt-6 mb-6 dark:bg-red-900 dark:text-white dark:hover:bg-red-800"
                    >
                        Log Out
                    </Button>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md w-full max-w-8xl mx-auto dark:bg-gray-800 dark:shadow-gray-900">
                <div className="flex justify-between items-center mb-2">
                    <button className="text-md text-gray-700 dark:text-gray-300" onClick={goToPreviousMonth}>
                        {"<"}
                    </button>
                    <span className="mx-2 dark:text-white">
                        {monthNames[selectedDate.getMonth()]}, {selectedDate.getFullYear()}
                    </span>
                    <button className="text-lg text-gray-700 dark:text-gray-300" onClick={goToNextMonth}>
                        {">"}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200 text-center dark:border-gray-600">
                        <thead>
                            <tr className="bg-gray-100 px-2 text-sm dark:bg-gray-700">
                                <th className="border border-gray-300 px-3 py-2 text-blue-700 dark:text-blue-400">Habits</th>
                                {Array.from({ length: daysInCurrentMonth }, (_, i) => (
                                    <th
                                        key={i}
                                        className={`border border-gray-300 px-2 py-1 cursor-pointer ${selectedDate.getDate() === i + 1
                                            ? "bg-gray-800 text-white dark:bg-gray-600"
                                            : "dark:text-gray-300"
                                            }`}
                                        onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i + 1))}
                                    >
                                        {i + 1}
                                    </th>
                                ))}
                                <th className="border border-gray-300 px-3 text-blue-700 dark:text-blue-400">Goal</th>
                                <th className="border border-gray-300 px-3 text-blue-700 dark:text-blue-400">Achieved</th>
                                <th className="border border-gray-300 px-3 text-blue-700 dark:text-blue-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit, habitIndex) => {
                                const achieved = habit.checkmarks?.slice(0, daysInCurrentMonth).filter(Boolean).length || 0;
                                const isGoalMet = achieved === goalPerHabit;

                                return (
                                    <tr key={habit._id} className="bg-white dark:bg-gray-900">
                                        <td className="border border-gray-300 px-3 py-2 text-left dark:border-gray-600">
                                            <span className="dark:text-white">{habit.name}</span>
                                            <span className="text-xs text-gray-500 block dark:text-gray-400">
                                                Created: {new Date(habit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </td>
                                        {Array.from({ length: daysInCurrentMonth }, (_, dayIndex) => {
                                            const isChecked = habit.checkmarks?.[dayIndex] || false;
                                            return (
                                                <td
                                                    key={dayIndex}
                                                    className={`border border-gray-300 px-1 cursor-pointer ${isChecked
                                                        ? "bg-yellow-100 dark:bg-yellow-900 dark:text-white"
                                                        : "dark:border-gray-600"
                                                        }`}
                                                    onClick={() => toggleCheckmark(habitIndex, dayIndex)}
                                                >
                                                    {isChecked ? "✓" : ""}
                                                </td>
                                            );
                                        })}
                                        <td className="border border-gray-300 px-3 dark:border-gray-600 dark:text-white">{goalPerHabit}</td>
                                        <td className={`border border-gray-300 px-3 font-semibold ${isGoalMet
                                            ? "bg-green-100 dark:bg-green-900 dark:text-white"
                                            : "dark:border-gray-600 dark:text-white"
                                            }`}>
                                            {achieved}
                                        </td>
                                        <td className="border border-gray-300 px-3 dark:border-gray-600">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="dark:bg-red-800 dark:hover:bg-red-700"
                                                onClick={() => deleteHabit(habitIndex)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {showSuccess && (
                    <p className="text-green-600 font-medium mt-2 dark:text-green-400">New habit added!</p>
                )}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4 dark:border-gray-600 dark:text-white">
                            + New Habit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="dark:bg-gray-800 dark:border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="dark:text-white">Add New Habit</DialogTitle>
                            <DialogDescription className="dark:text-gray-400">
                                Creating habit for {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...habitForm}>
                            <form onSubmit={habitForm.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={habitForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="dark:text-white">Habit Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Drink Water"
                                                    {...field}
                                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit" className="dark:bg-blue-600 dark:hover:bg-blue-700">
                                        Add Habit
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            
            <div className="mt-12 max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8 outline dark:bg-gray-800 dark:border-gray-700">
                <h2 className="text-xl font-bold text-blue-600 mb-2 dark:text-blue-400">Notes</h2>

                {(isAddingNote || editingNoteId !== null) ? (
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Type your note here (use new lines for bullet points)..."
                            className="w-full min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                onClick={handleNoteSave}
                                className="dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Save Note
                            </Button>
                            <Button
                                variant="outline"
                                onClick={cancelNote}
                                className="dark:border-gray-600 dark:text-white"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="mt-4 dark:border-gray-600 dark:text-white"
                        onClick={startNewNote}
                    >
                        + New Note
                    </Button>
                )}

                {notes.length > 0 && (
                    <div className="mt-6 space-y-4">
                        {notes.map((note) => (
                            <div key={note.id} className="border rounded p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                                <ul className="list-disc list-inside space-y-1">
                                    {note.content.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i} className="text-gray-800 dark:text-gray-200">{line}</li>
                                    ))}
                                </ul>
                                <div className="text-xs text-gray-500 mt-3 dark:text-gray-400">
                                    Last updated: {note.updatedAt}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="dark:border-gray-600 dark:text-white"
                                        onClick={() => {
                                            setNoteInput(note.content)
                                            setEditingNoteId(note.id)
                                            setIsAddingNote(true)
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        className="dark:bg-red-800 dark:hover:bg-red-700"
                                        onClick={() => deleteNote(note.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <HabitTracker />
        </div>
    )
}