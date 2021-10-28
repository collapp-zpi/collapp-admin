import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import PluginsList from 'includes/components/PluginsList'
import NavigationPanel from 'includes/components/NavigationPanel'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import useSWR from 'swr'
import { Pagination } from 'shared/components/Pagination'
import { useFilters, withFilters } from 'shared/hooks/useFilters'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const search = new URLSearchParams(context.query)
  const res = await fetch(`${process.env.BASE_URL}/api/plugins?${search}`, {
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

  return {
    props: {
      fallback: await res.json(),
      isError,
    },
  }
}

const useQuery = (key: string[] | string, path: string) => {
  const [filters] = useFilters()
  const filteredSearch = Object.entries(filters).reduce(
    (acc, [key, value]) =>
      value == null
        ? acc
        : {
            ...acc,
            [key]: value,
          },
    {},
  )
  const search = new URLSearchParams(filteredSearch)

  return useSWR(
    [...(Array.isArray(key) ? key : [key]), JSON.stringify(filters)],
    () => fetch(`${path}?` + search).then((res) => res.json()),
  )
}

function Plugins(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  // if (props.isError) {
  //   return <ErrorPage {...props.error}></ErrorPage>
  // }
  const [, setFilters] = useFilters()
  const { data } = useQuery('plugins', '../api/plugins')
  // console.log(data)

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
        page={pagination.page}
        pages={pagination.pages}
        setPage={(page) => setFilters({ page })}
      />
    </NavigationPanel>
  )
}

export default withFilters(Plugins, ['limit', 'page'])
