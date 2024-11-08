import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username should exceed 2 characters")
    .max(20, "Username should not exceed 20 characters")
    .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username should contain only letters, numbers, and underscores"
    );

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({
        message: "Invalid email address",
    }),
    password: z
        .string()
        .min(6, { message: "Password should exceed 6 characters" }),
});
