import { NextApiRequest, NextApiResponse } from 'next';
import E_Bill from '@/emails/eBill';
import { resend } from '@/lib/resend';
import { BillTableRow } from '@/models/bill';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { bill } = await JSON.parse(req.body);

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: '20520206@gm.uit.edu.vn',
      subject: 'Hóa đơn H&H Bakery',
      react: E_Bill({ bill: bill as BillTableRow }),
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
