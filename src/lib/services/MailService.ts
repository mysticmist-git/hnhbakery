import { BillTableRow } from '@/models/bill';
// import nodemailer from 'nodemailer';
import { useBillTableRow } from '../hooks/useBillTableRow';

export interface MailServiceConstructorProps {
  user: string;
  password: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}

// export class MailService {
//   private transporter: nodemailer.Transporter;
//   private mailOptions: nodemailer.SendMailOptions;

//   constructor(props: MailServiceConstructorProps) {
//     this.transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: props.user,
//         pass: props.password,
//       },
//     });

//     this.mailOptions = {
//       from: props.from,
//       to: props.to,
//       subject: props.subject,
//       text: props.text,
//     };
//   }

//   public async send(): Promise<void> {
//     // Check transporter
//     if (!this.transporter) {
//       throw new Error('No transporter');
//     }

//     // Check mailOptions
//     if (!this.mailOptions) {
//       throw new Error('No mailOptions');
//     }

//     // Send
//     await this.transporter.sendMail(this.mailOptions);
//   }
// }

export async function sendBillToEmail(bill: BillTableRow): Promise<void> {
  const data = await useBillTableRow(bill);
  console.log(data);

  return await fetch('/api/sendBillToEmail', {
    method: 'POST',
    body: JSON.stringify({
      bill: data,
    }),
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
}
