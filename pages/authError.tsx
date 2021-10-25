import ErrorPage from 'components/ErrorPage'
import { useRouter } from 'next/router'
import React from 'react'
import { translate } from 'utils/errPageCodesTranslate'

export default function Error() {
  const router = useRouter()
  const error = router.query.error ? router.query.error : 'Forbidden'

  let msg = ''
  if (Array.isArray(error)) {
    msg = error[0]
  } else {
    msg = error
  }

  return <ErrorPage statusCode={401} message={translate(msg)}></ErrorPage>
}
