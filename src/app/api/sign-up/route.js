import dbConnect from "@/lib/dbConnect";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true,
        });
        if (existingUserVerifiedByUsername) {
            return Response.json(
                { success: false, message: "Username already exists" },
                {
                    status: 400,
                }
            );
        }
        const existingUserByEmail = await User.findOne({
            email,
        });
        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email !!",
                    },
                    {
                        status: 400,
                    }
                );
            }
            //todo:
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.username = username;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                message: [],
            });
            await newUser.save();
        }
        //Send verification email
        const emailResponse = await sendVerificationEmail(
            username,
            email,
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json(
                { success: false, message: emailResponse.message },
                {
                    status: 500,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message:
                    "User registered successfully, Please Verify Your Email",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error creating user", error);
        return Response.json(
            { success: false, message: "Error registering user" },
            {
                status: 500,
            }
        );
    }
}
