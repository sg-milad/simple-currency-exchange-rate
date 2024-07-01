import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { RequestService } from "./../shared/request/services/request.service";
import { InjectRepository } from "@nestjs/typeorm";
import { ExchangeRateEntity } from "./entity/exchange.rate.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ExchangeRateService {
    constructor(
        private requestService: RequestService,
        @InjectRepository(ExchangeRateEntity)
        private readonly exchangeRepository: Repository<ExchangeRateEntity>,
        private configService: ConfigService,
    ) {}

    async saveExchangeRate(exchangeRate: Partial<ExchangeRateEntity>) {
        return await this.exchangeRepository.save(exchangeRate);
    }

    async fetchIrrToUsdRate() {
        try {
            const apiKey = this.configService.get("apiKey.navasan");
            const response = await this.requestService.request({
                method: "GET",
                url: `http://api.navasan.tech/latest/?api_key=${apiKey}`,
            });

            return await this.saveExchangeRate({ fromCurrency: "USD", toCurrency: "IRR", rate: response.usd.value });
        } catch (error) {
            throw new HttpException("Could not fetch IRR rate ", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async fetchFiatExchangeRate(base: string, toCurrency: string) {
        try {
            const apiKey = this.configService.get("apiKey.beacon");
            const response = await this.requestService.request({
                method: "GET",
                url: `https://api.currencybeacon.com/v1/latest/?base=${base.toUpperCase()}&&api_key=${apiKey}`,
            });
            return await this.saveExchangeRate({
                fromCurrency: base.toUpperCase(),
                toCurrency: toCurrency.toUpperCase(),
                rate: response.rates[toCurrency.toUpperCase()],
            });
        } catch (error) {
            throw new HttpException("Could not fetch rate", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async fetchCryptoCurrencyRate(fromCurrency: string, toCurrency: string = "USDT") {
        try {
            const apiKey = this.configService.get("apiKey.compare");
            const api = `https://min-api.cryptocompare.com/data/price?fsym=${fromCurrency}&tsyms=${toCurrency}`;
            const response = await this.requestService.request({
                method: "GET",
                url: api,
                header: {
                    Accept: "application/json",
                    Authorization: `Apikey ${apiKey}`,
                },
            });

            return await this.saveExchangeRate({
                fromCurrency: fromCurrency.toUpperCase(),
                toCurrency: toCurrency.toUpperCase(),
                rate: response[toCurrency.toUpperCase()],
            });
        } catch (error) {
            throw new HttpException("Could not fetch cryptocurrency rate", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async convertIrr(fromCurrency: string, toCurrency: string, amount: number) {
        const fetchOrGetRate = async (from: string, to: string) => {
            let rate = await this.getRate(from, to);
            if (!rate) {
                rate = await this.fetchIrrToUsdRate();
            }
            return rate.rate;
        };

        if (fromCurrency === "IRR" && toCurrency === "USD") {
            const rate = await fetchOrGetRate("USD", "IRR");
            return { amount: (1 / rate) * amount };
        }

        const rate = await fetchOrGetRate(fromCurrency, toCurrency);
        return { amount: amount * rate };
    }

    async convertFiat(fromCurrency: string, toCurrency: string, amount: number) {
        let getRate = await this.getRate(fromCurrency, toCurrency);
        if (!getRate) {
            getRate = await this.fetchFiatExchangeRate(fromCurrency, toCurrency);
        }
        return { amount: amount * getRate.rate };
    }
    async convertCryptoCurrency(fromCurrency: string, toCurrency: string, amount: number) {
        let getRate = await this.getRate(fromCurrency, toCurrency);
        if (!getRate) {
            getRate = await this.fetchCryptoCurrencyRate(fromCurrency, toCurrency);
        }
        return { amount: amount * getRate.rate };
    }

    async getRate(fromCurrency: string, toCurrency: string) {
        const rate = await this.exchangeRepository.findOne({ where: { fromCurrency, toCurrency } });
        return rate ?? null;
    }
}
