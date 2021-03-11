import { IsNotEmpty } from 'class-validator'

class IdDto {
    @IsNotEmpty()
    public id: string
}

export { IdDto }
