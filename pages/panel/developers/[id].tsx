import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import PluginsList from '../../../components/PluginsList'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const developer = await fetch(
    `${process.env.BASE_URL}/api/developers/${id}`,
    {
      method: 'GET',
      headers: {
        ...(context?.req?.headers?.cookie && {
          cookie: context.req.headers.cookie,
        }),
      },
    },
  )

  const plugins = await fetch(`${process.env.BASE_URL}/api/plugins`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })

  return {
    props: {
      developer: await developer.json(),
      plugins: await plugins.json(),
    },
  }
}

const Developer = ({
  developer,
  plugins,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { image, name, email } = developer

  return (
    <>
      <div>
        <Link href="./">
          <button>Developer list</button>
        </Link>
      </div>
      <div>
        <img src={image} alt="" />
        <h1>{name}</h1>
        <p>{email}</p>
        <hr />
        <PluginsList plugins={plugins}></PluginsList>
      </div>
    </>
  )
}

export default Developer
