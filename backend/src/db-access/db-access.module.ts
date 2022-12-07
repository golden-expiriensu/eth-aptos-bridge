import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as redisStore from "cache-manager-redis-store";

import { DBAccessService } from "./db-access.service";
import { Receipt } from "./entities";

@Module({
  imports: [
    CacheModule.register({
      store: redisStore.create({
        // @ts-ignore
        ttl: 60 * 60 * 24 * 10, // 10 days
      }),
      socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST || "localhost",
      port: Number(process.env.POSTGRES_PORT || 5432),
      username: process.env.POSTGRES_USER_NAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_BASE_NAME,
      entities: [Receipt],
      synchronize: Boolean(process.env.POSTGRES_SYNCHRONIZE || false),
    }),
    TypeOrmModule.forFeature([Receipt]),
  ],
  providers: [DBAccessService],
  controllers: [],
  exports: [DBAccessService],
})
export class DBAccessModule {}
