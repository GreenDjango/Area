import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator'
import { taskList } from '../interfaces/task.abstract'

class SocketInDto {
    @IsString()
    @IsNotEmpty()
    public property: string

    @IsNumber()
    @IsPositive()
    public nodeId: number

    @IsString()
    @IsNotEmpty()
    public targetProperty: string
}

class NodeDto {
    @IsInt()
    @IsPositive()
    public id: number

    @IsOptional()
    @IsBoolean()
    public isTrigger?: boolean

    @IsEnum(taskList)
    public type: number

    @IsOptional()
    @IsArray()
    public data: [string, string][]

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    public input: SocketInDto[]
}

class CreateActionDto {
    @IsArray()
    @ValidateNested({ each: true })
    public nodes: NodeDto[]

    @IsString()
    @IsNotEmpty()
    public name: string

    @IsDateString()
    public updated: Date

    @IsString()
    public rowData: string
}

class ModifyActionDto {
    @IsString()
    @IsNotEmpty()
    public id: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    public nodes?: NodeDto[]

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    public name?: string

    @IsOptional()
    @IsDateString()
    public updated?: Date

    @IsOptional()
    @IsBoolean()
    public enable?: boolean

    @IsOptional()
    @IsString()
    public rowData?: any
}

export { ModifyActionDto, CreateActionDto, NodeDto }
