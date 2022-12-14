import { NestFactory } from '@nestjs/core'
import { readFileSync } from 'fs'
import { join } from 'path'

import { AppModule } from './app.module'

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(join(process.env.CERTS_PATH, 'key.pem')),
    cert: readFileSync(join(process.env.CERTS_PATH, 'cert.pem')),
  }
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  })
  app.enableCors()
  await app.listen(3000)
}

bootstrap()
