import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "../../../../models/user";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();
        const user = await User.findOne({ email }).select("_id");

        return NextResponse.json({ exists: !!user });
    } catch (error) {
        console.error("Error in userExists:", error);
        return NextResponse.json(
            { error: "server error" },
            { status: 500 }
        );
    }
}