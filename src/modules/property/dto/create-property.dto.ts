import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType, PropertySize, FurnishingType } from '../../../common/enums';

export class CreatePropertyDto {
  @ApiProperty({
    description: 'Property title',
    example: 'Luxury 3 Bedroom Apartment in Lekki',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed property description',
    example: 'Beautiful modern apartment with sea view, fully furnished with premium appliances',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of property',
    example: 'apartment',
    enum: PropertyType,
  })
  @IsEnum(PropertyType)
  @IsNotEmpty()
  type: PropertyType;

  @ApiProperty({
    description: 'Property price in Naira',
    example: 45000000,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Full address of the property',
    example: '15 Admiralty Way, Lekki Phase 1',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'City',
    example: 'Lagos',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'State',
    example: 'Lagos',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'Nigeria',
    type: String,
    default: 'Nigeria',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    description: 'Latitude coordinate',
    example: 6.4474,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({
    description: 'Longitude coordinate',
    example: 3.4702,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({
    description: 'Number of bedrooms',
    example: 3,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @ApiPropertyOptional({
    description: 'Number of bathrooms',
    example: 2,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @ApiPropertyOptional({
    description: 'Area in square meters',
    example: 150.5,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  areaSqm?: number;

  @ApiPropertyOptional({
    description: 'Property size category',
    example: PropertySize.MEDIUM,
    enum: PropertySize,
  })
  @IsEnum(PropertySize)
  @IsOptional()
  propertySize?: PropertySize;

  @ApiPropertyOptional({
    description: 'Furnishing type',
    example: FurnishingType.FURNISHED,
    enum: FurnishingType,
  })
  @IsEnum(FurnishingType)
  @IsOptional()
  furnishing?: FurnishingType;

  @ApiPropertyOptional({
    description: 'Array of amenities',
    example: ['Swimming Pool', 'Gym', 'Security', '24/7 Power'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  amenities?: string[];
}
