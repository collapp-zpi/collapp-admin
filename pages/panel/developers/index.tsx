import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import React from 'react'
import ErrorPage from 'includes/components/ErrorPage'
import NavigationPanel from 'includes/components/NavigationPanel'
import { generateKey, objectPick } from 'shared/utils/object'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { useRouter } from 'next/router'
import { useQuery } from 'shared/hooks/useQuery'
import { Pagination } from 'shared/components/Pagination'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import LoadingSessionLayout from 'includes/components/LoadingSession'
import Head from 'next/head'
import { DeveloperUser } from '@prisma/client'
import { truncate } from 'shared/utils/text'

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
            <div className="bg-white px-8 py-4 rounded-3xl shadow-2xl overflow-x-auto">
              <table className="flex-1 w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {data.entities.map((developer: DeveloperUser) => (
                    <Link
                      key={developer.id}
                      href={`/panel/developers/${developer.id}`}
                      passHref
                    >
                      <tr className="bg-blue-500 bg-opacity-0 hover:bg-opacity-10 cursor-pointer transition-colors">
                        <td className="p-4 flex items-center">
                          <img
                            src={developer.image || '/collapp.svg'}
                            className="shadow-lg mr-3 bg-gray-150 rounded-25 bg-white w-8 h-8"
                            alt="Developer image"
                          />
                          {truncate(developer?.name ?? '', 50)}
                        </td>
                        <td className="p-4">
                          {truncate(developer?.email ?? '', 50)}
                        </td>
                      </tr>
                    </Link>
                  ))}
                </tbody>
              </table>
            </div>
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
