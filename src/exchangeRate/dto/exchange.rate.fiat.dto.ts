import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator"

export class ExchangeRateFiatDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @Matches(/^[A-Z]{3}$/, {
        message: 'toCurrency must be a valid currency code (3 uppercase letters)'
    })
    fromCurrency: string

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @Matches(/^[A-Z]{3}$/, {
        message: 'toCurrency must be a valid currency code (3 uppercase letters)'
    })
    toCurrency: string

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number
}