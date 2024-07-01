import { ConfigService } from "@nestjs/config";
import { TestingModule, Test } from "@nestjs/testing";
import { RequestService } from "./../shared/request/services/request.service";
import { Repository } from "typeorm";
import { ExchangeRateEntity } from "./entity/exchange.rate.entity";
import { ExchangeRateService } from "./exchange.rate.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { createMock } from '@golevelup/ts-jest';
import { AxiosResponse } from "axios";
import { Method } from "axios";
import { RequestInterface } from "src/shared/request/interfaces/request.interface";
import { HttpException } from "@nestjs/common";

const mockExchangeEntity: Partial<ExchangeRateEntity> = {
    fromCurrency: "USD",
    toCurrency: "IRR",
    rate: 100,
    id: 1
}
const mockAxios: RequestInterface = {
    header: {},
    url: "",
    method: "GET"
};
describe('ExchangeRateService', () => {
    let service: ExchangeRateService;
    let repository: Repository<ExchangeRateEntity>;
    let requestService: RequestService
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeRateService,
                RequestService,
                ConfigService,
                {
                    provide: getRepositoryToken(ExchangeRateEntity),
                    useValue: createMock<Repository<ExchangeRateEntity>>(),
                },
            ],
            imports: [HttpModule]

        }).compile();

        service = module.get<ExchangeRateService>(ExchangeRateService);
        repository = module.get<Repository<ExchangeRateEntity>>(getRepositoryToken(ExchangeRateEntity));
        requestService = module.get<RequestService>(RequestService);
    });
    const mockResponse = createMock<ExchangeRateEntity>(mockExchangeEntity)
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should have the repo mocked', () => {
        expect(typeof repository.save).toBe('function');
    });

    describe('fetchIRRToUsdRate', () => {
        it('should fetch IRR to USD rate', async () => {
            const mockResponse = createMock<ExchangeRateEntity>(mockExchangeEntity)

            jest.spyOn(requestService, "request").mockResolvedValueOnce({ usd: { value: 100 } })
            jest.spyOn(service, "fetchIrrToUsdRate").mockResolvedValueOnce(mockResponse)

            const requestResult = await requestService.request(mockAxios)
            const result = await service.fetchIrrToUsdRate();

            expect(result).toBeDefined();
            expect(requestResult.usd.value).toBeDefined()
            expect(result.fromCurrency).toBe('USD');
            expect(result.toCurrency).toBe('IRR');
            expect(result.rate).toBe(100);
        });

        it('should throw HttpException on error', async () => {
            jest.spyOn(RequestService.prototype, 'request').mockRejectedValueOnce(new Error());
            await expect(service.fetchIrrToUsdRate()).rejects.toThrowError();
        });

    });
    describe('fetchFiatExchangeRate', () => {
        it('should fetch fiat exchange rate', async () => {
            mockExchangeEntity.toCurrency = "EUR"
            mockExchangeEntity.rate = 0.85

            jest.spyOn(requestService, 'request').mockResolvedValueOnce({
                rates: {
                    EUR: 0.85
                }
            });
            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockResponse);
            const result = await service.fetchFiatExchangeRate('USD', 'EUR');
            expect(result).toBeDefined();
            expect(result.fromCurrency).toBe('USD');
            expect(result.toCurrency).toBe('EUR');
            expect(result.rate).toBe(0.85);
        });
        it('should throw HttpException on error', async () => {
            jest.spyOn(RequestService.prototype, 'request').mockRejectedValueOnce(new Error());
            await expect(service.fetchFiatExchangeRate("IRR", "USD")).rejects.toThrowError();
        });
    })
    describe('fetchCryptoCurrencyRate', () => {
        it('should fetch crypto exchange rate', async () => {
            mockExchangeEntity.fromCurrency = "USD"
            mockExchangeEntity.toCurrency = "BTC"
            mockExchangeEntity.rate = 50000

            const mockResponse = createMock<ExchangeRateEntity>(mockExchangeEntity)
            jest.spyOn(requestService, 'request').mockResolvedValueOnce({
                BTC: 50000
            });
            jest.spyOn(repository, 'save').mockResolvedValueOnce(mockResponse);

            const result = await service.fetchCryptoCurrencyRate('USD', 'BTC');

            expect(result).toBeDefined();
            expect(result.fromCurrency).toBe('USD');
            expect(result.toCurrency).toBe('BTC');
            expect(result.rate).toBe(50000);
        });

        it('should throw HttpException on error', async () => {
            jest.spyOn(requestService, 'request').mockRejectedValueOnce(new Error());
            await expect(service.fetchCryptoCurrencyRate('USD', 'BTC')).rejects.toThrowError(HttpException);
        });
    });
    describe('convertIrr', () => {
        it('should convert IRR to USD', async () => {

            jest.spyOn(service, 'getRate').mockResolvedValueOnce(null);
            jest.spyOn(service, 'fetchIrrToUsdRate').mockResolvedValueOnce(mockResponse);

            const amountInIrr = 10000;
            const expectedAmountInUsd = { amount: (1 / mockResponse.rate) * amountInIrr };

            const result = await service.convertIrr('IRR', 'USD', amountInIrr);

            expect(result).toBeDefined();
            expect(result.amount).toBe(expectedAmountInUsd.amount);
        });

        it('should convert any currency to another using IRR as an intermediary', async () => {
            jest.spyOn(service, 'getRate').mockResolvedValueOnce(mockResponse);

            const amountInUsd = 100;
            const expectedAmountInIrr = { amount: amountInUsd * mockResponse.rate };

            const result = await service.convertIrr('USD', 'IRR', amountInUsd);

            expect(result).toBeDefined();
            expect(result.amount).toBe(expectedAmountInIrr.amount);
        });
    });
    describe('convertFiat', () => {
        it('should convert fiat currency using existing rate', async () => {
            jest.spyOn(service, 'getRate').mockResolvedValueOnce(mockResponse);

            const amountInUsd = 100;
            const expectedAmountInEur = { amount: amountInUsd * mockResponse.rate };

            const result = await service.convertFiat('USD', 'EUR', amountInUsd);

            expect(result).toBeDefined();
            expect(result.amount).toBe(expectedAmountInEur.amount);
        });

        it('should fetch and convert fiat currency if rate is not available', async () => {
            jest.spyOn(service, 'getRate').mockResolvedValueOnce(null);
            jest.spyOn(service, 'fetchFiatExchangeRate').mockResolvedValueOnce(mockResponse);

            const amountInUsd = 100;
            const expectedAmountInEur = { amount: amountInUsd * mockResponse.rate };

            const result = await service.convertFiat('USD', 'EUR', amountInUsd);

            expect(result).toBeDefined();
            expect(result.amount).toBe(expectedAmountInEur.amount);
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
})  