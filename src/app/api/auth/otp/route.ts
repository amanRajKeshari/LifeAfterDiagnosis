import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || '',
            },
        });

        // Setup email data
        const mailOptions = {
            from: process.env.SMTP_USER || '"Life After Diagnosis" <no-reply@lifeafterdiagnosis.com>',
            to: email,
            subject: 'Your Verification Code - Life After Diagnosis',
            html: `
                <div style="font-family: Arial, sans-serif; max-w-md mx-auto p-8 rounded-xl border border-gray-200">
                    <h2 style="color: #FF2E63;">Verify Your Email</h2>
                    <p>Thank you for joining the Life After Diagnosis network.</p>
                    <p>Please use the following 6-digit code to complete your registration or login:</p>
                    <div style="background: #f4f4f4; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111;">${otp}</span>
                    </div>
                    <p>If you did not request this code, please ignore this email.</p>
                </div>
            `,
        };

        // If credentials are completely missing, throw immediately
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("Missing SMTP_USER or SMTP_PASS in environment variables.");
            return NextResponse.json(
                { message: "Server email configuration is missing. Add SMTP_USER and SMTP_PASS to .env.local" },
                { status: 500 }
            );
        }

        // Send actual email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "OTP sent successfully", otp });

    } catch (error: any) {
        console.error("OTP Error:", error);
        return NextResponse.json({ message: "Failed to send OTP", error: error.message }, { status: 500 });
    }
}
