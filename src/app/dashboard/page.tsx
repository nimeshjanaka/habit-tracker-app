'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
        e.preventDefault();
        
        router.push(targetUrl);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-State">
            <div className="absolute top-4 right-8 flex gap-6">
                <Link
                    href="/sign-in"
                    className="text-gray-500 hover:text-black"
                    onClick={(e) => handleLinkClick(e, '/sign-in')}
                >
                    Login
                </Link>
                <Link
                    href="/sign-up"
                    className="font-semibold hover:underline"
                    onClick={(e) => handleLinkClick(e, '/sign-up')}
                >
                    Start Today
                </Link>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">✅ DailyHabits</span>
            </div>

            <h1 className="mt-20 text-4xl font-extrabold tracking-tight sm:text-5xl">
                The Simplest Habit Tracker App on this Planet
            </h1>

            <p className="mt-4 text-lg text-gray-600">
                Finally, a daily habit tracker that helps you do more, by doing less.
            </p>

            <Link
                href="/sign-up"
                className="mt-6 inline-flex items-center bg-black text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all"
            >
                ✅ Start DailyHabits today
            </Link>

            <p className="mt-2 text-sm text-gray-500">100% free forever</p>

            <div className="mt-6 flex flex-col items-center space-y-2">
                <div className="px-4 py-2 border rounded-lg text-red-500 border-red-500 flex items-center space-x-2">
                    <span className="font-semibold">🚀 Featured on</span>
                    <Link href="https://www.producthunt.com/" className="text-red-500 font-bold hover:underline">
                        Product Hunt
                    </Link>
                </div>
                <p className="text-sm text-gray-500">🎉 We were featured in ProductHunt's newsletter.</p>
            </div>

            <div className="mt-8 animate-fadeIn">
                <Image
                    src="/images/images11.jpeg"
                    alt="Habit Tracker Example"
                    width={200}
                    height={100}
                    className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
                    priority
                />
            </div>
        </div>
    );
}
