'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"


const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})

type SignInFormValues = z.infer<typeof signInSchema>

export default function SignIn() {
    const router = useRouter()
    const [error, setError] = useState("")

    
    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    useEffect(() => {
        const session = sessionStorage.getItem("session")
        if (session) {
            router.push("/component/maindashboard")
        }
    }, [router])

    // Form Submission
    const onSubmit = async (values: SignInFormValues) => {
        setError("")

        try {
            const res = await signIn("credentials", {
                email: values.email,
                password: values.password,
                redirect: false,
            })

            if (!res || res.error) {
                setError("Invalid credentials.")
                return
            }

            //  store  session 
            sessionStorage.setItem("session", "active")
            router.push("/component/maindashboard")
        } catch (err) {
            console.error("Error during sign-in:", err)
            setError("An error occurred during sign-in. Please try again.")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="john@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Sign In
                            </Button>

                            {error && (
                                <p className="text-sm text-red-500 text-center">{error}</p>
                            )}
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm w-full">
                        Don’t have an account?{" "}
                        <Link href="/sign-up" className="text-blue-600 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
