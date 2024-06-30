import { Controller, Get, Query } from "@nestjs/common";
import { ExchangeRateService } from "./exchange.rate.service";
import { ExchangeRateDto } from "./dto/exchange.rate.dto";

@Controller()
export class ExchangeRateController {
    constructor(
        private exchangeService: ExchangeRateService
    ) { }

    @Get('convert')
    async convert(@Query('from') data: ExchangeRateDto): Promise<number> {
        const { amount, fromCurrency, toCurrency } = data
        return await this.exchangeService.convert(fromCurrency, toCurrency, amount);
    }
}