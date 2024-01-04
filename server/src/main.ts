import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { getRemixHandler, broadcastOnReady, PUBLIC_PATH } from './remix'
import * as serveStatic from 'serve-static'
import shopify from './lib/shopify-app'
import { unless } from './lib/utils'
import * as expressJs from 'express'

const PORT = parseInt(process.env.PORT || '3000', 10)

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors()

  app.use(
    '/api/*',
    unless('/api/webhooks', shopify.validateAuthenticatedSession()),
  )
  app
    .use('/api/webhooks', expressJs.text({ type: '*/*' }))
    .use(expressJs.json({ limit: '50mb' }))

  app.use(shopify.cspHeaders())

  const express = app.getHttpAdapter().getInstance()

  // Set up Shopify authentication and webhook handling
  express.get(shopify.config.auth.path, shopify.auth.begin())
  express.get(
    shopify.config.auth.callbackPath,
    shopify.auth.callback(),
    shopify.redirectToShopifyOrAppRoot(),
  )

  express.all('*', await getRemixHandler(shopify))

  express.use(serveStatic(PUBLIC_PATH, { index: false }))

  await app.init()

  app.listen(PORT).then(() => {
    console.log(`> Server ready on http://localhost:${PORT}`)

    broadcastOnReady()
  })

  return app
}

bootstrap()
// export default bootstrap
