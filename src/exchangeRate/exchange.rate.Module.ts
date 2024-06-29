import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ExchangeRateService } from "./exchange.rate.service";
import { RequestService } from "./../shared/request/services/request.service";

@Module({
    imports: [HttpModule],
    providers: [ExchangeRateService, RequestService]
})
export class ExchangeRateModule { }