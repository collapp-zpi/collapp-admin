import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React from 'react'
import NavigationPanel from 'includes/components/NavigationPanel'
import { generateKey, objectPick } from 'shared/utils/object'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { useQuery } from 'shared/hooks/useQuery'
import { Pagination } from 'shared/components/Pagination'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import Head from 'next/head'
import { DeveloperUser } from '@prisma/client'
import { truncate } from 'shared/utils/text'
import { ErrorInfo } from 'shared/components/ErrorInfo'
import { withAuth } from 'shared/hooks/useAuth'
import { defaultUserIcon } from 'shared/utils/defaultIcons'

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
      props: { error: await res.json() },
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

function Developers() {
  const [, setFilters] = useFilters()
  const { data, error } = useQuery('developers', '/api/developers')

  return (
    <div>
      <Head>
        <title>Developers</title>
      </Head>
      <NavigationPanel>
        {!!error ? (
          <div className="mt-12">
            <ErrorInfo error={error} />
          </div>
        ) : !data ? (
          <div className="m-auto p-12">
            <LogoSpinner />
          </div>
        ) : !data.entities?.length ? (
          <div className="bg-white p-20 rounded-3xl shadow-2xl text-gray-600 text-center text-lg m-auto">
            No developers found
          </div>
        ) : (
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
                            src={developer.image || defaultUserIcon}
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
            <div className="mt-6">
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

export default withAuth(withFilters(Developers, ['limit', 'page']))
