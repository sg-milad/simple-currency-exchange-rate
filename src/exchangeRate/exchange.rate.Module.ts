import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ExchangeRateService } from "./exchange.rate.service";
import { RequestService } from "./../shared/request/services/request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExchangeRateEntity } from "./entity/exchange.rate.entity";
import { ExchangeRateController } from "./exchange.controller";

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([ExchangeRateEntity])],
    providers: [ExchangeRateService, RequestService],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule {}
