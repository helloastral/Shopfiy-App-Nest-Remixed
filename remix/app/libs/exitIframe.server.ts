import { redirect } from '@remix-run/server-runtime'

const APP_BRIDGE_URL = 'https://cdn.shopify.com/shopifycloud/app-bridge.js'
const API_KEY = process.env.SHOPIFY_API_KEY

const exitIframePath = '/exitiframe'

export function decodeHost(host: string): string {
  return atob(host)
}

// https://github.com/Shopify/shopify-api-js/blob/ea7e267dc669cf42c16075e6dd034e2a1f4f597b/packages/shopify-api/lib/utils/shop-validator.ts

const sanitizeHost = (host: string, throwOnInvalid = false): string | null => {
  const base64regex = /^[0-9a-zA-Z+/]+={0,2}$/

  let sanitizedHost = base64regex.test(host) ? host : null
  if (sanitizedHost) {
    const { hostname } = new URL(`https://${decodeHost(sanitizedHost)}`)

    const originsRegex = [
      'myshopify\\.com',
      'shopify\\.com',
      'myshopify\\.io',
      'spin\\.dev',
    ]

    const hostRegex = new RegExp(`\\.(${originsRegex.join('|')})$`)
    if (!hostRegex.test(hostname)) {
      sanitizedHost = null
    }
  }
  if (!sanitizedHost && throwOnInvalid) {
    throw new Error('Received invalid host argument')
  }

  return sanitizedHost
}

export function addDocumentResponseHeaders(
  headers: Headers,
  isEmbeddedApp: boolean,
  shop: string | null | undefined,
) {
  if (shop) {
    headers.set(
      'Link',
      '<https://cdn.shopify.com/shopifycloud/app-bridge.js>; rel="preload"; as="script";',
    )
  }

  if (isEmbeddedApp) {
    if (shop) {
      headers.set(
        'Content-Security-Policy',
        `frame-ancestors https://${shop} https://admin.shopify.com https://*.spin.dev;`,
      )
    }
  } else {
    headers.set('Content-Security-Policy', `frame-ancestors 'none';`)
  }
}

export function renderAppBridge(
  { config }: { config: { appUrl: string } },
  request: Request,
  redirectTo?: { url: string; target?: string },
): never {
  let redirectToScript = ''
  if (redirectTo) {
    const destination = new URL(redirectTo.url, config.appUrl)
    const target = redirectTo.target ?? '_top'

    redirectToScript = `<script>window.open(${JSON.stringify(
      destination.toString(),
    )}, ${JSON.stringify(target)})</script>`
  }

  const responseHeaders = new Headers({
    'content-type': 'text/html;charset=utf-8',
  })
  addDocumentResponseHeaders(
    responseHeaders,
    true,
    new URL(request.url).searchParams.get('shop'),
  )

  throw new Response(
    `
      <script data-api-key="${API_KEY}" src="${APP_BRIDGE_URL}"></script>
      ${redirectToScript}
    `,
    { headers: responseHeaders },
  )
}

export function redirectWithExitIframe(
  request: Request,
  shop: string,
  authPath: string,
): never {
  const url = new URL(request.url)

  const queryParams = url.searchParams
  const host = sanitizeHost(queryParams.get('host')!)

  queryParams.set('shop', shop)
  queryParams.set('exitIframe', `${authPath}?shop=${shop}`)

  if (host) {
    queryParams.set('host', host)
  }

  throw redirect(`${exitIframePath}?${queryParams.toString()}`)
}
