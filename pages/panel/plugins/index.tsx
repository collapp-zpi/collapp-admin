import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import PluginsList from 'includes/components/PluginsList'
import NavigationPanel from 'includes/components/NavigationPanel'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { Pagination } from 'shared/components/Pagination'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { generateKey, objectPick } from 'shared/utils/object'
import ErrorPage from 'includes/components/ErrorPage'
import { useQuery } from 'shared/hooks/useQuery'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = objectPick(context.query, ['limit', 'page'])
  const search = new URLSearchParams(params)

  const res = await fetch(`${process.env.BASE_URL}/api/plugins?${search}`, {
    method: 'GET',
    headers: {
      ...(context?.req?.headers?.cookie && {
        cookie: context.req.headers.cookie,
      }),
    },
  })

  if (!res.ok) {
    return {
      props: {
        error: await res.json(),
        isError: true,
      },
    }
  }
  console.log('Static')

  return {
    props: {
      fallback: {
        [generateKey('plugins', params)]: await res.json(),
      },
    },
  }
}

function Plugins(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  if (props.isError) {
    return <ErrorPage {...props.error} />
  }
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
