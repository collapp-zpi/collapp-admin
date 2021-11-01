import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import DevelopersList from 'includes/components/DevelopersList'
import ErrorPage from 'includes/components/ErrorPage'
import NavigationPanel from 'includes/components/NavigationPanel'
import { generateKey, objectPick } from 'shared/utils/object'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { useRouter } from 'next/router'
import { useQuery } from 'shared/hooks/useQuery'
import Button from 'shared/components/button/Button'
import { Pagination } from 'shared/components/Pagination'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import LoadingSessionLayout from 'includes/components/LoadingSession'
import Head from 'next/head'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = objectPick(context.query, ['limit', 'page'])
  const search = new URLSearchParams(params)

  const res = await fetch(`${process.env.BASE_URL}/api/developers?${search}`, {
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

  return {
    props: {
      fallback: {
        [generateKey('developers', params)]: await res.json(),
      },
    },
  }
}

function Developers(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const router = useRouter()
  const [, setFilters] = useFilters()
  const { data } = useQuery('developers', '/api/developers')

  if (props.isError) {
    return (
      <LoadingSessionLayout>
        <ErrorPage {...props.error} />
      </LoadingSessionLayout>
    )
  }

  return (
    <div>
      <Head>
        <title>Developers</title>
      </Head>
      <NavigationPanel>
        <Button onClick={() => router.back()} className="mr-auto mt-3 ml-3">
          <MdOutlineArrowBackIosNew className="mr-2 -ml-2" />
          Back
        </Button>
        {!data && (
          <div className="m-auto">
            <LogoSpinner />
          </div>
        )}
        {!!data && !data.entities?.length && (
          <div className="bg-white p-12 rounded-3xl shadow-2xl text-gray-400 text-center text-lg m-auto">
            No developers found
          </div>
        )}
        {!!data && !!data.entities?.length && (
          <>
            <DevelopersList developers={data?.entities} />
            <div className="mb-6">
              <Pagination
                page={data?.pagination.page}
                pages={data?.pagination.pages}
                setPage={(page) => setFilters({ page: String(page) })}
              />
            </div>
          </>
        )}
      </NavigationPanel>
    </div>
  )
}

export default withFilters(Developers, ['limit', 'page'])
