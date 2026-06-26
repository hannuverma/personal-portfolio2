import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function test() {
  try {
    const response = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_TO,
      subject: 'Test Email',
      html: '<p>Test</p>',
    });
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
