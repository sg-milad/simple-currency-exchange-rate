import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ExchangeRateIrrDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @IsIn(["USD", "IRR"])
    fromCurrency: string

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    @IsIn(["USD", "IRR"])
    toCurrency: string

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number
}