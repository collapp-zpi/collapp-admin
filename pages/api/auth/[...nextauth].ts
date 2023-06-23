import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from 'shared/utils/prismaClient'
import { PrismaExtendedAdapter } from 'shared/utils/PrismaExtendedAdapter'
import { Resend } from 'resend'
import { SignInTemplate } from 'includes/emailTemplates/sign-in'

const resend = new Resend(process.env.EMAIL_KEY)

export default NextAuth({
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: email,
          subject: 'Sign in to Collapp',
          react: SignInTemplate({ email, redirect: url }),
        })
      },
    }),
  ],
  pages: {
    signIn: '../../',
    error: '../../authError',
    signOut: '../../',
    verifyRequest: '../../',
    newUser: '../../',
  },
  adapter: PrismaExtendedAdapter('admin'),
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user: { email } }) {
      if (!email) return false

      const admin = await prisma.adminUser.findUnique({
        where: { email },
      })

      if (admin) {
        return true
      }
      return false
    },
  },
})
