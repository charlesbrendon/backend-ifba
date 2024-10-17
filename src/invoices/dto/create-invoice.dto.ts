import { IsNumber, IsDateString, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ItemDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;
}

export class CreateInvoiceDto {
  @ApiProperty()
  @IsNumber()
  clientId: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}