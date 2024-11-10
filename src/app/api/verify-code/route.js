import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";

export async function GET(request) {
    await dbConnect();
    try {
        const { username, code } = await request.josn();
        const decodedUsername = decodeURIComponent(username);
        const user = await User.findOne({
            username: decodedUsername,
        });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }
        const isCodeValid =
            user.verifyCode === code && user.verifyCodeExpiry > Date.now();
        if (isCodeValid) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "User Verified Successfully",
                },
                {
                    status: 200,
                }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid Code or Code expired",
                },
                {
                    status: 400,
                }
            );
        }
    } catch (error) {
        console.log("Error Verifying User", error);
        return Response.json(
            {
                success: false,
                message: "Error Verifying User",
            },
            {
                status: 500,
            }
        );
    }
}
