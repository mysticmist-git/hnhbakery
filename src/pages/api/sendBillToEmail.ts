import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import AirbnbReviewEmail from '@/emails/welcome';
import { resend } from '@/lib/resend';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: '20520206@gm.uit.edu.vn',
      subject: 'hello world',
      react: AirbnbReviewEmail({}),
    });

    return res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
    // Use 'edge' runtime
    // More details: https://nextjs.org/docs/api-routes/edge-api-routes
    runtime: 'edge',
  },
};
