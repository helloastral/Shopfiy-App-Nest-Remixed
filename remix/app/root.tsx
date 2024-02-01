import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react'
import { AppProvider as PolarisAppProvider } from '@shopify/polaris'
import { AppProvider } from '@shopify/shopify-app-remix/react'
import polarisStyles from '@shopify/polaris/build/esm/styles.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: polarisStyles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  {
    rel: 'icon',
    href: '/assets/favicon.ico',
    type: 'image/ico',
  },
]

export const loader = async () => {
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || '',
    polarisTranslations: require(`@shopify/polaris/locales/en.json`),
  })
}

export default function App() {
  const { apiKey, polarisTranslations } = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="shopify-api-key" content={apiKey} />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider isEmbeddedApp apiKey={apiKey}>
          <PolarisAppProvider i18n={polarisTranslations}>
            <ui-nav-menu>
              <Link to="/app" rel="home">
                Home
              </Link>
              <Link to="/app/additional">Additional page</Link>
            </ui-nav-menu>
            <Outlet />
          </PolarisAppProvider>
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
