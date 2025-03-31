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

type Habit = {
    _id: string
    name: string
    checkmarks: boolean[]
    userEmail: string
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

export default function MainDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const [selectedDate, setSelectedDate] = useState(new Date().getDate())
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

    useEffect(() => {
        if (status !== "loading" && status === "unauthenticated") {
            router.push("/sign-in")
        }
    }, [status, router])

    useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.email) {
                try {
                    // Fetch habits
                    const habitsRes = await fetch(`/api/habits?email=${session.user.email}`);
                    if (!habitsRes.ok) throw new Error('Failed to fetch habits');
                    const habitsData = await habitsRes.json();
                    setHabits(habitsData);

                    // Fetch notes
                    const notesRes = await fetch(`/api/notes?email=${session.user.email}`);
                    if (!notesRes.ok) throw new Error('Failed to fetch notes');
                    const notesData = await notesRes.json();
                    setNotes(notesData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    
                }
            }
        };
        fetchData();
    }, [session]);


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
        const res = await fetch("/api/habits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail: session?.user?.email,
                name: data.name,
            }),
        })

        const newHabit = await res.json()
        setHabits([...habits, newHabit])
        habitForm.reset()
        setOpen(false)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
    }

    const toggleCheckmark = async (habitIndex: number, dayIndex: number) => {
        const updated = [...habits]
        const habit = updated[habitIndex]
        if (!habit.checkmarks) {
            habit.checkmarks = Array(31).fill(false)
        }
        habit.checkmarks[dayIndex] = !habit.checkmarks[dayIndex]

        await fetch(`/api/habits/${habit._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkmarks: habit.checkmarks }),
        })

        setHabits(updated)
    }

    const deleteHabit = async (habitIndex: number) => {
        const habit = habits[habitIndex]
        await fetch(`/api/habits/${habit._id}`, { method: "DELETE" })
        const updated = [...habits]
        updated.splice(habitIndex, 1)
        setHabits(updated)
    }

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
                // Update existing note
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
                // Create new note
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
            // Add error handling UI here if needed
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

    if (status === "loading") return <div>Loading...</div>

    return (
        <div className="min-h-screen flex flex-col px-6 bg-white">
            <div className="flex justify-between items-center py-4 border-b">
                <div>
                    <h1 className="text-xl font-bold">DailyHabits</h1>
                    <p className="text-sm text-muted-foreground">{currentTime}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="outline" className="text-purple-600 border-purple-600">Upgrade</Button>
                    <span className="text-gray-600">{session?.user?.email}</span>
                </div>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md w-full max-w-8xl mx-auto">
                <div className="flex justify-between items-center mb-2">
                    <button className="text-lg text-gray-700">{"<"} March, 2025 {">"}</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200 text-center">
                        <thead>
                            <tr className="bg-gray-100 text-sm">
                                <th className="border border-gray-300 px-3 py-2 text-blue-700">Habits</th>
                                {Array.from({ length: 31 }, (_, i) => (
                                    <th
                                        key={i}
                                        className={`border border-gray-300 px-2 py-1 cursor-pointer ${selectedDate === i + 1 ? "bg-gray-800 text-white" : ""}`}
                                        onClick={() => setSelectedDate(i + 1)}>
                                        {i + 1}
                                    </th>
                                ))}
                                <th className="border border-gray-300 px-3 text-blue-700">Goal</th>
                                <th className="border border-gray-300 px-3 text-blue-700">Achieved</th>
                                <th className="border border-gray-300 px-3 text-blue-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit, habitIndex) => {
                                const achieved = habit.checkmarks?.filter(Boolean).length || 0
                                const isGoalMet = achieved === goalPerHabit
                                return (
                                    <tr key={habit._id} className="bg-white">
                                        <td className="border border-gray-300 px-3 py-2 text-left">{habit.name}</td>
                                        {Array.from({ length: 31 }, (_, dayIndex) => {
                                            const isChecked = habit.checkmarks?.[dayIndex] || false
                                            return (
                                                <td
                                                    key={dayIndex}
                                                    className={`border border-gray-300 px-2 cursor-pointer ${isChecked ? "bg-yellow-100" : ""}`}
                                                    onClick={() => toggleCheckmark(habitIndex, dayIndex)}>
                                                    {isChecked ? "✔️" : ""}
                                                </td>
                                            )
                                        })}
                                        <td className="border border-gray-300 px-3">{goalPerHabit}</td>
                                        <td className={`border border-gray-300 px-3 font-semibold ${isGoalMet ? "bg-green-100" : ""}`}>{achieved}</td>
                                        <td className="border border-gray-300 px-3">
                                            <Button variant="destructive" size="sm" onClick={() => deleteHabit(habitIndex)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {showSuccess && <p className="text-green-600 font-medium mt-2">New habit added!</p>}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="mt-4">+ New Habit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Habit</DialogTitle>
                            <DialogDescription>Create a habit to track for this month.</DialogDescription>
                        </DialogHeader>
                        <Form {...habitForm}>
                            <form onSubmit={habitForm.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={habitForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Habit Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Drink Water" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Add Habit</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            
            <hr/>

            <div className="mt-12 max-w-5xl mx-auto bg-white rounded-lg shadow-md p-8 mb-8 outline">
                <h2 className="text-xl font-bold text-blue-600 mb-2">Notes</h2>

               
                {(isAddingNote || editingNoteId !== null) ? (
                    <div className="space-y-4">
                        <Textarea
                            placeholder="Type your note here (use new lines for bullet points)..."
                            className="w-full min-h-[100px]"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleNoteSave}>
                                Save Note
                            </Button>
                            <Button variant="outline" onClick={cancelNote}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={startNewNote}
                    >
                        + New Note
                    </Button>
                )}

                
                {notes.length > 0 && (
                    <div className="mt-6 space-y-4">
                        {notes.map((note) => (
                            <div key={note.id} className="border rounded p-4 bg-gray-50">
                                <ul className="list-disc list-inside space-y-1">
                                    {note.content.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i} className="text-gray-800">{line}</li>
                                    ))}
                                </ul>
                                <div className="text-xs text-gray-500 mt-3">
                                    Last updated: {note.updatedAt}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        size="sm"
                                        variant="outline"
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
            <hr/>
            <Button onClick={handleLogout} variant="outline" className="bg-red-200 mr-100 ml-100 mt-6 mb-6">Log Out</Button>
        </div>
    )
}