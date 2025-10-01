import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PropertyService } from './property.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';
import { Property } from './entities/property.entity';
import { PropertyStatus } from '../../common/enums';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new property (Agent only)' })
  @ApiResponse({ status: 201, description: 'Property created successfully', type: Property })
  @ApiResponse({ status: 403, description: 'Forbidden - Agent role required' })
  async create(@Request() req, @Body() createPropertyDto: CreatePropertyDto): Promise<Property> {
    return this.propertyService.create(req.user.id, createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties with optional filters' })
  @ApiResponse({ status: 200, description: 'Properties retrieved successfully', type: [Property] })
  @ApiQuery({ name: 'status', required: false, enum: PropertyStatus })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  async findAll(
    @Query('status') status?: PropertyStatus,
    @Query('type') type?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ): Promise<Property[]> {
    return this.propertyService.findAll({ status, type, city, state, minPrice, maxPrice });
  }

  @Get('approved')
  @ApiOperation({ summary: 'Get all approved properties (public)' })
  @ApiResponse({ status: 200, description: 'Approved properties retrieved', type: [Property] })
  async findApproved(): Promise<Property[]> {
    return this.propertyService.findApproved();
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all properties of the authenticated agent' })
  @ApiResponse({ status: 200, description: 'Agent properties retrieved', type: [Property] })
  async findMyProperties(@Request() req): Promise<Property[]> {
    return this.propertyService.findByAgent(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific property by ID' })
  @ApiResponse({ status: 200, description: 'Property retrieved successfully', type: Property })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Property> {
    return this.propertyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a property (Agent - own properties only)' })
  @ApiResponse({ status: 200, description: 'Property updated successfully', type: Property })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    return this.propertyService.update(id, req.user.id, updatePropertyDto);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit property for approval (Agent)' })
  @ApiResponse({ status: 200, description: 'Property submitted for approval', type: Property })
  async submitForApproval(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Property> {
    return this.propertyService.submitForApproval(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a property (Agent - own properties only)' })
  @ApiResponse({ status: 200, description: 'Property deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<{ message: string }> {
    await this.propertyService.remove(id, req.user.id);
    return { message: 'Property deleted successfully' };
  }
}

