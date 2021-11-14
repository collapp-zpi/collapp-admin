import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from 'shared/utils/prismaClient'
import { PrismaExtendedAdapter } from 'shared/utils/PrismaExtendedAdapter'
import { LoginEmail } from '@collapp/email-sdk'

export default NextAuth({
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        await fetch('https://collapp-email-microservice.herokuapp.com/')
        const mail = new LoginEmail(process.env.RABBIT_URL)
        await mail.send({
          to: email,
          subject: 'Sign in to Collapp',
          secret: process.env.SECRET,
          context: { email, url },
        })
        mail.disconnect()
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
  secret: process.env.AUTH_EMAIL_SECRET,
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
