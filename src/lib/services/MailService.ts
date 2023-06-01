import nodemailer from 'nodemailer';

export interface MailServiceConstructorProps {
  user: string;
  password: string;
  from: string;
  to: string;
  subject: string;
  text: string;
}

export class MailService {
  private transporter: nodemailer.Transporter;
  private mailOptions: nodemailer.SendMailOptions;

  constructor(props: MailServiceConstructorProps) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: props.user,
        pass: props.password,
      },
    });

    this.mailOptions = {
      from: props.from,
      to: props.to,
      subject: props.subject,
      text: props.text,
    };
  }

  public async send(): Promise<void> {
    // Check transporter
    if (!this.transporter) {
      throw new Error('No transporter');
    }

    // Check mailOptions
    if (!this.mailOptions) {
      throw new Error('No mailOptions');
    }

    // Send
    await this.transporter.sendMail(this.mailOptions);
  }
}
