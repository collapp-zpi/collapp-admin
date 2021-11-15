import type { GetServerSidePropsContext } from 'next'
import React from 'react'
import PluginsList from 'includes/components/PluginsList'
import NavigationPanel from 'includes/components/NavigationPanel'
import Button from 'shared/components/button/Button'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import { generateKey } from 'shared/utils/object'
import { useQuery } from 'shared/hooks/useQuery'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { withAuth } from 'shared/hooks/useAuth'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { Pagination } from 'shared/components/Pagination'
import { ErrorInfo } from 'shared/components/ErrorInfo'

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { id } = context.query
  const developerRes = await fetch(
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

  if (!developerRes.ok) {
    return { props: { error: await developerRes.json() } }
  }

  const pluginsRes = await fetch(
    `${process.env.BASE_URL}/api/developers/${id}/plugins`,
    {
      method: 'GET',
      headers: {
        ...(context?.req?.headers?.cookie && {
          cookie: context.req.headers.cookie,
        }),
      },
    },
  )

  if (!pluginsRes.ok) {
    return { props: { error: await pluginsRes.json() } }
  }

  return {
    props: {
      fallback: {
        [generateKey('developers', String(id))]: await developerRes.json(),
        [generateKey('developers', String(id), 'plugins')]:
          await pluginsRes.json(),
      },
    },
  }
}

const Developer = () => {
  const [, setFilters] = useFilters()
  const router = useRouter()
  const pathId = String(router.query.id)
  const developer = useQuery(
    ['developers', pathId],
    `/api/developers/${pathId}`,
    {
      ignoreFilters: true,
    },
  )
  const developerPlugins = useQuery(
    ['developers', pathId, 'plugins'],
    `/api/developers/${pathId}/plugins`,
  )

  return (
    <div>
      <Head>
        <title>Developer</title>
      </Head>
      <NavigationPanel>
        <Button color="light" onClick={() => router.back()}>
          <MdOutlineArrowBackIosNew className="mr-2 -ml-2" />
          Back
        </Button>
        {developer.error ? (
          <div className="mt-12">
            <ErrorInfo error={developer.error} />
          </div>
        ) : !developer.data ? (
          <div className="m-auto p-12">
            <LogoSpinner />
          </div>
        ) : (
          <div className="m-auto">
            <div className="flex bg-white shadow-2xl p-8 rounded-3xl items-center my-4">
              <img
                src={developer.data.image}
                alt="User image"
                className="w-36 h-36 rounded-25 border-2 border-gray-200"
              />
              <div className="flex flex-col ml-8">
                <h1 className="text-3xl font-bold">{developer.data.name}</h1>
                {developer.data?.email && (
                  <p className="mt-2">{developer.data.email}</p>
                )}
              </div>
            </div>
            {developerPlugins.error ? (
              <div className="mt-12">
                <ErrorInfo error={developer.error} />
              </div>
            ) : !developerPlugins.data ? (
              <div className="m-auto p-12">
                <LogoSpinner />
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-2xl p-8 mb-4">
                <h2 className="text-xl font-bold ml-2 mb-4">
                  Developer's plugins:
                </h2>
                {!developerPlugins.data.entities.length ? (
                  <p>Developers hasn't created any plugins yet</p>
                ) : (
                  <>
                    <PluginsList
                      plugins={developerPlugins.data.entities}
                      isCompact={true}
                    />
                    <div className="mt-6">
                      <Pagination
                        page={developerPlugins.data.pagination.page}
                        pages={developerPlugins.data.pagination.pages}
                        setPage={(page) => setFilters({ page: String(page) })}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </NavigationPanel>
    </div>
  )
}

export default withAuth(withFilters(Developer, ['limit', 'page']))
