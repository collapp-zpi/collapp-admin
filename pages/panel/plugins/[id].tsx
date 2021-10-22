import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import Modal from 'shared/components/Modal'
import Button from 'shared/components/button/Button'

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
      <Button onClick={() => setVisible(true)}>Modal</Button>
      <Modal visible={visible} isVisible={setVisible}>
        <h1>What to do?</h1>
        <button
          type="button"
          className="border-2 border-black bg-green-500 p-2 m-2"
        >
          Accept
        </button>
        <button
          type="button"
          className="border-2 border-black bg-red-500 p-2 m-2"
        >
          Reject
        </button>
      </Modal>
    </div>
  )
}

export default Plugin
