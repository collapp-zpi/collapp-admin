import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import PluginsList from 'includes/components/PluginsList'
import ErrorPage from 'includes/components/ErrorPage'
import NavigationPanel from 'includes/components/NavigationPanel'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import useSWR from 'swr'
import { Pagination } from 'shared/components/Pagination'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/plugins`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })
  const isError = !res.ok

  if (isError) {
    return {
      props: {
        error: await res.json(),
        isError,
      },
    }
  }
  console.log('Static')

  const { entities, pagination } = await res.json()
  return {
    props: { plugins: entities, pagination, isError },
  }
}

export default function Plugins(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  if (props.isError) {
    return <ErrorPage {...props.error}></ErrorPage>
  }
  const router = useRouter()
  const [pageNum, setPageNum] = useState(1)
  const [limit, setLimit] = useState(3)

  const fetcher = (...args) => fetch(...args).then((res) => res.json())

  useEffect(() => {
    let readPageNum = router.query.page ? router.query.page : `${pageNum}`
    if (Array.isArray(readPageNum)) {
      readPageNum = readPageNum[0]
    }
    setPageNum(parseInt(readPageNum, 10))

    let readLimit = router.query.limit ? router.query.limit : `${limit}`
    if (Array.isArray(readLimit)) {
      readLimit = readLimit[0]
    }
    setLimit(parseInt(readLimit, 10))
  }, [])

  const pushWithQuery = (page: number) => {
    router.query.page = `${page}`
    setPageNum(page)
    router.push(`plugins?limit=${limit}&page=${page}`, undefined, {
      shallow: true,
    })
  }

  const { data } = useSWR(
    `../api/plugins?limit=${limit}&page=${pageNum}`,
    fetcher,
  )

  if (!data)
    return (
      <NavigationPanel>
        <LogoSpinner />
      </NavigationPanel>
    )

  const { entities, pagination } = data

  return (
    <NavigationPanel>
      <Link href="../">
        <button>Back</button>
      </Link>
      <PluginsList plugins={entities} />
      <Pagination
        page={pageNum}
        pages={pagination.pages}
        setPage={pushWithQuery}
      ></Pagination>
    </NavigationPanel>
  )
}
