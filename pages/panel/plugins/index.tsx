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
import { UncontrolledForm } from 'shared/components/form/UncontrolledForm'
import { object, string } from 'yup'
import { InputText } from 'shared/components/input/InputText'
import { useRouter } from 'next/router'
import { AutoSubmit } from 'shared/components/form/AutoSubmit'

const schema = object().shape({
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
  const router = useRouter()
  const [, setFilters] = useFilters()
  const { data } = useQuery('plugins', '../api/plugins')

  if (props.isError) {
    return <ErrorPage {...props.error} />
  }

  return (
    <NavigationPanel>
      <Link href="../">
        <button>Back</button>
      </Link>
      <UncontrolledForm
        schema={schema}
        query={setFilters}
        initial={objectPick(router.query, ['name'])}
      >
        <InputText name="name" label="Plugin name" />
        <AutoSubmit />
      </UncontrolledForm>
      {!data && <LogoSpinner />}
      {!!data && (
        <>
          <PluginsList plugins={data?.entities} />
          <Pagination
            page={data?.pagination.page}
            pages={data?.pagination.pages}
            setPage={(page) => setFilters({ page })}
          />
        </>
      )}
    </NavigationPanel>
  )
}

export default withFilters(Plugins, ['limit', 'page', 'name'])
