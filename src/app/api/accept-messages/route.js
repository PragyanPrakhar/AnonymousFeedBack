import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "You are not Logged In" },
            { status: 401 }
        );
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessages,
            },
            {
                new: true, //so that we get the new updated user.
            }
        );
        if (!updatedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 401 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message Acceptance status updated successfully.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Error updating user", error);
        return Response.json(
            { success: false, message: "Error updating user", updatedUser },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "You are not Logged In" },
            { status: 401 }
        );
    }
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "User found",
                isAcceptingMessage: foundUser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error finding user", error);
        return Response.json(
            { success: false, message: "Error finding user" },
            { status: 500 }
        );
    }
}
