import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import Modal from '../../../components/Modal'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const res = await fetch(`${process.env.BASE_URL}/api/plugins/${id}`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  return {
    props: {
      plugin: await res.json(),
    },
  }
}

const Plugin = ({
  plugin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { name, description } = plugin
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Link href="../plugins">
        <button>Plugin list</button>
      </Link>
      <Link href={`/panel/developers/${plugin.authorId}`}>
        <button>Developer</button>
      </Link>
      <h1>{name}</h1>
      <p>{description}</p>
      <button>Download</button>
      <button onClick={() => setVisible(true)}>Modal</button>
      <Modal visible={visible} hide={setVisible}>
        <h1>Test</h1>
      </Modal>
    </div>
  )
}

export default Plugin
