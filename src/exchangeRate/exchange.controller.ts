import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ExchangeRateService } from "./exchange.rate.service";
import { ExchangeRateIrrDto } from "./dto/exchange.rate.irr.dto";
import { ExchangeRateFiatDto } from "./dto/exchange.rate.fiat.dto";
import { ExchangeRateInterceptor } from "src/shared/Interceptors/exchange.rate.interceptor";

@Controller("/exchange/convert")
@UseInterceptors(ExchangeRateInterceptor)
export class ExchangeRateController {
    constructor(
        private exchangeService: ExchangeRateService
    ) { }

    @Get('fiat/irr')
    async convertIrr(@Query() data: ExchangeRateIrrDto) {
        const { amount, fromCurrency, toCurrency } = data
        return await this.exchangeService.convertIrr(fromCurrency, toCurrency, amount);
    }
    @Get('fiat')
    async convertFiat(@Query() data: ExchangeRateFiatDto) {
        const { amount, fromCurrency, toCurrency } = data
        return await this.exchangeService.convertFiat(fromCurrency, toCurrency, amount);
    }

    @Get('crypto')
    async convertCryptoCurrency(@Query() data: ExchangeRateFiatDto) {
        const { amount, fromCurrency, toCurrency } = data
        return await this.exchangeService.convertCryptoCurrency(fromCurrency, toCurrency, amount);
    }
}