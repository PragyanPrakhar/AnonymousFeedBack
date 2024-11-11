import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const GET = async (request) => {
    const prompt =
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: \"What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?\". Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    try {
        const { text } = await generateText({
            model: google("gemini-1.5-pro-latest"),
            prompt: prompt,
        });

        if (!text) {
            return NextResponse.json({
                success: false,
                message: "No text generated",
            });
        }

        return NextResponse.json({ success: true, message: text });
    } catch (error) {
        console.error("Error generating text:", error);
        return NextResponse.json({
            success: false,
            message: "Error generating text",
            error: error.message,
        });
    }
};
