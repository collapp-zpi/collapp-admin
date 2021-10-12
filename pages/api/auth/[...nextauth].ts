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
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    //signIn: "../../",
    error: "../../error",
  },
  adapter: PrismaExtendedAdapter("admin"),
  secret: "secret",
  callbacks: {
    async signIn({ user: { email }, email: { verificationRequest } }) {
      // if user attempts to send a verification email
      if (verificationRequest) {
        // check if there is a user with that email
        return true;
      }
      return true;
    },
  },
});
