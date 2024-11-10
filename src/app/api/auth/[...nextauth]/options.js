import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "Enter Your Registered Email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            {
                                username: credentials.identifier,
                            },
                        ],
                    });
                    if (!user) {
                        throw new Error("No User Found with this email !!");
                    }
                    if (!user.isVerified) {
                        throw new Error("Please Verify Your Email First !!");
                    }
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Ypur Password is Incorrect !!");
                    }
                } catch (error) {
                    throw new Error("Invalid Credentials");
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};