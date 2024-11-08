import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        match: [/.+\@.+\..+/, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    verifyCode: {
        type: String,
        required: [true, "Please provide a verification code"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verifyCodeExpiry: {
        date,
        required: [true, "Verify Code Expiry is required"],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    message: [MessageSchema],
});

const User = mongoose.models.users || mongoose.model("users", UserSchema);
export default User;
