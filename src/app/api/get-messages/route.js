import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        //Aggregation Pipeline
        const user = await User.aggregate([
            { $match: { _id: userId } }, //matching all the users with the userId
            { $unwind: "$messages" }, //unwinding the messages(like dividing the messages into different parts)
            { $sort: { "messages.createdAt": -1 } }, //sorting into the ascending order
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }, //grouping the messages(like grouping the messages of the same user)
        ]);
        if (!user || user.length == 0) {
            return Response.json(
                { success: false, message: "User Not Found" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, messages: user[0].messages },
            { status: 200 }
        );
    } catch (error) {}
}
