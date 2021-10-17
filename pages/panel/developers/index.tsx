import { DeveloperUser } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Developer from '../../../components/Developer'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/developers`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  const developers = await res.json()

  return {
    props: { developers },
  }
}

export default function FirstPost(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const router = useRouter()

  useEffect(() => {
    if (!data) {
      router.push('./')
    }
  }, [])

  const { data } = useSession()
  if (data)
    return (
      <div>
        <Link href="./">
          <button>Back</button>
        </Link>
        <table>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
          </tr>
          {props.developers.map((data: DeveloperUser) => (
            <Developer key={data.id} {...data} />
          ))}
        </table>
      </div>
    )

  return null
}
