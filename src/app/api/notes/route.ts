import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import note from "../../../../models/note";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    try {
        await connectMongoDB();
        const notes = await note.find({ userEmail: email });
        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching notes", error },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const { content, updatedAt, userEmail } = await request.json();

    try {
        await connectMongoDB();
        const newNote = await note.create({
            id: Date.now(),
            content,
            updatedAt,
            userEmail
        });
        return NextResponse.json(newNote);
    } catch (error) {
        return NextResponse.json(
            { message: "Error creating note", error },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { content, updatedAt } = await request.json();

    try {
        await connectMongoDB();
        const updatedNote = await note.findByIdAndUpdate(
            id,
            { content, updatedAt },
            { new: true }
        );
        return NextResponse.json(updatedNote);
    } catch (error) {
        return NextResponse.json(
            { message: "Error updating note", error },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        await connectMongoDB();
        await note.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting note", error },
            { status: 500 }
        );
    }
}