import { LoaderFunction } from '@remix-run/node'
import { redirectWithExitIframe } from '../libs/exitIframe.server'

export const loader: LoaderFunction = ({ request }) => {
  const params = new URL(request.url).searchParams
  const redirectUri = params.get('redirectUri') as string
  const shop = params.get('shop') as string

  if (!redirectUri) throw new Error('redirectUri is required')
  if (!shop) throw new Error('shop is required')

  return redirectWithExitIframe(request, shop, redirectUri)
}
