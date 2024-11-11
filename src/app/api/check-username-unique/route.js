import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});
export async function GET(request) {
    //Now a days Next automatically handles this thing.
    /* if (request.method !== "GET") {
        return Response.json(
            {
                success: false,
                message: "Only Get Method is allowed",
            },
            {
                status:  405,
            }
        );
    } */
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username"),
        };
        //validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        // console.log("Result is :-> ",result);
        if (!result.success) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid Username",
                },
                {
                    status: 400,
                }
            );
        }
        const { username } = result.data;
        // console.log("Username is :-> ",username);
        const existingVerifiedUser = await User.findOne({
            username,
            isVerified: true,
        });
        // console.log("Existing Verified User is :-> ",existingVerifiedUser);
        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken",
                },
                {
                    status: 200,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Username is unique",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("Error Checking Username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {
                status: 500,
            }
        );
    }
}
