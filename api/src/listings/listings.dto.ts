import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateListingDto {
  @IsString() @MinLength(3) title: string;
  @IsOptional() @IsString() brand?: string;
  @IsOptional() @IsString() description?: string;
  @IsInt() @Min(0) pricePesewas: number;
  @IsInt() categoryId: number;
  @IsOptional() @IsIn(['new', 'used', 'refurbished']) condition?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100000) stock?: number;
  @IsOptional() @IsBoolean() allowPreorder?: boolean;
  @IsOptional() @IsString() city?: string;
}
