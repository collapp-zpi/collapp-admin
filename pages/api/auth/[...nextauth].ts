import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaExtendedAdapter } from "../../../config/PrismaExtendedAdapter";

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SMTP_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
  adapter: PrismaExtendedAdapter({
    user: 'AdminUser',
    account: 'AdminAccount',
    session: 'AdminSession',
    verificationRequest: 'AdminVerificationRequest'
  }),
  secret: 'secret',
})
