import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedModule } from './shared/shared.module'
import { WebhooksModule } from './modules/webhooks/webhooks.module'
import { ProductModule } from './modules/product/product.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    WebhooksModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
