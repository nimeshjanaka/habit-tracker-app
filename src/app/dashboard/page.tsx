'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle/ModeToggle";

export default function Dashboard() {
    const router = useRouter();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
        e.preventDefault();
        router.push(targetUrl);
    };

    return (
        <div>
            <div className="flex flex-col bg-State dark:bg-gray-900">
                <div className="flex justify-end gap-6 p-4">
                    <div className="flex justify-end gap-6 items-center">
                        <Link
                            href="/sign-in"
                            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                            onClick={(e) => handleLinkClick(e, '/sign-in')}
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className="font-semibold hover:underline dark:text-white transition-colors"
                            onClick={(e) => handleLinkClick(e, '/sign-up')}
                        >
                            Start Today
                        </Link>
                        <ModeToggle />
                    </div>
                </div>


                <div className="flex flex-col items-center text-center px-4 py-8 dark:bg-gray-900">
                    <div className="flex items-center justify-center mb-8">
                        <span className="text-3xl font-bold">✅ DailyHabits</span>
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 max-w-2xl dark:text-white">
                        The Simplest Habit Tracker App on this Planet
                    </h1>

                    <p className="text-lg text-gray-600 mb-6 max-w-xl dark:text-gray-300 ">
                        Finally, a daily habit tracker that helps you do more, by doing less.
                    </p>

                    <Link
                        href="/sign-up"
                        className="inline-flex items-center bg-black text-white text-lg px-10 py-3 rounded-lg shadow-md hover:bg-gray-800 mb-2 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:shadow-gray-600/30"
                    >
                        ✅ Start DailyHabits today
                    </Link>

                    <p className="text-sm text-gray-500 mb-8 dark:text-gray-400">100% free forever</p>

                    <div className="flex flex-col items-center space-y-2 mb-8">
                        <div className="px-4 py-2 border rounded-lg text-red-500 border-red-500 flex items-center space-x-2 dark:border-red-400 dark:text-red-400 dark:bg-gray-800">
                            <span className="font-semibold">🚀 Featured on</span>
                            <Link href="https://www.producthunt.com/" className="text-red-500 font-bold hover:underline dark:text-red-400">
                                Product Hunt
                            </Link>
                        </div>
                        <p className="text-md text-gray-500 dark:text-gray-400">🎉 We were featured in ProductHunt's newsletter.</p>
                    </div>
                </div>
            </div>



            <div className="w-full max-w-8xl mx-auto">
                <div className="w-full mb-12 px-4">
                    <Image
                        src="/images/image5.jpeg"
                        alt="image4"
                        width={1200}
                        height={200}
                        className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
                        priority
                    />
                </div>

                <hr className="my-8 mx-4" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-20 mb-16 px-4">
                    <Image
                        src="/images/image1.jpeg"
                        alt="image1"
                        width={400}
                        height={200}
                        className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <Image
                        src="/images/image2.jpeg"
                        alt="image2"
                        width={400}
                        height={300}
                        className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <Image
                        src="/images/image3.jpeg"
                        alt="image3"
                        width={400}
                        height={300}
                        className="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                </div>

                <div className="space-y-8 md:space-y-12 mb-12 md:mb-16 px-4">
                    {/* Card 1 - Monthly Overview */}
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 relative aspect-video">
                                <Image
                                    src="/images/image5.jpeg"
                                    alt="Calendar view screenshot"
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                                <div className="absolute bottom-4 right-4">
                                    <button className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-md shadow-sm text-sm font-medium hover:bg-gray-100 transition-colors">
                                        Show 2021
                                    </button>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-4 sm:p-6">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl sm:text-2xl">Monthly Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                                    <p className="text-base sm:text-lg font-medium">
                                        Visualize your entire month at a glance.
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        With a simple calendar view, you can see your activity for the entire month to see
                                        how you're doing and which areas you might need to focus on.
                                    </p>
                                </CardContent>
                            </div>
                        </div>
                    </Card>

                    {/* Card 2 - Flexible Goals */}
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="flex flex-col md:flex-row-reverse">
                            <div className="w-full md:w-1/2 relative aspect-video md:aspect-[3/4]">
                                <Image
                                    src="/images/image6.jpeg"
                                    alt="Flexible goals screenshot"
                                    width={600}
                                    height={800}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-full md:w-1/2 p-4 sm:p-6">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl sm:text-2xl">Set flexible goals instead of streaks</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                                    <p className="text-base sm:text-lg font-medium">
                                        Streaks break, because life happens. But don't let that stop your progress.
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        Goals are based on flexible consistency, which makes it okay to fail sometimes.
                                        It's more important that you continue doing your habit.
                                    </p>
                                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium text-sm sm:text-base">Create New Habit</p>
                                        <ul className="mt-1.5 sm:mt-2 space-y-1.5 text-xs sm:text-sm">
                                            <li><span className="font-medium">Habit Name</span> - Exercise</li>
                                            <li><span className="font-medium">Goal</span> - Number of times to perform habit in a month</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>

                    {/* Card 3 - Reflection Notes */}
                    <Card className="hover:shadow-xl transition-shadow overflow-hidden">
                        <div className="flex flex-col md:flex-row-reverse">
                            <div className="w-full md:w-1/2 relative aspect-square">
                                <Image
                                    src="/images/image7.jpeg"
                                    alt="Reflection notes screenshot"
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="w-full md:w-1/2 p-4 sm:p-6">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-xl sm:text-2xl">Make notes to reflect on your journey</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0 pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                                    <p className="text-base sm:text-lg font-medium">
                                        No journey is complete without reflection.
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        Reflection promotes self-awareness and prompts you to evaluate your own progress,
                                        as well as areas where you need to improve.
                                    </p>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        Ultimately, you are the best judge of your own journey.
                                    </p>
                                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium text-sm sm:text-base">Create New Note</p>
                                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600">
                                            Write down milestones or reflections!
                                        </p>
                                    </div>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="bg-gray-50 py-10 xs:py-12 sm:py-16 text-center">
                    <div className="max-w-2xl mx-auto px-4 xs:px-5 sm:px-6">
                        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold mb-3 xs:mb-4 sm:mb-6">
                            Ready to build better habits?
                        </h2>
                        <p className="text-sm xs:text-base sm:text-lg text-gray-600 mb-5 xs:mb-6 sm:mb-8 leading-relaxed">
                            Join thousands of people who are already improving their lives with DailyHabits
                        </p>
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center justify-center bg-black text-white text-sm xs:text-base sm:text-lg px-5 xs:px-6 sm:px-10 py-2 xs:py-2.5 sm:py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all w-full xs:w-4/5 sm:w-auto mx-auto"
                        >
                            Start Your Journey Today
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}