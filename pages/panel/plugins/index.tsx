import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React from 'react'
import PluginsList from 'includes/components/PluginsList'
import NavigationPanel from 'includes/components/NavigationPanel'
import { LogoSpinner } from 'shared/components/LogoSpinner'
import { Pagination } from 'shared/components/Pagination'
import { useFilters, withFilters } from 'shared/hooks/useFilters'
import { generateKey, objectPick } from 'shared/utils/object'
import ErrorPage from 'includes/components/ErrorPage'
import { useQuery } from 'shared/hooks/useQuery'
import { object, string } from 'yup'
import { InputText } from 'shared/components/input/InputText'
import { FiltersForm } from 'shared/components/form/FiltersForm'
import { AiOutlineSearch } from 'react-icons/ai'
import Button from 'shared/components/button/Button'
import { useRouter } from 'next/router'
import LoadingSessionLayout from 'includes/components/LoadingSession'

const filtersSchema = object().shape({
  name: string().default(''),
})

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = objectPick(context.query, ['limit', 'page', 'name'])
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
  const router = useRouter()
  const [, setFilters] = useFilters()
  const { data } = useQuery('plugins', '/api/plugins')

  if (props.isError) {
    return (
      <LoadingSessionLayout>
        <ErrorPage {...props.error} />
      </LoadingSessionLayout>
    )
  }

  return (
    <NavigationPanel>
      <Button onClick={() => router.push('/')} className="mr-auto my-3 ml-3">
        Back
      </Button>
      <FiltersForm schema={filtersSchema}>
        <InputText icon={AiOutlineSearch} name="name" label="Plugin name" />
      </FiltersForm>
      {!data && (
        <div className="m-auto">
          <LogoSpinner />
        </div>
      )}
      {!!data && !data.entities?.length && (
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-400 text-center text-lg m-auto">
          No plugins found
        </div>
      )}
      {!!data && !!data.entities?.length && (
        <>
          <PluginsList plugins={data?.entities} />
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
  )
}

export default withFilters(Plugins, ['limit', 'page', 'name'])
