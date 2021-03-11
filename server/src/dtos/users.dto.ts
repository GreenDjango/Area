import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsEmail()
    public email: string

    @IsString()
    @MinLength(4)
    public password: string
}
