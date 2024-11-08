import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
export async function sendVerificationEmail(username, email, verifyCode) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username,verifyCode})
          });
        return {
            success: true,
            message: "verification email sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification email", error);
        return { success: false, message: "Error sending verification email" };
    }
}
