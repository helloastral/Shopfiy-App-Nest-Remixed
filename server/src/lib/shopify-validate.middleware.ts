import { ShopifyApp } from './shopify-app'
import type { RequestHandler } from 'express'

const validateShopify: (shopify: ShopifyApp) => RequestHandler = (shopify) => {
  return async (req, res, next) => {
    // if request authorization is basic token then get token
    if (
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Basic'
    ) {
      const token = req.headers.authorization.split(' ')[1]
      if (token === process.env.SELF_API_SECRET) {
        // query.shop
        const shop = req.query.shop as string
        // get shopify session
        const session =
          await shopify.config.sessionStorage.getSessionFromShopName(shop)

        if (session) {
          res.locals.shopify = { session }
          return next()
        }
      }
    }

    return shopify.validateAuthenticatedSession()(req, res, next)
  }
}

export default validateShopify
