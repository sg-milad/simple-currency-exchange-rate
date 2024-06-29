import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ExchangeRateService } from "./exchange.rate.service";
import { RequestService } from "./../shared/request/services/request.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ExchangeRateEntity } from "./entity/exchange.rate.entity";

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([ExchangeRateEntity])],
    providers: [ExchangeRateService, RequestService],
})
export class ExchangeRateModule {}
