// @ts-nocheck
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const fistLetterLowercase = (string: string) => string[0].toLowerCase() + string.slice(1)

export const PrismaExtendedAdapter = ({
  user = 'user',
  account = 'account',
  session = 'session',
  verificationRequest = 'verificationRequest'
}) => {
  prisma.user = prisma[fistLetterLowercase(user)]
  prisma.account = prisma[fistLetterLowercase(account)]
  prisma.session = prisma[fistLetterLowercase(session)]
  prisma.verificationRequest = prisma[fistLetterLowercase(verificationRequest)]
  return PrismaAdapter(prisma)
}
/*
export const PrismaExtendedAdapter = ({
  user = 'user',
  account = 'account',
  session = 'session',
  verificationRequest = 'verificationRequest'
}) => PrismaAdapter({
  user: prisma[fistLetterLowercase(user)],
  account: prisma[fistLetterLowercase(account)],
  session: prisma[fistLetterLowercase(session)],
  verificationRequest: prisma[fistLetterLowercase(verificationRequest)],
  ...prisma
})
* */
