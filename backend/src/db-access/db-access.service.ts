import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from "cache-manager";
import { Repository } from "typeorm";

import { Receipt } from "./entities";

const receiptCacheKeyPrefix = "eth-aptos-bridge-receipt";

@Injectable()
export class DBAccessService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(Receipt)
    private readonly userRepository: Repository<Receipt>
  ) {}
}
