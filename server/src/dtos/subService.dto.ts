import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

class SubServiceDto {
    @IsString()
    @IsNotEmpty()
    public name: string

    @IsBoolean()
    public enable: boolean
}

export { SubServiceDto }
