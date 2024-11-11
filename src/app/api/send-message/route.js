import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { MessageSchema } from "@/model/user.model";
export async function POST(request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        // is user accepting the messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                { success: false, message: "User is not accepting messages" },
                { status: 400 }
            );
        }
        //creating a new message
        const newMessage = { content, createdAt: new Date() };
        //todo:-> Check the spelling of the message(message or messages)
        user.message.push(newMessage);
        await user.save();
    } catch (error) {
        console.error("Error finding user", error);
        return Response.json(
            { success: false, message: "Error finding user" },
            { status: 500 }
        );
    }
}
