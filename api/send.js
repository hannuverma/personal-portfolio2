import {Resend} from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }



  try {
    const { email, name, message } = req.body;

    // Validation check
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Use Resend's default testing domain
      to: process.env.EMAIL_TO,            // Where you want to receive the portfolio emails
      subject: `New Portfolio Message from ${name || 'Anonymous'}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}