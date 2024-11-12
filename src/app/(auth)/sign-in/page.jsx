"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
const page = () => {
    /* const [username, setUsername] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false); */
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const debounced = useDebounceCallback(setUsername, 300);
    const { toast } = useToast();
    const router = useRouter();
    //zod implementation
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });
    /* useEffect(() => {
        const checkUsernameUnique = async (data) => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage("");
                try {
                    const response = await axios.get(
                        `/api/check-username-unique?username=${username}`
                    );
                    console.log("Checking the Username");
                    console.log("While checking the username:->", response);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    // const axiosError=error;
                    setUsernameMessage("Error checking username");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]); */
    const onSubmit = async (data) => {
        /* setIsSubmitting(true);
        try {
            const response = await axios.post("/api/sign-up", data);
            toast({
                title: "Account created",
                description: response.data.message,
                status: "success",
            });
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in SignUp of User", error);
            toast({
                title: "SignUp failed",
                description: error.response.data.message,
                variant: "destructive",
            });
            setIsSubmitting(false);
        } */
        const result = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });
        console.log("Result while sign in is :->", result);
        if (result?.error) {
            toast({
                title: "Sign In Failed",
                description: result.error,
                variant: "destructive",
            });
        }
        if (result?.url) {
            router.push("/dashboard");
        }
    };
    return (
        <>
            {/* <Navbar /> */}
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    {/* <div> */}
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Welcome Back to True Feedback
                        </h1>
                        <p className="mb-4">
                            Sign in to continue your secret conversations
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                        Please wait
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                    <div className="text-center mt-4">
                        <p>
                            New to TrueFeedback?{" "}
                            <Link
                                href="/sign-up"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </>
    );
};

export default page;
