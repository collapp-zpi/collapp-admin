import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
} from '@react-email/components'
import { Font } from '@react-email/font'

export const InviteTemplate = ({
  from,
  space,
  redirect,
}: {
  from: string
  space: string
  redirect: string
}) => (
  <Html>
    <Head>
      <Font
        fontFamily="Poppins"
        fallbackFontFamily="Arial"
        webFont={{
          url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2',
          format: 'woff2',
        }}
        fontWeight={500}
        fontStyle="normal"
      />
      <Font
        fontFamily="Poppins"
        fallbackFontFamily="Arial"
        webFont={{
          url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFd2JQEk.woff2',
          format: 'woff2',
        }}
        fontWeight={700}
        fontStyle="bold"
      />
    </Head>
    <Preview>New invitation in Collapp 👀</Preview>
    <Tailwind>
      <Body className="bg-gray-200 p-8 text-gray-600 font-sans">
        <Container className="bg-gray-50 max-w-3xl mx-auto p-8 rounded-3xl text-center">
          <Section>
            <Img
              src="https://collapp.live/logo.png"
              className="h-8 w-8 mx-auto opacity-20 mb-6"
            />
            <h1 className="text-4xl font-bold text-blue-500 mb-6">
              Hello, there! 👋
            </h1>
            <div className="text-lg mb-4">
              <strong>{from}</strong> invites you to join{' '}
              <strong>{space}</strong>
            </div>
            <Button
              href={redirect}
              className="px-6 py-3 bg-blue-500 mx-auto rounded-xl font-bold text-white cursor-pointer hover:bg-blue-600 shadow-xl transition-colors"
              target="_blank"
            >
              See the invite
            </Button>
          </Section>

          <div className="text-gray-400 text-xs mt-12">
            If you believe this email was delivered by mistake, you can safely
            ignore it.
          </div>
          <div className="text-gray-400 text-sm">
            Your friends at{' '}
            <a href="https://collapp.live">
              <strong>Collapp</strong>
            </a>
          </div>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
