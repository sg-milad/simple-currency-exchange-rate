import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ExchangeRateFiatDto {
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    fromCurrency: string

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => value.toUpperCase())
    toCurrency: string

    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    amount: number
}