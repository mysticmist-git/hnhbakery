import { NextApiRequest, NextApiResponse } from 'next';
import E_Bill from '@/emails/eBill';
import { resend } from '@/lib/resend';
import { BillTableRow } from '@/models/bill';

export default async function POST(req: any, res: NextApiResponse) {
  try {
    const { bill, email, withSale, withSanPham } = req.body;
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      // to: email,
      to: '20520206@gm.uit.edu.vn',
      subject: 'Hóa đơn H&H Bakery',
      react: E_Bill({ bill: bill as BillTableRow, withSale, withSanPham }),
    });

    return res.status(200).json({ message: 'success', status: 200 });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Internal Server Error', status: 500 });
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
