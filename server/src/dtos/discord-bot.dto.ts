import { IsNotEmpty, IsString } from 'class-validator'

class DiscordBotDto {
    @IsString()
    @IsNotEmpty()
    public token: string
}

export { DiscordBotDto }
