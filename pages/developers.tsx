import { DeveloperUser } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import React from 'react'
import Developer from '../components/Developer'

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
  const { data } = useSession()
  if (data)
    return (
      <>
        <table>
          {props.developers.map((data: DeveloperUser) => (
            <Developer key={data.id} {...data} />
          ))}
        </table>
      </>
    )

  return null
}
