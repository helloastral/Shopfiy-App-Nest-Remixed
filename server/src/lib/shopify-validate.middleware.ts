import { ShopifyApp } from './shopify-app'
import type { RequestHandler } from 'express'

const validateShopify: (shopify: ShopifyApp) => RequestHandler = (shopify) => {
  return async (req, res, next) => {
    try {
      return shopify.validateAuthenticatedSession()(req, res, next)
    } catch (e) {
      return res.status(401).json({ error: e.message, message: 'Unauthorized' })
    }
  }
}

export default validateShopify
