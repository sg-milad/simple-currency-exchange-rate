import { ApiProperty } from "@nestjs/swagger"

export class ExchangeRateDto {
    @ApiProperty({ type: String })
    fromCurrency: string
    @ApiProperty({ type: String })
    toCurrency: string
    @ApiProperty({ type: Number })
    amount: number
}