import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React, { useState } from 'react'
import Modal from 'shared/components/Modal'
import Button from 'shared/components/button/Button'
import ErrorPage from 'includes/components/ErrorPage'

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

  const isError = !res.ok

  if (isError) {
    return { props: { error: await res.json(), isError } }
  }

  return {
    props: {
      plugin: await res.json(),
      isError: !res.ok,
    },
  }
}

const Plugin = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  if (props.isError) {
    return <ErrorPage {...props.error}></ErrorPage>
  }

  const { name, description } = props.plugin
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <Link href="../plugins">
        <button>Plugin list</button>
      </Link>
      <Link href={`/panel/developers/${props.plugin.authorId}`}>
        <button>Developer</button>
      </Link>
      <h1>{name}</h1>
      <p>{description}</p>
      <button>Download</button>
      <Button onClick={() => setVisible(true)}>Modal</Button>
      <Modal visible={visible}>
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
