'use client';
import { Button } from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Description } from "@radix-ui/react-toast";
import axios from "axios";
import { useParams,useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import React from "react";
import {  useForm } from "react-hook-form";
import * as x from "zod";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams();
    console.log("param is :->", params);
    const { toast } = useToast();
    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {code :""}
    });
    const onSubmit = async (data) => {
        console.log("Data is :->", data);
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.code,
            });
            toast({
                title: "Success",
                description: response.data.message,
            });
            router.replace("/sign-in");
        } catch (error) {
            console.log("Error in Verifying User", error);
            toast({
                title: "Verification Failed",
                description: error.response.data.message,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Your Verification Code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {/* This is your public display name. */}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
            {/* <h1>Verify Account</h1> */}
        </div>
    );
};

export default VerifyAccount;
